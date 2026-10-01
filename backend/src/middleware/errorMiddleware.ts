import type { ErrorRequestHandler } from "express";
import { config } from "../config/config.js";
import { HttpError } from "../utilities/http.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const status =
    error instanceof HttpError
      ? error.status
      : error?.name === "ValidationError"
        ? 400
        : 500;
  const message =
    error instanceof HttpError
      ? error.message
      : status === 400
        ? "Validation failed."
        : "An unexpected error occurred.";
  if (status === 500 && !config.isProduction) console.error(error);
  res.status(status).json({ message });
};
