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

router.patch(
  "/comments/:commentId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.updateComment
);

router.delete(
  "/comments/:commentId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.deleteComment
);

router.patch(
  "/comments/moderate/:commentId",
  authMiddleware(UserRole.ADMIN),
  commentController.moderateComment
);

export const commentRouter = router;
