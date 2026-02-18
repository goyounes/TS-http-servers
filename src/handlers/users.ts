import { Request, Response } from "express";

export function handlerRegister(req:Request, res: Response){

    type parameters = {
        body: string;
    };
    const params: parameters = req.body;

    if (!params.body){
        throw new Error()
    }

    
    res.status(200).send("OK")
}