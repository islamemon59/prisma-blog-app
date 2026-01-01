import { Request, Response } from "express";
import { postServices } from "./post.service";

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
    const search = req.query.search;
    const searchString = typeof search === "string" ? search : undefined
    const result = await postServices.getAllPost({search: searchString});
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
