

export type APIErrorType = {
    statusCode: number;
    status: string;
    message: string;
    isOperational: boolean;
    stack?: string;
}

const APIError = class extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
};


export default APIError;