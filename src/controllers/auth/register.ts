import { Request, Response } from "express";
import bcrypt from "bcrypt";

import asyncErrorHandler from "../../middleware/errors/errorHandler";
import { db } from "../../util/db";
import APIError from "../../middleware/errors/error";
import { HTTPStatusCode } from "../../enums/http";


export const registerUser = asyncErrorHandler(async (req: Request, res: Response) => {
    const {
        username,
        email,
        password,
        firstName,
        lastName
    } = req.body;

    const userExists = await db.user.findUnique({
        where: {
            username
        },
        select: {
            username: true
        }
    });


    if (userExists) {
        throw new APIError(
            "Brukernavnet er allerede i bruk",
            HTTPStatusCode.CONFLICT
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName
        }
    });

    return res
        .status(HTTPStatusCode.CREATED)
        .json(user);
});