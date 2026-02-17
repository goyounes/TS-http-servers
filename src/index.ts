import express from "express"
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareMetricsInc } from "./middlewares/metricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerResetMetrics } from "./handlers/handlerResetMetrics.js";
import { handlerValidateChirp } from "./handlers/handlerValidateChirp.js";

const app = express()
const PORT = 8080



app.use(middlewareLogResponses);
app.use("/app",middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness)

app.get("/admin/metrics", handlerMetrics)
app.post("/admin/reset", handlerResetMetrics)
app.post("/api/validate_chirp", handlerValidateChirp )

app.listen(PORT,() => {
    console.log(`Server listening on PORT: ${PORT}`)
})