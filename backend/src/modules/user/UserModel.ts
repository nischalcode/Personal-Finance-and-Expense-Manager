import { Schema, model, type InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    profileImage: String,
    currency: { type: String, default: "NPR" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    otpHash: { type: String, select: false },
    otpExpiresAt: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date },
    status: { type: String, default: "active" },
  },
  { timestamps: true },
);
userSchema.methods.comparePassword = function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: unknown;
  comparePassword(password: string): Promise<boolean>;
};
export const User = model("User", userSchema);
