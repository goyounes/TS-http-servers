import { Request, Response } from "express";
import { createUser } from "../../db/queries/users.js";
import { NewUser, User } from "../../db/schema.js";
import { BadRequestError } from "../middlewares/errorsClasses.js";
import { respondWithJSON } from "../json.js";

export async function handlerRegister(req:Request, res: Response){
    type parameters = {
        email: string;
    };
    const params: parameters = req.body;

    if(!params.email){
        throw new BadRequestError("Missing required fields");
    }
    const newUser: NewUser = {
        email: req.body.email
    }
    const user: User = await createUser(newUser)


    if (!user) {
        throw new Error("Could not create user");
    }
    

    respondWithJSON(res, 201, user)

}