import { Router } from "express";
import { User } from "./UserModel.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { HttpError, sendData, stringValue } from "../../utilities/http.js";
const router = Router();
router.use(requireAuth);
const format = (user: {
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
  phone: user.phone,
  profileImageUrl: user.profileImage,
  currency: user.currency,
  dateFormat: user.dateFormat,
  createdAt: user.createdAt.toISOString(),
});
router.get("/profile", async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(404, "User not found.");
  sendData(res, format(user));
});
router.put("/profile", async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(404, "User not found.");
  const name = stringValue(req.body.name, "Name", false);
  const phone = stringValue(req.body.phone, "Phone", false);
  const currency = stringValue(req.body.currency, "Currency", false);
  const dateFormat = stringValue(req.body.dateFormat, "Date format", false);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (currency) user.currency = currency;
  if (dateFormat) user.dateFormat = dateFormat;
  await user.save();
  sendData(res, format(user), "Profile updated.");
});
export default router;
