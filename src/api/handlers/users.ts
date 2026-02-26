import { Request, Response } from "express";
import { createUser, getUserByEmail, updateUser } from "../../db/queries/users.js";
import { NewUser, User } from "../../db/schema.js";
import { BadRequestError, UserNotAuthenticatedError } from "../middlewares/errorsClasses.js";
import { respondWithJSON } from "../json.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "../auth.js";
import { config } from "../../config.js";
import { createRefreshToken, getRefreshToken, revokeRefreshToken } from "../../db/queries/refreshTokens.js";

type UserResponse = Omit<User, "hashedPassword">
export type LoginResponse = UserResponse & { token: string, refreshToken: string }

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

export async function handlerUpdateInfo(req:Request, res: Response){
    // Define the expected parameters in the request body
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if(!params.email || !params.password){
        throw new BadRequestError("Missing required fields");
    }
    const hash = await hashPassword(params.password)
    const updatedUser: NewUser = {
        email: params.email,
        hashedPassword: hash
    }
    // Validate token and get user ID
    const token = getBearerToken(req)
    const userId = validateJWT(token, config.api.secret)


    // Update user information
    const userResponse : UserResponse = await updateUser(userId, updatedUser)
    if (!userResponse){
        throw new UserNotAuthenticatedError("Could not update user")
    }

    respondWithJSON(res, 200, userResponse)

}

export async function handlerLogin(req:Request, res: Response){
    type parameters = {
        email: string;
        password: string;
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
    const expiresInSeconds  = 1 * 60 * 60
    const token = makeJWT(user.id, expiresInSeconds , config.api.secret )

    const refreshToken = makeRefreshToken()
    const result = await createRefreshToken({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000)
    })
    if (!result) {
        throw new Error("Could not create refresh token");
    }

    const userResponse: LoginResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
        token,
        refreshToken,
    }

    respondWithJSON(res, 200, userResponse)

}

export async function handlerRefresh(req:Request, res: Response){
    const token = getBearerToken(req)

    const refreshToken = await getRefreshToken(token)
    if (!refreshToken) {
        throw new UserNotAuthenticatedError("Invalid refresh token");
    }

    if (refreshToken.expiresAt < new Date() || refreshToken.revokedAt) {
        throw new UserNotAuthenticatedError("Refresh token expired or revoked");
    }

    const accessToken = makeJWT(refreshToken.userId, 1 * 60 * 60, config.api.secret)
    respondWithJSON(res, 200, {token: accessToken});

}

export async function handlerRevoke(req:Request, res: Response){
    const token = getBearerToken(req)

    const refreshToken = await getRefreshToken(token)
    if (!refreshToken) {
        throw new UserNotAuthenticatedError("Invalid refresh token");
    }
    const result = revokeRefreshToken(token)
    if (!result) {
        throw new Error("Could not revoke refresh token");
    }

    res.sendStatus(204)
}