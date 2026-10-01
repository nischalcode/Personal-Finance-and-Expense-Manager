import { Schema, model } from "mongoose";
export const Notification = model(
  "Notification",
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      title: { type: String, required: true },
      message: { type: String, required: true },
      type: { type: String, default: "general" },
      isRead: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);
