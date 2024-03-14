import Post from "@app/models/post";
import { Request, Response } from "express";

export default async function postUpdate(request: Request, response: Response) {
  // TODO as any
  const post = await (Post as any).findByPkOrFail(request.params.id);

  if (post.UserId !== request.auth.id) {
    return response.status(403).json("forbidden");
  }

  const { title, content } = request.body;
  await post.update({ title, content });

  response.end(JSON.stringify(post));
}
