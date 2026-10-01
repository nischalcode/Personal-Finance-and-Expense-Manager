import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../user/UserModel.js";
import { Category, defaultCategories } from "../category/CategoryModel.js";
import { config } from "../../config/config.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { HttpError, sendData, stringValue } from "../../utilities/http.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { sendOtpEmail } from "../../services/emailService.js";

const router = Router();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_OTP_ATTEMPTS = 5;

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked =
    local.length <= 2
      ? "*".repeat(local.length)
      : local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
  return `${masked}@${domain}`;
}

const publicUser = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  currency: string;
  dateFormat: string;
  createdAt: Date;
}) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone ?? undefined,
  profileImageUrl: user.profileImage ?? undefined,
  currency: user.currency,
  dateFormat: user.dateFormat,
  createdAt: user.createdAt.toISOString(),
});

const tokenFor = (id: { toString(): string }) =>
  jwt.sign({ sub: id.toString() }, config.jwtSecret, { expiresIn: "7d" });

// ── REGISTER ─────────────────────────────────────────────────
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const name = stringValue(req.body.name, "Name");
    const email = stringValue(req.body.email, "Email")?.toLowerCase();
    const password = stringValue(req.body.password, "Password");
    if (!email?.includes("@"))
      throw new HttpError(400, "A valid email is required.");
    if (!password || password.length < 6)
      throw new HttpError(400, "Password must be at least 6 characters.");
    if (await User.exists({ email }))
      throw new HttpError(409, "An account with this email already exists.");

    const otp = generateOtp();
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      isVerified: false,
      otpHash: await hashOtp(otp),
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
    });

    await Category.insertMany(
      defaultCategories.map((category) => ({
        ...category,
        user: user._id,
        isDefault: true,
      })),
    );

    // Send OTP email (fire-and-forget with error logging)
    sendOtpEmail(email, otp).catch((err) =>
      console.error("Failed to send OTP email:", err.message),
    );

    res.status(201).json({
      data: null,
      message: "Registration successful. Please verify your email.",
      requiresVerification: true,
      email: maskEmail(email),
    });
  }),
);

// ── VERIFY OTP ───────────────────────────────────────────────
router.post(
  "/verify-otp",
  asyncHandler(async (req, res) => {
    const email = stringValue(req.body.email, "Email")?.toLowerCase();
    const otp = stringValue(req.body.otp, "Verification code");
    if (!email || !otp)
      throw new HttpError(400, "Email and code are required.");

    const user = await User.findOne({ email }).select(
      "+otpHash",
    );
    if (!user)
      throw new HttpError(400, "Invalid or expired verification code.");
    if (user.isVerified)
      throw new HttpError(400, "Email is already verified.");

    if ((user as any).otpAttempts >= MAX_OTP_ATTEMPTS)
      throw new HttpError(
        429,
        "Too many attempts. Please request a new verification code.",
      );

    const otpHash = (user as any).otpHash as string | undefined;
    const otpExpiresAt = (user as any).otpExpiresAt as Date | undefined;

    if (!otpHash || !otpExpiresAt || otpExpiresAt < new Date()) {
      throw new HttpError(400, "Invalid or expired verification code.");
    }

    const isValid = await bcrypt.compare(otp, otpHash);
    if (!isValid) {
      await User.updateOne({ _id: user._id }, { $inc: { otpAttempts: 1 } });
      throw new HttpError(400, "Invalid or expired verification code.");
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: { isVerified: true },
        $unset: { otpHash: 1, otpExpiresAt: 1, otpAttempts: 1 },
      },
    );

    sendData(res, null, "Email verified successfully.");
  }),
);

// ── RESEND OTP ───────────────────────────────────────────────
router.post(
  "/resend-otp",
  asyncHandler(async (req, res) => {
    const email = stringValue(req.body.email, "Email")?.toLowerCase();
    if (!email) throw new HttpError(400, "Email is required.");

    const user = await User.findOne({ email });
    if (!user || user.isVerified) {
      // Don't reveal whether email exists
      sendData(
        res,
        null,
        "If that email is registered and unverified, a new code has been sent.",
      );
      return;
    }

    const lastSent = (user as any).lastOtpSentAt as Date | undefined;
    if (lastSent && Date.now() - lastSent.getTime() < OTP_RESEND_COOLDOWN_MS) {
      throw new HttpError(429, "Please wait before requesting a new code.");
    }

    const otp = generateOtp();
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          otpHash: await hashOtp(otp),
          otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
          otpAttempts: 0,
          lastOtpSentAt: new Date(),
        },
      },
    );

    sendOtpEmail(email, otp).catch((err) =>
      console.error("Failed to send OTP email:", err.message),
    );

    sendData(
      res,
      null,
      "If that email is registered and unverified, a new code has been sent.",
    );
  }),
);

// ── LOGIN ────────────────────────────────────────────────────
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = stringValue(req.body.email, "Email")?.toLowerCase();
    const password = stringValue(req.body.password, "Password");
    const user = (await User.findOne({ email }).select("+password")) as any;
    if (!user || !password || !(await bcrypt.compare(password, user.password)))
      throw new HttpError(401, "Invalid email or password.");

    if (!user.isVerified) {
      res.status(403).json({
        message: "Please verify your email before logging in.",
        requiresVerification: true,
        email: maskEmail(user.email),
      });
      return;
    }

    sendData(
      res,
      { user: publicUser(user), token: tokenFor(user._id) },
      "Logged in.",
    );
  }),
);

// ── LOGOUT ───────────────────────────────────────────────────
router.post("/logout", requireAuth, (_req, res) => {
  sendData(res, null, "Logged out.");
});

// ── ME ───────────────────────────────────────────────────────
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) throw new HttpError(404, "User not found.");
    sendData(res, publicUser(user));
  }),
);

// ── CHANGE PASSWORD ──────────────────────────────────────────
router.put(
  "/change-password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const currentPassword = stringValue(
      req.body.currentPassword,
      "Current password",
    );
    const newPassword = stringValue(req.body.newPassword, "New password");
    if (!newPassword || newPassword.length < 6)
      throw new HttpError(400, "New password must be at least 6 characters.");
    const user = await User.findById(req.userId).select("+password");
    if (
      !user ||
      !currentPassword ||
      !(await bcrypt.compare(currentPassword, user.password))
    )
      throw new HttpError(400, "Current password is incorrect.");
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    sendData(res, null, "Password updated.");
  }),
);

export default router;
