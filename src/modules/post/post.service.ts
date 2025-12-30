import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  id: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: id,
    },
  });

  return result;
};

export const postServices = {
  createPost,
};
