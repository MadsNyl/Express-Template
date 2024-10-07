import { Response } from 'express';
import asyncErrorHandler from '../../middleware/errors/errorHandler';
import { UserRequest } from '../../types/request';
import { HTTPStatusCode } from '../../enums/http';
import { db } from '../../util/db';


export const updateUserRole = asyncErrorHandler(async (req: UserRequest, res: Response) => {
    const { username } = req.params;
    const { role: newRole } = req.body;

    const user = await db.user.update({
        where: {
            username
        },
        data: {
            role: newRole
        }
    });

    return res.status(HTTPStatusCode.OK_200).json(user);
});