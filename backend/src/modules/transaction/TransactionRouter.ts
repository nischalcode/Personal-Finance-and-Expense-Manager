import { Router } from "express";
import { Transaction } from "./TransactionModel.js";
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
  type: "income" | "expense";
  title: string;
  amount: number;
  category: { toString(): string };
  paymentMethod: string;
  date: Date;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: item._id.toString(),
  type: item.type,
  title: item.title,
  amount: item.amount,
  categoryId: item.category.toString(),
  paymentMethod: item.paymentMethod,
  date: item.date.toISOString().slice(0, 10),
  notes: item.notes ?? undefined,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});
async function values(body: Record<string, unknown>, userId: unknown) {
  const type = stringValue(body.type, "Type");
  const categoryId = stringValue(body.categoryId ?? body.category, "Category");
  if (type !== "income" && type !== "expense")
    throw new HttpError(400, "Type must be income or expense.");
  if (!categoryId) throw new HttpError(400, "Category is required.");
  assertObjectId(categoryId);
  if (!(await Category.exists({ _id: categoryId, user: userId })))
    throw new HttpError(400, "Category does not belong to you.");
  const date = stringValue(body.date, "Date");
  if (!date || Number.isNaN(Date.parse(date)))
    throw new HttpError(400, "Date is invalid.");
  return {
    type,
    title: stringValue(body.title, "Title"),
    amount: numberValue(body.amount, "Amount"),
    category: categoryId,
    paymentMethod: stringValue(body.paymentMethod, "Payment method"),
    date: new Date(date),
    notes: stringValue(body.notes, "Notes", false),
  };
}
router.get("/", async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 100);
  const filter: Record<string, unknown> = { user: req.userId };
  if (req.query.type === "income" || req.query.type === "expense")
    filter.type = req.query.type;
  if (
    typeof req.query.categoryId === "string" &&
    req.query.categoryId !== "all"
  )
    filter.category = req.query.categoryId;
  if (
    typeof req.query.paymentMethod === "string" &&
    req.query.paymentMethod !== "all"
  )
    filter.paymentMethod = req.query.paymentMethod;
  if (typeof req.query.search === "string" && req.query.search)
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { notes: { $regex: req.query.search, $options: "i" } },
    ];
  if (
    typeof req.query.startDate === "string" ||
    typeof req.query.endDate === "string"
  )
    filter.date = {
      ...(typeof req.query.startDate === "string"
        ? { $gte: new Date(req.query.startDate) }
        : {}),
      ...(typeof req.query.endDate === "string"
        ? { $lte: new Date(`${req.query.endDate}T23:59:59.999Z`) }
        : {}),
    };
  const direction: 1 | -1 = req.query.sortDirection === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> =
    req.query.sortBy === "amount" ? { amount: direction } : { date: direction };
  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Transaction.countDocuments(filter),
  ]);
  sendData(res, { items: items.map(format), total, page, pageSize });
});
router.get("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Transaction.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!item) throw new HttpError(404, "Transaction not found.");
  sendData(res, format(item));
});
router.post("/", async (req, res) => {
  const item = await Transaction.create({
    ...(await values(req.body, req.userId)),
    user: req.userId,
  });
  sendData(res, format(item), "Transaction created.");
});
router.put("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    await values(req.body, req.userId),
    { new: true, runValidators: true },
  );
  if (!item) throw new HttpError(404, "Transaction not found.");
  sendData(res, format(item), "Transaction updated.");
});
router.delete("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!item) throw new HttpError(404, "Transaction not found.");
  sendData(res, null, "Transaction deleted.");
});
export default router;
