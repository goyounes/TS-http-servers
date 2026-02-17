import { Request, Response } from "express";
import { config } from "../config.js"

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;
    // now you can use `parsedBody` as a JavaScript object
    if (!params.body){
        res.status(400).send(JSON.stringify({"error": "Something went wrong"}))
        return
    }

    if (params.body.length > 140){
        res.status(400).send(JSON.stringify({"error": "Chirp is too long"}))
        return
    }

    const cleanText = replaceProfaneWords(params.body)
    res.status(200).send(JSON.stringify({"cleanedBody": cleanText}))

}

function replaceProfaneWords (text: string){
    console.log(text)
    const words = text.split(" ")
    console.log(words)
    for (let i = 0; i < words.length; i++){
        if (words[i].toLowerCase() === "kerfuffle") words[i] = "****"
        if (words[i].toLowerCase() === "sharbert") words[i] = "****"
        if (words[i].toLowerCase() === "fornax") words[i] = "****"
    }
    return words.join(" ")
}