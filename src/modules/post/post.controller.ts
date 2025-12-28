import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(req.body);
    res.status(201).json({ success: true, result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const postController = {
  createPost,
};
