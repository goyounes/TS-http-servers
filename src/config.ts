process.loadEnvFile()
function envOrThrow (key: string): string {
    if (!process.env.dbURL) throw new Error("database url is not set") 

    return process.env.dbURL
}

export type APIConfig = {
  fileserverHits: number;
  dbURL: string
};

export const config: APIConfig = {
    fileserverHits: 0,
    dbURL:  envOrThrow("dbURL")
}


