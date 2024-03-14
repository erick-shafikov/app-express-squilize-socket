import { Express } from "express";
import test from "@app/controllers/test";
import Router from "@app/core/router.js";
import auth from "@app/middleware/auth";
import check from "@app/controllers/auth/check";
import login from "@app/controllers/auth/login";
import postsAll from "@app/controllers/posts/all";
import postCreate from "@app/controllers/posts/create";
import postOne from "@app/controllers/posts/one";
import postRemove from "@app/controllers/posts/remove";
import postUpdate from "@app/controllers/posts/update";
import { initSocket } from "@app/controllers/socket";
import { Server } from "http";
import socketTest from "./controllers/socket-test";

export default function registerRoutes(app: Express, server: Server) {
  const router = new Router(app);

  console.log("router work");

  router.get("/auth/check", check);
  router.post("/auth/login", login);

  router.get("/posts", postsAll);
  router.get("/posts/:id", postOne);
  router.post("/posts", postCreate, [auth]);
  router.delete("/posts/:id", postRemove, [auth]);
  router.put("/posts/:id", postUpdate, [auth]);
  router.get("/", test, [auth]);

  // socketTest(server);

  initSocket(server);
}
