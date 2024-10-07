import jwt from 'jsonwebtoken';

import { User } from '@prisma/client';
import { DecodedUser } from '../types/request';
import { accessTokenDuration, accessTokenSecret, refreshTokenDuration, refreshTokenSecret } from '../config/constants';


export const getAccessToken = (user: User): string => {
    const userInfo: DecodedUser = {
        userInfo: {
            username: user.username,
            email: user.email,
            role: user.role
        }
    };

    return jwt.sign(
        userInfo,
        accessTokenSecret ?? '',
        { expiresIn: accessTokenDuration }
    );
};

export const getRefreshToken = (user: User): string => {
    return jwt.sign(
        { 'username': user.username },
        refreshTokenSecret ?? '',
        { expiresIn: refreshTokenDuration }
    );
};