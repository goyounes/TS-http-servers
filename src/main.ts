// ------ init automatic migration ------
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import {config } from "./config.js"
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// ------ init express app ------
import express from "express"
import { handlerReadiness } from "./api/handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./api/middlewares/logResponses.js";
import { middlewareMetricsInc } from "./api/middlewares/metricsInc.js";
import { handlerMetrics } from "./api/handlers/handlerMetrics.js";
import { handlerResetMetrics } from "./api/handlers/handlerResetMetrics.js";
import { handlerValidateChirp } from "./api/handlers/handlerValidateChirp.js";
import { handlerRegister } from "./api/handlers/users.js";
import { errorMiddleware } from "./api/middlewares/errors.js";
import { asyncHandler } from "./api/handlers/asyncHandler.js";
import { handlerCreateChrip } from "./api/handlers/handlerCreateChrip.js";

export const app = express()
const PORT = 8080


app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app",middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", asyncHandler(handlerReadiness));
app.get("/admin/metrics", asyncHandler(handlerMetrics));
app.post("/admin/reset", asyncHandler(handlerResetMetrics));
app.post("/api/validate_chirp", asyncHandler(handlerValidateChirp));

app.post("/api/users", asyncHandler(handlerRegister) )

app.post("/api/chirps", asyncHandler(handlerCreateChrip) )

app.use(errorMiddleware);

app.listen(PORT,() => {
    console.log(`Server listening on PORT: ${PORT}`)
})