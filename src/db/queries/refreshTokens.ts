import { NewRefreshToken, refreshTokens } from './../schema.js';
import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function revokeRefreshToken(token: string) {
    const now = new Date()
    const [result] = await db
        .update(refreshTokens)
        .set({ 
            revokedAt: now,
            updatedAt: now,

        })
        .where(eq(refreshTokens.token, token))
        .returning();
    return result;
}

export async function getAllRefreshTokens() {
    const rows = await db.select().from(refreshTokens).orderBy(asc(refreshTokens.createdAt));
    return rows
}

export async function getRefreshToken(token: string) {
    const [rows] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token)).limit(1);
    return rows
}

export async function deleteAllRefreshTokens() {
    await db.delete(refreshTokens);
}