import { Request, Response } from "express";
import { config } from "../../config.js"
import { deleteAllUsers } from "../../db/queries/users.js";
import { UserForbiddenError } from "../middlewares/errorsClasses.js";

export async function handlerResetMetrics(req:Request, res: Response){
    config.api.fileserverHits = 0
    
    if (config.api.platform !== "dev"){
        throw new UserForbiddenError("Reset is only allowed in dev environment.");
    }

    await deleteAllUsers()
    res.status(200).send()
}