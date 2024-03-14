import Post from "@app/models/post";
import User from "@app/models/user";
import { Request, Response } from "express";

export default async function postsAll(_req: Request, resp: Response) {
  const posts = await Post.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
    include: [User],
  });

  resp.json(posts);
}
