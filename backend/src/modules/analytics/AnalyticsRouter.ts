import { Router } from "express";
import { Transaction } from "../transaction/TransactionModel.js";
import { Category } from "../category/CategoryModel.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { sendData } from "../../utilities/http.js";
const router = Router();
router.use(requireAuth);
const monthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
router.get("/summary", async (req, res) => {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const [all, current] = await Promise.all([
    Transaction.find({ user: req.userId }),
    Transaction.find({ user: req.userId, date: { $gte: start } }),
  ]);
  const sum = (items: typeof current, type: string) =>
    items
      .filter((item) => item.type === type)
      .reduce((total, item) => total + item.amount, 0);
  const income = sum(current, "income");
  const expenses = sum(current, "expense");
  const balance = all.reduce(
    (total, item) =>
      total + (item.type === "income" ? item.amount : -item.amount),
    0,
  );
  sendData(res, {
    currentBalance: balance,
    totalIncome: income,
    totalExpenses: expenses,
    totalSavings: income - expenses,
    periodLabel: "This Month",
  });
});
router.get("/monthly", async (req, res) => {
  const months = Math.min(Math.max(Number(req.query.months) || 6, 1), 24);
  const start = new Date();
  start.setUTCMonth(start.getUTCMonth() - months + 1, 1);
  start.setUTCHours(0, 0, 0, 0);
  const transactions = await Transaction.find({
    user: req.userId,
    date: { $gte: start },
  });
  const result = Array.from({ length: months }, (_, index) => {
    const date = new Date(start);
    date.setUTCMonth(start.getUTCMonth() + index);
    const key = monthKey(date);
    const items = transactions.filter((item) => monthKey(item.date) === key);
    return {
      month: date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      income: items
        .filter((item) => item.type === "income")
        .reduce((total, item) => total + item.amount, 0),
      expenses: items
        .filter((item) => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0),
    };
  });
  sendData(res, result);
});
router.get("/categories", async (req, res) => {
  const start =
    typeof req.query.startDate === "string"
      ? new Date(req.query.startDate)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end =
    typeof req.query.endDate === "string"
      ? new Date(`${req.query.endDate}T23:59:59.999Z`)
      : new Date();
  const transactions = await Transaction.find({
    user: req.userId,
    type: "expense",
    date: { $gte: start, $lte: end },
  });
  const categories = await Category.find({ user: req.userId });
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);
  const amounts = new Map<string, number>();
  transactions.forEach((item) => {
    const key = item.category.toString();
    amounts.set(key, (amounts.get(key) ?? 0) + item.amount);
  });
  sendData(
    res,
    [...amounts]
      .map(([categoryId, amount]) => {
        const category = categories.find(
          (item) => item._id.toString() === categoryId,
        );
        return {
          categoryId,
          categoryName: category?.name ?? "Unknown",
          amount,
          color: category?.color ?? "#64748b",
          percentage: total ? Math.round((amount / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount),
  );
});
router.get("/cashflow", async (req, res) => {
  const months = Number(req.query.months) || 6;
  const url = new URL(req.originalUrl, "http://localhost");
  url.pathname = "/monthly";
  url.searchParams.set("months", String(months));
  req.url = `${url.pathname}${url.search}`;
  router.handle(req, res);
});
export default router;
