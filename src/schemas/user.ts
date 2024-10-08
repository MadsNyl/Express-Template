import { UserRole } from '@prisma/client';
import { z } from 'zod';


export const registerUserSchema = z.object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    rePassword: z.string().min(8),
}).refine(data => data.password === data.rePassword, {
    message: 'The passwords are not the same',
    path: ['rePassword'],
});

export const loginUserSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
});

export const updateUserRoleSchema = z.object({
    role: z.nativeEnum(UserRole),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(8),
    rePassword: z.string().min(8),
    token: z.string(),
}).refine(data => data.password === data.rePassword, {
    message: 'The passwords are not the same',
    path: ['rePassword'],
});