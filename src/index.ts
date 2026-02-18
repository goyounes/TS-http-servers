// ------ init automatic migration ------
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import {config } from "./config.js"
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// ------ init express app ------
import express from "express"
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareMetricsInc } from "./middlewares/metricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerResetMetrics } from "./handlers/handlerResetMetrics.js";
import { handlerValidateChirp } from "./handlers/handlerValidateChirp.js";
import { handlerRegister } from "./handlers/users.js";
import { errorMiddleware } from "./middlewares/errors.js";

const app = express()
const PORT = 8080


app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app",middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerResetMetrics(req, res)).catch(next);
});

app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

app.post("/api/users", handlerRegister )



app.use(errorMiddleware);

app.listen(PORT,() => {
    console.log(`Server listening on PORT: ${PORT}`)
})