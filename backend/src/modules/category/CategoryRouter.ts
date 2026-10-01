import { Router } from "express";
import { Category } from "./CategoryModel.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  assertObjectId,
  HttpError,
  sendData,
  stringValue,
} from "../../utilities/http.js";
const router = Router();
router.use(requireAuth);
const format = (item: {
  _id: { toString(): string };
  name: string;
  type: "income" | "expense";
  color: string;
  icon?: string | null;
  isDefault: boolean;
}) => ({
  id: item._id.toString(),
  name: item.name,
  kind: item.type,
  color: item.color,
  icon: item.icon ?? undefined,
  isDefault: item.isDefault,
});
function values(body: Record<string, unknown>) {
  const name = stringValue(body.name, "Name");
  const kind = stringValue(body.kind ?? body.type, "Category type");
  if (kind !== "income" && kind !== "expense")
    throw new HttpError(400, "Category type must be income or expense.");
  return {
    name,
    type: kind,
    color: stringValue(body.color, "Color", false) ?? "#64748b",
    icon: stringValue(body.icon, "Icon", false),
  };
}
router.get("/", async (req, res) =>
  sendData(
    res,
    (await Category.find({ user: req.userId }).sort({ name: 1 })).map(format),
  ),
);
router.get("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Category.findOne({ _id: req.params.id, user: req.userId });
  if (!item) throw new HttpError(404, "Category not found.");
  sendData(res, format(item));
});
router.post("/", async (req, res) => {
  const item = await Category.create({ ...values(req.body), user: req.userId });
  sendData(res, format(item), "Category created.");
});
router.put("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    values(req.body),
    { new: true, runValidators: true },
  );
  if (!item) throw new HttpError(404, "Category not found.");
  sendData(res, format(item), "Category updated.");
});
router.delete("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
    isDefault: false,
  });
  if (!item)
    throw new HttpError(404, "Category not found or is a default category.");
  sendData(res, null, "Category deleted.");
});
export default router;
