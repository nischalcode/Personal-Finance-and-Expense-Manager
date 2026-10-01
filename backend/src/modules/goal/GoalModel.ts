import { Schema, model } from "mongoose";
export const Goal = model(
  "Goal",
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      title: { type: String, required: true, trim: true },
      description: String,
      targetAmount: { type: Number, required: true, min: 0 },
      currentAmount: { type: Number, required: true, min: 0 },
      deadline: { type: Date, required: true },
      status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
      },
    },
    { timestamps: true },
  ),
);
