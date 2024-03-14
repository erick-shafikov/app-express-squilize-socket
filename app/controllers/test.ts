import { Request, Response } from "express";

export default function test(_request: Request, response: Response) {
  console.log("request to '/' route");
  response.end("server works");
}
