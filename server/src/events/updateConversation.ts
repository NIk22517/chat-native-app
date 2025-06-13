import { EventEmitter } from "events";
import type { Message } from "@prisma/client";
import db from "../db";

export const msgEvent = new EventEmitter();

msgEvent.on("user:conversation", async (data: Message) => {
  console.log("start updating conversation");

  try {
    await db.conversation.update({
      where: { id: data.conversationId },
      data: { lastMessage: data.content },
    });
    console.log(`Conversations updated for ${data.conversationId}`);
  } catch (error) {
    console.error("Error while updating conversation:", error);
  }
});
