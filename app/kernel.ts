import convertEmptyStringToNull from "@app/middleware/convertEmptyStringToNull";
import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Express } from "express";

export default function initKernel(app: Express) {
  app.use(express.static("public"));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(convertEmptyStringToNull);
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}
