import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { commentController } from "./comment.controller";

const router = Router();

router.post("/comments", authMiddleware(UserRole.ADMIN, UserRole.USER), commentController.createComment)

export const commentRouter = router;
