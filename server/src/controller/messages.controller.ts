import db from "../db";
import { msgEvent } from "../events/updateConversation";
import cloudinary from "../helper/cloudinary.config";

export const getMessageById = async ({
  cursor,
  id,
  take,
}: {
  id: string;
  take: number;
  cursor: string | null;
}) => {
  const message = await db.message.findMany({
    where: {
      conversationId: id,
    },
    include: {
      replyTo: true,
    },
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return message;
};

const uploadMsgFiles = async ({
  files,
  conversationId,
}: {
  files?: File[];
  conversationId: string;
}) => {
  let uploadedFiles: any[] = [];
  if (files && files.length > 0) {
    uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const response = await cloudinary.uploader.upload(
          `data:${file.type};base64,${buffer.toString("base64")}`,
          {
            folder: conversationId,
            access_mode: "authenticated",
            filename_override: file.name,
          }
        );

        return response;
      })
    );
  }

  return uploadedFiles;
};

export const sendMessage = async ({
  content,
  conversationId,
  userId,
  files,
  replyMsgId,
}: {
  userId: string;
  conversationId: string;
  content: string;
  files?: File[];
  replyMsgId?: string;
}) => {
  const uploadedFiles = await uploadMsgFiles({
    conversationId,
    files,
  });
  const message = await db.message.create({
    data: {
      content,
      conversationId,
      senderId: userId,
      files: uploadedFiles,
      replyToId: replyMsgId,
    },
    include: {
      replyTo: true,
    },
  });

  console.log("Emitting event: user:conversation", message);

  msgEvent.emit("user:conversation", message);
  return message;
};
