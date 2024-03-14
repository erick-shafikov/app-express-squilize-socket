import { Request, Response, NextFunction } from "express";

export default function convertEmptyStringToNull(
  request: Request,
  _: Response,
  next: NextFunction
) {
  if (request.body && typeof request.body === "object") {
    const body = request.body as Record<string, any>;

    for (let key in body) {
      if (typeof body[key] === "string") {
        body[key] = body[key].trim();
      }

      if (body[key] === "") {
        body[key] = null;
      }
    }
  }

  next();
}
