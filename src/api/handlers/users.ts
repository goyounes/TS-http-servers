import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../../db/queries/users.js";
import { NewUser, User} from "../../db/schema.js";
import { BadRequestError, UserNotAuthenticatedError } from "../middlewares/errorsClasses.js";
import { respondWithJSON } from "../json.js";
import { checkPasswordHash, hashPassword, makeJWT } from "../auth.js";
import { config } from "../../config.js";

type UserResponse = Omit<User, "hashedPassword">

export async function handlerRegister(req:Request, res: Response){
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if(!params.email || !params.password){
        throw new BadRequestError("Missing required fields");
    }

    const hash = await hashPassword(params.password)

    const newUser: NewUser = {
        email: params.email,
        hashedPassword: hash
    }

    const userResponse: UserResponse = await createUser(newUser)

    if (!userResponse) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, userResponse)

}

export async function handlerLogin(req:Request, res: Response){
    type parameters = {
        email: string;
        password: string;
        expiresInSeconds?: number;
    };
    const params: parameters = req.body;

    if(!params.email || !params.password){
        throw new BadRequestError("Missing required fields");
    }
    
    const user : User = await getUserByEmail(params.email )
    if (!user){
        throw new UserNotAuthenticatedError(`incorrect email or password`)
    }

    const correctPassword = await checkPasswordHash(params.password, user.hashedPassword)

    if (!correctPassword) {
        throw new UserNotAuthenticatedError(`incorrect email or password`);
    }
    const exp = params.expiresInSeconds || 1 * 60 * 60
    const token = makeJWT(user.id, exp, config.api.secret )

    const userResponse: UserResponse & { token: string } = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token,
    }

    respondWithJSON(res, 200, userResponse)

}