import { Schema, model } from "mongoose";
export const Budget = model(
  "Budget",
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      amount: { type: Number, required: true, min: 0 },
      month: { type: String, required: true },
    },
    { timestamps: true },
  ),
);
