import { EventEmitter } from "events";
import db from "../db";

export const eventEmitter = new EventEmitter();

eventEmitter.on("user:signup", async (newUserId: string) => {
  console.log(`Creating conversations for new user ${newUserId}...`);

  try {
    // Fetch all existing users except the new one
    const existingUsers = await db.user.findMany({
      where: { id: { not: newUserId } },
      select: { id: true },
    });

    // Prepare conversation data for the new user with all existing users
    const conversationData = existingUsers.map((user) => ({
      user1Id: newUserId < user.id ? newUserId : user.id,
      user2Id: newUserId < user.id ? user.id : newUserId,
    }));

    // Create conversations
    if (conversationData.length > 0) {
      await db.conversation.createMany({
        data: conversationData,
        skipDuplicates: true, // Ensure no duplicate conversations are created
      });

      console.log(
        `Conversations created for user ${newUserId} with ${conversationData.length} users.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to create conversations for user ${newUserId}:`,
      error
    );
  }
});
