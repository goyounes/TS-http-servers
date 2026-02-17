import { Request, Response } from "express";
import { config } from "../config.js"

export async function handlerValidateChirp(req: Request, res: Response) {
  let body = ""; // 1. Initialize

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 3. Listen for end events
  req.on("end", () => {
    try {
        const parsedBody = JSON.parse(body);
        // now you can use `parsedBody` as a JavaScript object
        if (!parsedBody.body){
            res.status(400).send(JSON.stringify({"error": "Something went wrong"}))
            return
        }

        if (parsedBody.body.length > 140){
            res.status(400).send(JSON.stringify({"error": "Chirp is too long"}))
            return
        }

        res.status(200).send(JSON.stringify({"valid": true}))

    }   catch (error) {
      res.status(400).send("Invalid JSON");
    }
  });

}