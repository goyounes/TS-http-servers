import argon2 from "argon2"
import jwt, { JwtPayload } from "jsonwebtoken";
import { NotFoundError, UserNotAuthenticatedError } from "./middlewares/errorsClasses.js";

export async function hashPassword(password: string): Promise<string>{
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean>{
    return argon2.verify(hash, password);
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn
    }
    return jwt.sign(payload, secret)
}

export function validateJWT(tokenString: string, secret: string): string {
    const decoded = jwt.verify(tokenString, secret)

    if (!decoded){
        throw new UserNotAuthenticatedError("Invalid token")
    }
    if (typeof decoded !== "string" && decoded.sub){
        return decoded.sub 
    } else {
        throw new NotFoundError("")
    }

}