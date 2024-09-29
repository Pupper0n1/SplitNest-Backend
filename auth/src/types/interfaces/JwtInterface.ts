export interface JwtPayload {
  id: number;
}

export interface CustomRequest extends Request {
  userId?: number;
}
