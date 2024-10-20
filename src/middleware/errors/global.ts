import { NextFunction, Request, Response } from 'express';
import { APIErrorType } from './error';


const productionError = (err: APIErrorType, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

const developmentError = (err: APIErrorType, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

export const globalErrorHandler = (
    err: APIErrorType,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') productionError(err, res);
    else developmentError(err, res);
};


export default globalErrorHandler;