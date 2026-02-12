import { Request, Response } from "express";
import { config } from "../config.js"

export function handlerMetrics(req:Request, res: Response){
    res.set({
        'Content-Type': 'text/html; charset=utf-8'
    })
    res.status(200).send(`
        <html>
            <body>
                <h1>Welcome, Chirpy Admin</h1>
                <p>Chirpy has been visited ${config.fileserverHits} times!</p>
            </body>
        </html>
    `)
}