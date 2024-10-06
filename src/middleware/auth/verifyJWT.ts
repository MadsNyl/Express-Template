import { NextFunction, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import { DecodedUser, UserRequest } from '../../types/request';
import { accessTokenSecret } from '../../config/constants';
import APIError from '../errors/error';


const verifyJWT = (
    req: UserRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(403).json({ message: 'Uautorisert' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        accessTokenSecret || '',
        (err: VerifyErrors | null, decoded: DecodedUser | any) => {
            if (err) throw new APIError('Uautorisert', 403);
            
            if (!decoded) throw new APIError('Uautorisert', 403);
            
            req.username = (decoded as DecodedUser).userInfo.username;
            req.role = (decoded as DecodedUser).userInfo.role;
            req.email = (decoded as DecodedUser).userInfo.email;
        }
    ); 

    next();
}

export default verifyJWT;