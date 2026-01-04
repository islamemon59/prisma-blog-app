import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    req.body.authorId = req.user?.id;
    const result = await commentServices.createComment(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Comment created successfully",
        data: result,
      });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const commentController = {
  createComment,
};
