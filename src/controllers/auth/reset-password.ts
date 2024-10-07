import { Request, Response } from 'express';
import asyncErrorHandler from '../../middleware/errors/errorHandler';
import { db } from '../../util/db';
import { HTTPStatusCode } from '../../enums/http';
import crypto from 'crypto';
import { PORT } from '../../config/constants';
import { sendMail } from '../../util/email';
import APIError from '../../middleware/errors/error';


export const forgotPassword = asyncErrorHandler(async (
    req: Request,
    res: Response
) => {
    const { email } = req.body;

    const user = await db.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res
            .status(HTTPStatusCode.NOT_FOUND_404)
            .json({
                message: 'There is no user with that email'
            });
    }

    const token = crypto.randomBytes(20).toString('hex');

    await db.forgotPassword.create({
        data: {
            token,
            user: {
                connect: {
                    email
                }
            }
        }
    })

    const resetUrl = `http://localhost:${PORT}/reset-password/${token}`;

    sendMail(
        email,
        'Password Reset',
        `Click this link to reset your password: ${resetUrl}`
    );

    return res
        .status(HTTPStatusCode.OK_200)
        .json({
            message: 'Email sent'
        });
});

export const getResetPasswordForm = asyncErrorHandler(async (
    req: Request,
    res: Response
) => {
    const { token } = req.params;

    const resetPassword = await db.forgotPassword.findUnique({
        where: {
            token
        }
    });

    if (!resetPassword || resetPassword.expiresAt < new Date()) {
        throw new APIError(
            'Invalid or expired token',
            HTTPStatusCode.BAD_REQUEST_400
        );
    };

    return res
        .status(HTTPStatusCode.OK_200)
        .send(
            '<form method="post" action="/auth/reset-password"><input type="password" name="password" required><input type="submit" value="Reset Password"></form>'
        );
});

export const resetPassword = asyncErrorHandler(async () => {});