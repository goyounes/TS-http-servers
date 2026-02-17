import { Request, Response } from "express";
import { config } from "../config.js"

export async function handlerValidateChirp(req: Request, res: Response) {

    const parsedBody = req.body;
    // now you can use `parsedBody` as a JavaScript object
    if (!parsedBody.body){
        res.status(400).send(JSON.stringify({"error": "Something went wrong"}))
        return
    }

    if (parsedBody.body.length > 140){
        res.status(400).send(JSON.stringify({"error": "Chirp is too long"}))
        return
    }

    res.status(200).send(JSON.stringify({"valid": true}))

}