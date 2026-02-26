import { Request, Response } from "express";
import { upgradeUser } from "../../db/queries/users.js";
import { BadRequestError, NotFoundError, UserNotAuthenticatedError } from "../middlewares/errorsClasses.js";
import { isValidUUID } from "../json.js";
import { getAPIKey } from "../auth.js";

export async function handlerWebHook(req:Request, res: Response){
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };
    const params: parameters = req.body;

    if(!params.event || !params.data || !params.data.userId){
        throw new BadRequestError("Missing required fields");
    }
    if(!(isValidUUID(params.data.userId))){
        throw new BadRequestError("Bad UUID")
    }

    const expectedKey = process.env.POLKA_KEY
    const receivedKey = getAPIKey(req)

    if (expectedKey !== receivedKey){
        throw new UserNotAuthenticatedError("Invalid API key")
    }

    if (params.event !== "user.upgraded"){
        res.sendStatus(204)
        return
    }
    const result = await upgradeUser(params.data.userId)
    if (!result){
        throw new NotFoundError(`User with id ${params.data.userId} not found`)
    }

    res.sendStatus(204)
}