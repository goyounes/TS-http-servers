import { Request, Response } from "express";
import { config } from "../config.js"

export function handlerResetMetrics(req:Request, res: Response){
    config.api.fileserverHits = 0
    res.set({
        'Content-Type': 'text/plain; charset=utf-8'
    })
    res.status(200).send(`Hits reset back to 0`)
}