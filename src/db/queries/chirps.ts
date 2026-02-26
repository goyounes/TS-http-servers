import { asc, desc ,eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getChirps(authorId?: string, sort?: "asc" | "desc") {
    const orderFunction = sort === "desc" ? desc : asc;
    if (authorId) {
        const rows = await db.select().from(chirps).where(eq(chirps.userId, authorId)).orderBy(orderFunction(chirps.createdAt));
        return rows
    } else {
        const rows = await db.select().from(chirps).orderBy(orderFunction(chirps.createdAt));
        return rows
    }

}

export async function getChirp(chirpId: string) {
    const [chirp] = await db.select().from(chirps).where(eq(chirps.id,chirpId)).limit(1);
    return chirp
}

export async function deleteChirp(chirpId: string) {
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}

export async function deleteAllChirps() {
    await db.delete(chirps);
}