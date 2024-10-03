import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import APIError from "../middleware/errors/error";
import { HTTPStatusCode } from "../enums/http";


export const validateData = (
    schema: z.ZodObject<any, any> | z.ZodEffects<any, any>
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors
                    .map((issue: any) => `${issue.path.join('.')} is ${issue.message}`)
                    .join(', ');
                
                throw new APIError(
                    errorMessages,
                    HTTPStatusCode.BAD_REQUEST
                )
            } else {
                throw new APIError(
                    "Det skjedde en feil på serveren",
                    HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
            }
        } 
    };
};