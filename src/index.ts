// ------ init automatic migration ------
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import {config } from "./config.js"
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
// ------ init express app ------

import express, { NextFunction, Response, Request } from "express"
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareMetricsInc } from "./middlewares/metricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerResetMetrics } from "./handlers/handlerResetMetrics.js";
import { handlerValidateChirp } from "./handlers/handlerValidateChirp.js";
import { BadRequestError, NotFoundError, UserForbiddenError, UserNotAuthenticatedError } from "./errors.js";

const app = express()
const PORT = 8080


app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app",middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness)

app.get("/admin/metrics", handlerMetrics)
app.post("/admin/reset", handlerResetMetrics)
app.post("/api/validate_chirp", handlerValidateChirp )

function errorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
        console.log(err.message);
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }

    if (statusCode >= 500) {
        console.log(err.message);
    }
    res.status(statusCode).send(JSON.stringify({error: message}));
}

app.use(errorHandler);

app.listen(PORT,() => {
    console.log(`Server listening on PORT: ${PORT}`)
})