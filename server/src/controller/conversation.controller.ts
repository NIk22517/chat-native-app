import type { Conversation } from "@prisma/client";
import db from "../db";

export const getAllConversations = async ({
  userId,
  cursor,
  take = 10,
}: {
  userId: string;
  cursor?: string;
  take: number;
}) => {
  const conversations = await db.conversation.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: {
      user1: {
        select: {
          name: true,
          avatar: true,
        },
      },
      user2: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  return conversations.map((el) => {
    if (el.user1Id === userId) {
      return {
        ...el.user2,
        // lastMessage: { ...el.messages?.[0] },
        id: el.id,
        lastMessage: el.lastMessage,
        updatedAt: el.updatedAt,
      };
    } else {
      return {
        ...el.user1,
        // lastMessage: { ...el.messages?.[0] },
        id: el.id,
        lastMessage: el.lastMessage,
        updatedAt: el.updatedAt,
      };
    }
  });
};

export const findOrCreateConversation = async (
  user1Id: string,
  user2Id: string
): Promise<Conversation> => {
  let conversation = await db.conversation.findFirst({
    where: {
      OR: [
        {
          user1Id: user1Id,
          user2Id: user2Id,
        },
        {
          user1Id: user2Id,
          user2Id: user1Id,
        },
      ],
    },
  });

  if (!conversation) {
    conversation = await db.conversation.create({
      data: {
        user1Id,
        user2Id,
      },
    });
  }

  return conversation;
};

export const singleConversation = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const data = await db.conversation.findFirst({
    where: {
      id: id,
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  if (data?.user1Id === userId) {
    return data.user2;
  }
  return data?.user1;
};
