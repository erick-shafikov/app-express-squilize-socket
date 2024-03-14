import Post from "@app/models/post";
import User from "@app/models/user";
import { Response, Request } from "express";

export default async function postOne(req: Request, resp: Response) {
  // TODO as any
  const post = await (Post as any).findByPkOrFail(req.params.id, {
    order: [["createdAt", "DESC"]],
    limit: 10,
    include: [User],
  });

  resp.json(post);
}
