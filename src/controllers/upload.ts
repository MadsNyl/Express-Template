import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { HTTPStatusCode } from '../enums/http';
import APIError from '../middleware/errors/error';


export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const { file } = req;

    if (!file) {
        throw new APIError('No file uploaded', HTTPStatusCode.BAD_REQUEST_400);
    }

    res
        .status(HTTPStatusCode.OK_200)
        .json({ message: 'File uploaded successfully' });
});