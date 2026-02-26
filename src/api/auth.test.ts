import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";
import { UserNotAuthenticatedError } from "./middlewares/errorsClasses";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const result = await checkPasswordHash(password2, hash1);
    expect(result).toBe(false);
  });
});

describe("JWT", () => {
  const userID = "user-abc-123";
  const secret = "test-secret";

  it("makeJWT should return a valid JWT string", () => {
    const token = makeJWT(userID, 3600, secret);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("validateJWT should return the correct userID for a valid token", () => {
    const token = makeJWT(userID, 3600, secret);
    const result = validateJWT(token, secret);
    expect(result).toBe(userID);
  });

  it("validateJWT should throw for a token signed with the wrong secret", () => {
    const token = makeJWT(userID, 3600, "correct-secret");
    expect(() => validateJWT(token, "wrong-secret")).toThrow(UserNotAuthenticatedError);
  });

  it("validateJWT should throw for an expired token", () => {
    const expiredToken = makeJWT(userID, -1, secret);
    expect(() => validateJWT(expiredToken, secret)).toThrow(UserNotAuthenticatedError);
  });
});