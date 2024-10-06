import { Router } from 'express';
import { validateData } from '../util/validate';
import { registerUserSchema, loginUserSchema } from '../schemas/user';
import { loginUserWithCookie, logoutUserWithCookie, refreshToken } from '../controllers/auth/cookie';
import { registerUser } from '../controllers/auth/register';
import verifyJWT from '../middleware/auth/verifyJWT';


const router = Router();

router
    .get('/cookie/refresh', refreshToken)
    .get('/cookie/logout', verifyJWT, logoutUserWithCookie)
    .post('/register', validateData(registerUserSchema), registerUser)
    .post('/cookie/login', validateData(loginUserSchema), loginUserWithCookie);


export default router;