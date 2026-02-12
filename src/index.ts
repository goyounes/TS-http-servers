import express from "express"
import { handlerReadiness } from "./handlers/handlerReadiness.js";

const app = express()
const PORT = 8080


app.use(express.static("./app/"));
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness)

app.listen(PORT,() => {
    console.log(`Server listening on PORT: ${PORT}`)
})