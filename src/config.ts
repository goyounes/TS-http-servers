process.loadEnvFile()
function envOrThrow (key: string): string {
    if (!process.env[key]) throw new Error("database url is not set") 
    return process.env[key]
}

export type APIConfig = {
  fileserverHits: number;
};
const apiConfig = {
    fileserverHits: 0,
}

export type DBConfig = {
  url: string,
  migrationConfig: MigrationConfig
};
import type { MigrationConfig } from "drizzle-orm/migrator";
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};
const dbConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig
};

export type Config = {
    api: APIConfig;
    db: DBConfig;
}
export const config: Config = {
    api: apiConfig,
    db: dbConfig
}

