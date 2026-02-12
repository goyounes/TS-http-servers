import { Request, Response, NextFunction } from "express";
export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (!(200 <= res.statusCode && res.statusCode <= 299)){
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    });
    next();
}