import express, { NextFunction, Response, Request } from "express"
import { BadRequestError, NotFoundError, UserForbiddenError, UserNotAuthenticatedError } from "./errorsClasses.js";

export function errorMiddleware(err: Error, _: Request, res: Response, __: NextFunction) {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
        console.log(err.message);
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }

    if (statusCode >= 500) {
        console.log(err.message);
    }
    res.status(statusCode).send(JSON.stringify({error: message}));
}