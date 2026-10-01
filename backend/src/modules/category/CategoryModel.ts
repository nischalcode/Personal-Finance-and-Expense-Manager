import { Schema, model } from "mongoose";
export const Category = model(
  "Category",
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      name: { type: String, required: true, trim: true },
      type: { type: String, enum: ["income", "expense"], required: true },
      color: { type: String, default: "#64748b" },
      icon: String,
      isDefault: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);
export const defaultCategories = [
  ...[
    "Food",
    "Transportation",
    "Shopping",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Rent",
    "Travel",
    "Other",
  ].map((name) => ({ name, type: "expense" })),
  ...["Salary", "Freelance", "Business", "Investment", "Gift", "Other"].map(
    (name) => ({ name, type: "income" }),
  ),
];
