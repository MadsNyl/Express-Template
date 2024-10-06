import { NextFunction, Request, Response } from 'express';
import APIError from '../middleware/errors/error';
import { HTTPStatusCode } from '../enums/http';


const notFound = (req: Request, _res: Response, next: NextFunction) => {
    const error = new APIError(
        `Can't find ${req.originalUrl} on this server!`,
        HTTPStatusCode.NOT_FOUND_404
    );
    next(error);
};


export default notFound;