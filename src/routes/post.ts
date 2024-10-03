import { Router } from "express";
import { createPost, getAllPosts } from "../controllers/post";
import verifyJWT from "../middleware/auth/verifyJWT";
import verifyRole from "../middleware/auth/verifyRole";
import { UserRole } from "@prisma/client";
import { validateData } from "../util/validate";
import { createPostSchema } from "../schemas/post";


const router = Router();

router.use(verifyJWT, verifyRole(UserRole.USER, UserRole.EDITOR));

router.route("/")
    .get(getAllPosts)
    .post(validateData(createPostSchema), createPost);


export default router;