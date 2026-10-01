import { Schema, model } from "mongoose";
export const Transaction = model(
  "Transaction",
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      type: { type: String, enum: ["income", "expense"], required: true },
      title: { type: String, required: true, trim: true },
      description: String,
      amount: { type: Number, required: true, min: 0 },
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true,
      },
      paymentMethod: { type: String, required: true },
      date: { type: Date, required: true, index: true },
      notes: String,
    },
    { timestamps: true },
  ),
);
