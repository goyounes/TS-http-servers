import { db } from "../index.js";
import { NewUser, UserResponse, users } from "../schema.js";

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning({
            id: users.id,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            email: users.email
        });

    return result as UserResponse;
}

export async function deleteAllUsers() {
    await db.delete(users);
}