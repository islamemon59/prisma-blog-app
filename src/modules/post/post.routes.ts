import { Router } from "express";
import { postController } from "./post.controller";
import authMiddleware, { UserRole } from "../../auth/middleware";

const router = Router()

router.post("/", authMiddleware(UserRole.ADMIN, UserRole.USER), postController.createPost)

export const postRouter = router;