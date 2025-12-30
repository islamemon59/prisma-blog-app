import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const user = req.user;
    if(!user?.id){
      return res.status(401).json({success: false, message: "Unauthorized access"})
    }
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).json({ success: true, result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const postController = {
  createPost,
};
