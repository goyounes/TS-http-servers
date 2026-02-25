import { Request, Response } from "express";
import { isValidUUID, respondWithJSON } from "../json.js";
import { BadRequestError, NotFoundError } from "../middlewares/errorsClasses.js";
import { Chirp, chirps, NewChirp } from "../../db/schema.js";
import { createChirp, getAllChirps, getChirp } from "../../db/queries/chirps.js";

export async function handlerCreateChrip(req:Request, res: Response){
    type parameters = {
        body: string;
        userId: string;
    };
    const params: parameters = req.body;

    if (!params.body){
        throw new BadRequestError("JSON Invalid format")
    }

    const MAX_CHRIP_LENGTH = 140;
    if (params.body.length > MAX_CHRIP_LENGTH){
        throw new BadRequestError(`Chirp is too long. Max length is ${MAX_CHRIP_LENGTH}`)
    }

    const cleanText = replaceProfaneWords(params.body)

    const newChirp : NewChirp = {
        body: cleanText,
        userId: params.userId //|| "9c5d6f6f-4f15-4b86-9408-4d7fefe556f3"
    } 
    console.log(newChirp)

    const chirp : Chirp = await createChirp(newChirp)
    if (!chirp) {
        throw new Error("Could not create chirp");
    }
    respondWithJSON(res, 201, chirp)

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


export async function handlerGetChirps (req:Request, res: Response){
    const rows = await getAllChirps()
    respondWithJSON(res, 200, rows)
}

export async function handlerGetChirp (req:Request<{id:string}>, res: Response){
    const chirpId: string = req.params.id
    if (!isValidUUID(chirpId)) {
        throw new BadRequestError("Bad UUID")
    }

    const chirp: Chirp = await getChirp(chirpId)
    console.log(chirp)
    if(!chirp){
        throw new NotFoundError("No chirp found with this id")
    }

    respondWithJSON(res, 200, chirp)
}

