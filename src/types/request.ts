import { Request } from 'express';


export type DecodedUser = {
    userInfo: {
        username: string;
        email: string;
        role: string;
    }
};

export interface UserRequest extends Request {
    username?: string;
    email?: string;
    role?: string;
};