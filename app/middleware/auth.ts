import jwt, { Algorithm } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AUTH_JWT_ALG, AUTH_JWT_SECRET } from "@app/constants/jwt";

export default function auth(req: Request, resp: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "Bearer null";
  // console.log("header:", header);

  const [_, token] = header.split(" ");

  // console.log("token:", token);

  try {
    const tokenData = jwt.verify(token, AUTH_JWT_SECRET, {
      algorithms: [AUTH_JWT_ALG],
    });
    req.auth = tokenData;
    next();
  } catch (e) {
    resp.status(401).end("");
  }
}
