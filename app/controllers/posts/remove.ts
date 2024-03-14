import Post from "@app/models/post";
import { Response, Request } from "express";

export default async function postRemove(request: Request, response: Response) {
  const post = await (Post as any).findByPkOrFail(request.params.id);

  if (post.UserId !== request.auth.id) {
    return response.status(403).json("forbidden");
  }

  await post.destroy();
  response.end(JSON.stringify(true));
}
