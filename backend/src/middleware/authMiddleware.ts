import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { config } from "../config/config.js";
import { HttpError } from "../utilities/http.js";

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return next(new HttpError(401, "Authentication is required."));
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
    if (!mongoose.isValidObjectId(payload.sub))
      throw new Error("Invalid token subject");
    req.userId = new mongoose.Types.ObjectId(payload.sub);
    next();
  } catch {
    next(new HttpError(401, "Your session is invalid or has expired."));
  }
}
