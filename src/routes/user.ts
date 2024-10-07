import { Router } from 'express';
import verifyJWT from '../middleware/auth/verifyJWT';
import verifyRole from '../middleware/auth/verifyRole';
import { updateUserRole } from '../controllers/user/role';
import { validateData } from '../util/validate';
import { updateUserRoleSchema } from '../schemas/user';


const router = Router();


router.use(verifyJWT);

router.route('/role/:username')
    .put(
        verifyRole(),
        validateData(updateUserRoleSchema),
        updateUserRole
    );


export default router;