import { app } from "src/main";
import { handlerMetrics } from "./handlerMetrics";
import { handlerReadiness } from "./handlerReadiness";
import { handlerResetMetrics } from "./handlerResetMetrics";
import { handlerValidateChirp } from "./handlerValidateChirp";
import { handlerRegister } from "./users";
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