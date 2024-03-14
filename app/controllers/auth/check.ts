import User from "@app/models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AUTH_JWT_ALG, AUTH_JWT_SECRET } from "@app/constants/jwt";

export default async function check(request: Request, response: Response) {
  const header = request.headers.authorization ?? "Bearer null";
  const [_, token] = header.split(" ");

  try {
    const tokenData = jwt.verify(token, AUTH_JWT_SECRET, {
      algorithms: [AUTH_JWT_ALG],
    }) as { id: string };
    const user = await User.findByPk(tokenData.id);
    response.json({ auth: true, user });
  } catch (e) {
    response.json({ auth: false });
  }
}
