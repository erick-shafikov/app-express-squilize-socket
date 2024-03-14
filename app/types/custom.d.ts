declare namespace Express {
  export interface Request {
    auth?: string | jwt.JwtPayload;
  }
}
