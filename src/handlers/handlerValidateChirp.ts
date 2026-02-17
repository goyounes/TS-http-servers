import { Request, Response, NextFunction } from "express";
import { config } from "../config.js"

export async function handlerValidateChirp(req: Request, res: Response, next: NextFunction) {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;
    // now you can use `parsedBody` as a JavaScript object
    if (!params.body){
        // res.status(400).send(JSON.stringify({"error": "Something went wrong"}))
        next(new Error())
        return
    }

    if (params.body.length > 140){
        // res.status(400).send(JSON.stringify({"error": "Chirp is too long"}))
        next(new Error())
        return
    }

    const cleanText = replaceProfaneWords(params.body)
    res.status(200).send(JSON.stringify({"cleanedBody": cleanText}))

}

function replaceProfaneWords (text: string){
    const words = text.split(" ")
    for (let i = 0; i < words.length; i++){
        if (words[i].toLowerCase() === "kerfuffle") words[i] = "****"
        if (words[i].toLowerCase() === "sharbert") words[i] = "****"
        if (words[i].toLowerCase() === "fornax") words[i] = "****"
    }
    return words.join(" ")
}