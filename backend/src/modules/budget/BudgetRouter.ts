import { Router } from "express";
import { Budget } from "./BudgetModel.js";
import { Category } from "../category/CategoryModel.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  assertObjectId,
  HttpError,
  numberValue,
  sendData,
  stringValue,
} from "../../utilities/http.js";
const router = Router();
router.use(requireAuth);
const format = (item: {
  _id: { toString(): string };
  category: { toString(): string };
  amount: number;
  month: string;
}) => ({
  id: item._id.toString(),
  categoryId: item.category.toString(),
  monthlyLimit: item.amount,
  month: item.month,
});
async function values(body: Record<string, unknown>, userId: unknown) {
  const categoryId = stringValue(body.categoryId ?? body.category, "Category");
  const month = stringValue(body.month, "Month");
  if (!categoryId || !month || !/^\d{4}-\d{2}$/.test(month))
    throw new HttpError(400, "Month must use YYYY-MM format.");
  assertObjectId(categoryId);
  if (!(await Category.exists({ _id: categoryId, user: userId })))
    throw new HttpError(400, "Category does not belong to you.");
  return {
    category: categoryId,
    amount: numberValue(body.monthlyLimit ?? body.amount, "Monthly limit"),
    month,
  };
}
router.get("/", async (req, res) => {
  const filter: Record<string, unknown> = { user: req.userId };
  if (typeof req.query.month === "string") filter.month = req.query.month;
  sendData(res, (await Budget.find(filter).sort({ month: -1 })).map(format));
});
router.get("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Budget.findOne({ _id: req.params.id, user: req.userId });
  if (!item) throw new HttpError(404, "Budget not found.");
  sendData(res, format(item));
});
router.post("/", async (req, res) => {
  const data = await values(req.body, req.userId);
  const existing = await Budget.findOne({
    user: req.userId,
    category: data.category,
    month: data.month,
  });
  if (existing)
    throw new HttpError(
      409,
      "A budget already exists for this category and month.",
    );
  const item = await Budget.create({ ...data, user: req.userId });
  sendData(res, format(item), "Budget created.");
});
router.put("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    await values(req.body, req.userId),
    { new: true, runValidators: true },
  );
  if (!item) throw new HttpError(404, "Budget not found.");
  sendData(res, format(item), "Budget updated.");
});
router.delete("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Budget.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!item) throw new HttpError(404, "Budget not found.");
  sendData(res, null, "Budget deleted.");
});
export default router;
