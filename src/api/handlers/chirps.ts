import { Request, Response } from "express";
import { isValidUUID, respondWithJSON } from "../json.js";
import { BadRequestError, NotFoundError, UserForbiddenError } from "../middlewares/errorsClasses.js";
import { Chirp, NewChirp } from "../../db/schema.js";
import { createChirp, deleteChirp, getChirps, getChirp } from "../../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../../config.js";

const MAX_CHIRP_LENGTH = 140;

function replaceProfaneWords (text: string){
    const words = text.split(" ")
    for (let i = 0; i < words.length; i++){
        if (words[i].toLowerCase() === "kerfuffle") words[i] = "****"
        if (words[i].toLowerCase() === "sharbert") words[i] = "****"
        if (words[i].toLowerCase() === "fornax") words[i] = "****"
    }
    return words.join(" ")
}

export function validateChirp(body: string): string {
    if (body.length > MAX_CHIRP_LENGTH) {
        throw new BadRequestError(`Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`);
    }
    return replaceProfaneWords(body);
}

export async function handlerCreateChrip(req: Request, res: Response) {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;
    if (!params.body){
        throw new BadRequestError("Missing required fields");
    }
    const token = getBearerToken(req)

    const userId = validateJWT(token, config.api.secret)

    const cleanBody = validateChirp(params.body);

    const newChirp: NewChirp = {
        body: cleanBody,
        userId: userId,
    };

    const chirp: Chirp = await createChirp(newChirp);
    if (!chirp) {
        throw new Error("Could not create chirp");
    }
    respondWithJSON(res, 201, chirp);
}

export async function handlerDeleteChrip(req: Request, res: Response) {
    const { chirpId } = req.params

    if (typeof chirpId!=="string" || !isValidUUID(chirpId) ){
        throw new BadRequestError("Bad UUID")
    }

    const token = getBearerToken(req)
    const userId = validateJWT(token, config.api.secret)

    const chirp: Chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError("Could not find chirp");
    }
    if (chirp.userId !== userId) {
        throw new UserForbiddenError("User not authorized to delete this chirp");
    }

    await deleteChirp(chirpId);

    res.sendStatus(204);
}

export async function handlerGetChirps (req:Request, res: Response){
    let authorId = "";
    const authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    let sort : "asc" | "desc" = "asc";
    const sortQuery = req.query.sort;
    if (typeof sortQuery === "string" && (sortQuery === "asc" || sortQuery === "desc")) {
        sort = sortQuery;
        console.log("set sort to:", sort)
    }
    const rows = await getChirps(authorId,sort)

    respondWithJSON(res, 200, rows)
}

export async function handlerGetChirp (req:Request, res: Response){
    const { chirpId } = req.params

    if (typeof chirpId!=="string" || !isValidUUID(chirpId) ){
        throw new BadRequestError("Bad UUID")
    }

    const chirp: Chirp = await getChirp(chirpId)

    if(!chirp){
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`)
    }

    respondWithJSON(res, 200, chirp)
}

