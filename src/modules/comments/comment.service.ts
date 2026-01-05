import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findFirstOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentByAuthorId = async (id: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const commentServices = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
};
