import { Request, Response } from "express";
import { config } from "../config.js"
import { deleteAllUsers } from "../db/queries/users.js";

export async function handlerResetMetrics(req:Request, res: Response){
    config.api.fileserverHits = 0
    if (config.api.platform !== "dev"){
        res.status(403).send()
    } else {
        try {
           await deleteAllUsers()
           res.status(200).send()
        } catch (error) {
            throw new Error("failed to delete users")
        }
    }


}