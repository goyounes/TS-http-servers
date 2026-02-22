import { Request, Response } from "express";
import { BadRequestError } from "../middlewares/errorsClasses.js";


export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;

    if (!params.body){
        throw new Error()
    }
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength){
        const message = `Chirp is too long. Max length is ${maxChirpLength}`
        console.log(message)
        throw new BadRequestError(message)
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