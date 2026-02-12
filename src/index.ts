import express from "express"
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareMetricsInc } from "./middlewares/metricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerResetMetrics } from "./handlers/handlerResetMetrics.js";

const app = express()
const PORT = 8080



app.use(middlewareLogResponses);
app.use("/app",middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness)
app.get("/metrics", handlerMetrics)
app.get("/reset", handlerResetMetrics)

app.listen(PORT,() => {
    console.log(`Server listening on PORT: ${PORT}`)
})