import express from "express"
import { handlerReadiness } from "./handlers/handlerReadiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";

const app = express()
const PORT = 8080



app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness)

app.listen(PORT,() => {
    console.log(`Server listening on PORT: ${PORT}`)
})