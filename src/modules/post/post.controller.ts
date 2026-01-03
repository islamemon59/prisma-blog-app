import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { number } from "better-auth/*";

const createPost = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const user = req.user;
    if (!user?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).json({ success: true, result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);
    const skip = (page - 1) * limit;
    const result = await postServices.getAllPost({
      search,
      tags,
      isFeatured,
      status,
      page,
      limit,
      skip,
    });
    res
      .status(200)
      .json({ success: true, message: "Data retrieved success", data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
