import { Request, Response } from "express";
import { createUser } from "../../db/queries/users.js";
import { NewUser, User } from "../../db/schema.js";

export async function handlerRegister(req:Request, res: Response){

    if (!req.body){
        throw new Error("No JSON set")
    }
    if(!req.body.email){
        throw new Error("No email field set")
    }
    const newUser: NewUser = {
        email: req.body.email
    }
    try {
        const user: User = await createUser(newUser)
        res.status(201).send(JSON.stringify(user))
    } catch (error) {
        throw new Error("register operation failed")
    }
}