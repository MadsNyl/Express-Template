import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import asyncErrorHandler from '../../middleware/errors/errorHandler';
import { db } from '../../util/db';
import APIError from '../../middleware/errors/error';
import { HTTPStatusCode } from '../../enums/http';
import { accessTokenDuration, accessTokenSecret, refreshTokenCookieName, refreshTokenDuration, refreshTokenSecret } from '../../config/constants';
import { DecodedUser, UserRequest } from '../../types/request';


export const loginUserWithCookie = asyncErrorHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await db.user.findUnique({
        where: {
            username
        }
    });

    if (!user) {
        throw new APIError(
            'Brukeren eksisterer ikke',
            HTTPStatusCode.UNAUTHORIZED_401
        );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new APIError(
            'Feil passord',
            HTTPStatusCode.UNAUTHORIZED_401
        );
    }

    const userInfo: DecodedUser = {
        userInfo: {
            username: user.username,
            email: user.email,
            role: user.role
        }
    };

    const accessToken = jwt.sign(
        userInfo,
        accessTokenSecret ?? '',
        { expiresIn: accessTokenDuration }
    );

    const refreshToken = jwt.sign(
        { 'username': user.username },
        refreshTokenSecret ?? '',
        { expiresIn: refreshTokenDuration }
    );

    await db.user.update({
        where: { username },
        data: { token: refreshToken }
    });

    res.cookie(
        refreshTokenCookieName,
        refreshToken,
        {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'none'
        }
    );

    return res.status(200).json({accessToken});
});

export const logoutUserWithCookie = asyncErrorHandler(async (req: UserRequest, res: Response) => {
    const username = req.username;

    const user = await db.user.findUnique({
        where: { username }
    })

    if (!user) {
        res.clearCookie(refreshTokenCookieName, { httpOnly: true });
        throw new APIError('Brukeren er logget ut', HTTPStatusCode.OK_200);
    };

    await db.user.update({
        where: { username },
        data: { token: null }
    });

    res.clearCookie(refreshTokenCookieName, { httpOnly: true });
    return res.status(HTTPStatusCode.OK_200).json({ message: 'Brukeren er logget ut' });
});

export const refreshToken = asyncErrorHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies[refreshTokenCookieName];

    if (!refreshToken) throw new APIError('Uautorisert', HTTPStatusCode.UNAUTHORIZED_401);
    
    const user = await db.user.findFirst({
        where: { token: refreshToken as string },
        select: { username: true, email: true, role: true }
    });

    if (!user) throw new APIError('Uautorisert', HTTPStatusCode.UNAUTHORIZED_401);

    jwt.verify(
        refreshToken as string,
        refreshTokenSecret || '',
        (error: VerifyErrors | null, decoded: DecodedUser | any) => {
            if (error || user.username !== decoded.username) throw new APIError('Uautorisert', HTTPStatusCode.UNAUTHORIZED_401);

            const userInfo: DecodedUser = {
                userInfo: {
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            };

            const accessToken = jwt.sign(
                userInfo,
                accessTokenSecret || '',
                { expiresIn: accessTokenDuration }
            );

            return res.status(HTTPStatusCode.OK_200).json({accessToken});
        }
    );
});