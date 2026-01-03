import { boolean } from "better-auth/*";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  page,
  limit,
  skip,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  page: number;
  limit: number;
  skip: number;
}) => {
  const andCondition: PostWhereInput[] = [];

  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andCondition.push({
      isFeatured,
    });
  }

  if (status) {
    andCondition.push({
      status,
    });
  }

  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andCondition,
    },
  });

  return result;
};

export const postServices = {
  createPost,
  getAllPost,
};
