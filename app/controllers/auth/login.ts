import User from "@app/models/user";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {
  AUTH_JWT_ALG,
  AUTH_JWT_LIFETIME,
  AUTH_JWT_SECRET,
} from "@app/constants/jwt";

// $2b$10$QLYMLdwwxhlwOkKuiB4KkuN/yNIReAHDXQnAPIysl8ZbaxlTx.qxi
// password

export default async function login(req: Request, resp: Response) {
  const { login, password } = req.body;
  const errors = [];
  let token = null;
  let user = null;

  console.log("login:", req.body);

  if (!login) {
    errors.push("empty login");
  }

  if (!password) {
    errors.push("empty password");
  }

  if (errors.length === 0) {
    user = await User.scope("auth").findOne({
      where: { login },
    });

    console.log(user);

    if (user === null || !(await compare(password, user.password))) {
      errors.push("wrong credentials");
    } else {
      token = jwt.sign(
        {
          id: user.id,
        },
        AUTH_JWT_SECRET,
        { algorithm: AUTH_JWT_ALG, expiresIn: AUTH_JWT_LIFETIME }
      );
    }
  }

  if (errors.length === 0 && user) {
    const { login, id } = user.toJSON();

    resp.json({ user: { id, login }, token });
  } else {
    resp.status(422).json(errors);
  }
}
