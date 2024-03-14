import { Algorithm } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET || "";
export const AUTH_JWT_ALG = process.env.AUTH_JWT_ALG as Algorithm;
export const AUTH_JWT_LIFETIME = process.env.AUTH_JWT_LIFETIME || 3600 * 1000;
