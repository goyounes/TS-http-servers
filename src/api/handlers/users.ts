import { Request, Response } from "express";
import { createUser } from "../../db/queries/users.js";
import { NewUser, User, UserResponse } from "../../db/schema.js";
import { BadRequestError } from "../middlewares/errorsClasses.js";
import { respondWithJSON } from "../json.js";
import { hashPasword } from "../auth.js";

export async function handlerRegister(req:Request, res: Response){
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if(!params.email || !params.password){
        throw new BadRequestError("Missing required fields");
    }

    const hash = await hashPasword(params.password)

    const newUser: NewUser = {
        email: params.email,
        hashedPassword: hash
    }

    const user: UserResponse = await createUser(newUser)
    
    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, user)

}