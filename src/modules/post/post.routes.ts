import { Router } from "express";
import { postController } from "./post.controller";
import authMiddleware, { UserRole } from "../../middleware/middleware";

const router = Router();

router.get("/posts", postController.getAllPost);

router.get("/posts/:id", postController.getSinglePost);

router.post(
  "/posts",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  postController.createPost
);

export const postRouter = router;
