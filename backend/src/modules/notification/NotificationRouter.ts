import { Router } from "express";
import { Notification } from "./NotificationModel.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { assertObjectId, HttpError, sendData } from "../../utilities/http.js";
const router = Router();
router.use(requireAuth);
const format = (item: {
  _id: { toString(): string };
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}) => ({
  id: item._id.toString(),
  type: item.type,
  message: item.message,
  isRead: item.isRead,
  createdAt: item.createdAt.toISOString(),
});
router.get("/", async (req, res) =>
  sendData(
    res,
    (await Notification.find({ user: req.userId }).sort({ createdAt: -1 })).map(
      format,
    ),
  ),
);
router.put("/:id/read", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { isRead: true },
    { new: true },
  );
  if (!item) throw new HttpError(404, "Notification not found.");
  sendData(res, format(item), "Notification marked as read.");
});
router.delete("/:id", async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!item) throw new HttpError(404, "Notification not found.");
  sendData(res, null, "Notification deleted.");
});
export default router;
