import { toASCII } from "node:punycode";
import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
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
  limit,
  skip,
  sortBy,
  sortOrder,
  page,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
  page: number;
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
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSinglePost = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const result = await tx.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: {
                createdAt: "asc",
              },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return result;
  });
};

const getMyPost = async (authorId: string) => {
  await prisma.user.findFirstOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.aggregate({
    _count: {
      id: true,
    },
  });

  return { result, total };
};

const updatePost = async (
  id: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("Your are not owner of this post");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  return await prisma.post.update({
    where: {
      id,
    },
    data,
  });
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner/creator fo this post!");
  }

  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPost,
      publishedPosts,
      archivedPosts,
      draftPosts,
      totalComments,
    ] = await Promise.all([
      tx.post.count(),
      tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),

      tx.comment.count(),
    ]);

    return {
      totalPost,
      publishedPosts,
      archivedPosts,
      draftPosts,
      totalComments,
    };
  });
};

export const postServices = {
  createPost,
  getAllPost,
  getSinglePost,
  getMyPost,
  updatePost,
  deletePost,
  getStats,
};
