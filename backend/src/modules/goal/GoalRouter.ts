import { Router } from "express";
import { Goal } from "./GoalModel.js";
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
  title: string;
  description?: string | null;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  createdAt: Date;
}) => ({
  id: item._id.toString(),
  name: item.title,
  description: item.description ?? undefined,
  targetAmount: item.targetAmount,
  currentAmount: item.currentAmount,
  deadline: item.deadline.toISOString().slice(0, 10),
  createdAt: item.createdAt.toISOString(),
});
function values(body: Record<string, unknown>) {
  const deadline = stringValue(body.deadline, "Deadline");
  if (!deadline || Number.isNaN(Date.parse(deadline)))
    throw new HttpError(400, "Deadline is invalid.");
  const targetAmount = numberValue(body.targetAmount, "Target amount");
  const currentAmount = numberValue(body.currentAmount, "Current amount");
  if (currentAmount > targetAmount)
    throw new HttpError(400, "Current amount cannot exceed target amount.");
  return {
    title: stringValue(body.name ?? body.title, "Name"),
    description: stringValue(body.description, "Description", false),
    targetAmount,
    currentAmount,
    deadline: new Date(deadline),
    status: currentAmount === targetAmount ? "completed" : "active",
  };
}
router.get("/", async (req, res) =>
  sendData(
    res,
    (await Goal.find({ user: req.userId }).sort({ deadline: 1 })).map(format),
  ),
);
router.get("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Goal.findOne({ _id: req.params.id, user: req.userId });
  if (!item) throw new HttpError(404, "Goal not found.");
  sendData(res, format(item));
});
router.post("/", async (req, res) => {
  const item = await Goal.create({ ...values(req.body), user: req.userId });
  sendData(res, format(item), "Goal created.");
});
router.put("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    values(req.body),
    { new: true, runValidators: true },
  );
  if (!item) throw new HttpError(404, "Goal not found.");
  sendData(res, format(item), "Goal updated.");
});
router.delete("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Goal.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!item) throw new HttpError(404, "Goal not found.");
  sendData(res, null, "Goal deleted.");
});
export default router;
