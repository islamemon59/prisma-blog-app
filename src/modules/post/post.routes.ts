import { Router } from "express";
import { postController } from "./post.controller";
import authMiddleware, { UserRole } from "../../middleware/middleware";

const router = Router();

router.get("/posts", postController.getAllPost);

router.get("/stats", authMiddleware(UserRole.ADMIN), postController.getStats);

router.get(
  "/posts/my-posts",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  postController.getMyPost
);

router.get("/posts/:id", postController.getSinglePost);

router.post(
  "/posts",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  postController.createPost
);

router.patch(
  "/posts/:postId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  postController.updatePost
);

router.delete(
  "/posts/:postId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  postController.deletePost
);

export const postRouter = router;
