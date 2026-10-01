import type { Response } from "express";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function sendData<T>(
  res: Response,
  data: T,
  message?: string,
  meta?: Record<string, unknown>,
): void {
  res.json({
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
  });
}

export function assertObjectId(id: string): void {
  if (!/^[a-f\d]{24}$/i.test(id))
    throw new HttpError(400, "Invalid resource id.");
}

export function stringValue(
  value: unknown,
  field: string,
  required = true,
): string | undefined {
  if (value === undefined || value === null || value === "") {
    if (required) throw new HttpError(400, `${field} is required.`);
    return undefined;
  }
  if (typeof value !== "string")
    throw new HttpError(400, `${field} must be a string.`);
  return value.trim();
}

export function numberValue(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    throw new HttpError(400, `${field} must be a positive number.`);
  return value;
}
