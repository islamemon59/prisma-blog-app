import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { number } from "better-auth/*";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
  try {
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

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postServices.getAllPost({
      search,
      tags,
      isFeatured,
      status,
      limit,
      skip,
      sortBy,
      sortOrder,
      page,
    });
    res
      .status(200)
      .json({ success: true, message: "Data retrieved success", data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getSinglePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) {
      throw new Error("Post id is required");
    }
    const result = await postServices.getSinglePost(id);
    res.status(200).json({
      success: true,
      message: "Single post retrieved successful",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Your are unauthorized");
    }
    const result = await postServices.getMyPost(user?.id as string);
    res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Your are unauthorized");
    }
    const { postId } = req.params;
    const result = await postServices.updatePost(
      postId as string,
      req.body,
      user.id
    );
    res.status(200).json({
      success: true,
      message: "Post update successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const postController = {
  createPost,
  getAllPost,
  getSinglePost,
  getMyPost,
  updatePost,
};
