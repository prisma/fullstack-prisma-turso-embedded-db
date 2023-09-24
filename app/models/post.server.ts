import type { User, Post } from "@prisma/client";

import prisma from "~/lib/prisma.server";

export function getPost({
  id,
}: Pick<Post, "id"> & {

}) {
  return prisma.post.findFirst({
    select: {
      id: true,
      title: true,
      published: true,
      content: true,
      author: true,
    },
    where: { id, },
  });
}

export function getFeed() {
  return prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      author: true,
    }
  });
}

export function createPost({
  content,
  title,
  authorId,
}: Pick<Post, "content" | "title"> & {
  authorId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          id: authorId,
        },
      },
    },
  });
}

export function deletePost({
  id,
  authorId,
}: Pick<Post, "id"> & { authorId: User["id"] }) {
  return prisma.post.deleteMany({
    where: { id, authorId },
  });
}

export function updatePost({
  id,
  authorId,
  title,
  content
}: Pick<Post, "id" | "title" | "content"> & { authorId: User["id"] }) {
  return prisma.post.update({
    where: {
      id,
      authorId
    },
    data: {
      title,
      content,
    }
  })
}

export function publishPost({
  id,
  authorId
}: Pick<Post, "id"> & { authorId: User["id"] }) {
  return prisma.post.update({
    where: { id, authorId },
    data: { published: true, }
  })
}

export function getDraftPosts({ authorId }: { authorId: User["id"] }) {
  return prisma.post.findMany({
    where: {
      authorId,
      published: false
    },
    select: {
      id: true,
      title: true,
      author: true
    },
    orderBy: { updatedAt: "desc" },
  })
}