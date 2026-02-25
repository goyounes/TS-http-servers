import { NextFunction, Request, Response, RequestHandler } from "express";

type AsyncHandler<P = any> = (
  req: Request<P>,
  res: Response,
  next: NextFunction
) => Promise<void> | void

export function asyncHandler<P = any> ( fn: AsyncHandler<P>): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(fn(req as Request<P>, res, next)).catch(next);
    };
}