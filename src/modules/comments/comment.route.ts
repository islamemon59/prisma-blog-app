import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { commentController } from "./comment.controller";

const router = Router();

router.get(
  "/comments/author/:authorId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.getCommentByAuthorId
);

router.get(
  "/comments/:commentId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.getCommentById
);

router.post(
  "/comments",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);

export const commentRouter = router;
