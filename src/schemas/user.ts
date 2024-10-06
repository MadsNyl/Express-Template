import { z } from 'zod';


export const registerUserSchema = z.object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    rePassword: z.string().min(8),
}).refine(data => data.password === data.rePassword, {
    message: 'Passordene er ikke like',
    path: ['rePassword'],
});

export const loginUserSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
});