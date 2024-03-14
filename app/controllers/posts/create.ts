import eventBus from "@app/global/events";
import Post from "@app/models/post";
import { Request, Response } from "express";

export default async function postCreate(request: Request, response: Response) {
  const { title, content } = request.body;
  const post = await Post.create({
    title,
    content,
    UserId: request.auth.id,
  });
  eventBus.emit("Model.Post.created", post);
  response.end(JSON.stringify(post));
}
