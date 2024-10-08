import { Router } from 'express';
import { validateData } from '../util/validate';
import { registerUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/user';
import { loginUserWithCookie, logoutUserWithCookie, refreshToken } from '../controllers/auth/cookie';
import { registerUser } from '../controllers/auth/register';
import verifyJWT from '../middleware/auth/verifyJWT';
import { forgotPassword, getResetPasswordForm, resetPassword } from '../controllers/auth/reset-password';


const router = Router();

router
    .get('/cookie/refresh', refreshToken)
    .get('/cookie/logout', verifyJWT, logoutUserWithCookie)
    .post('/reset-password', validateData(resetPasswordSchema), resetPassword)
    .get('/reset-password/:token', getResetPasswordForm)
    .post('/register', validateData(registerUserSchema), registerUser)
    .post('/forgot-password', validateData(forgotPasswordSchema), forgotPassword)
    .post('/cookie/login', validateData(loginUserSchema), loginUserWithCookie);


export default router;