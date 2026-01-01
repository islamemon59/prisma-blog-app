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

const getAllPost = async (payload: { search: string | undefined }) => {
  console.log(payload);
  const result = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    },
  });

  return result;
};

export const postServices = {
  createPost,
  getAllPost,
};
