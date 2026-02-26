import argon2 from "argon2"
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserNotAuthenticatedError } from "./middlewares/errorsClasses.js";
import { Request } from "express";

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
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  if (decoded.iss !== "chirpy") {
    throw new UserNotAuthenticatedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("No user ID in token");
  }

  return decoded.sub
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
        throw new UserNotAuthenticatedError("Malformed authorization header")
    }

    const [_, token] =  authHeader.split(" ")
    if (!token){
        throw new UserNotAuthenticatedError("Malformed authorization header")
    }
    return token
}