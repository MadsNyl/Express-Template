import { Router } from 'express';
import verifyJWT from '../middleware/auth/verifyJWT';
import verifyRole from '../middleware/auth/verifyRole';
import { UserRole } from '@prisma/client';
import { upload } from '../util/file';
import { uploadFile } from '../controllers/upload';


const router = Router();

router.use(verifyJWT, verifyRole(UserRole.USER, UserRole.EDITOR));

router.route('/')
    .post(upload.single('file'), uploadFile);


export default router;