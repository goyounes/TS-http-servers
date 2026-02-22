import { NextFunction, Request, Response, RequestHandler } from "express";

type AsyncHandler = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => Promise<void> | void;

export function asyncHandler(fn: AsyncHandler): RequestHandler {
    return function(req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
}