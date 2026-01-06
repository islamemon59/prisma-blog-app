import { Request, Response } from "express";
import { commentServices } from "./comment.service";
import { success } from "better-auth/*";

const createComment = async (req: Request, res: Response) => {
  try {
    req.body.authorId = req.user?.id;
    const result = await commentServices.createComment(req.body);
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.getCommentById(commentId as string);
    res.status(200).json({
      success: true,
      message: "Comment retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentServices.getCommentByAuthorId(
      authorId as string
    );
    res.status(200).json({
      success: true,
      message: "Comment retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    const { commentId } = req.params;
    const result = await commentServices.deleteComment(
      commentId as string,
      authorId as string
    );
    res
      .status(200)
      .json({ success: true, message: "Comment Deleted", data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const authorId = req.user?.id;
    const result = await commentServices.updateComment(
      commentId as string,
      req.body,
      authorId as string
    );
    res
      .status(200)
      .json({ success: true, message: "Updated Successfully", data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.moderateComment(
      commentId as string,
      req.body
    );
    res
      .status(200)
      .json({ success: true, message: "Updated Successfully", data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};
