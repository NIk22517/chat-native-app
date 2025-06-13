import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { readUserByKey } from "../helper/auth.helper";
import { getMessageById, sendMessage } from "../controller/messages.controller";
import type { ElysiaWS } from "elysia/ws";
import { singleConversation } from "../controller/conversation.controller";
import cloudinary from "../helper/cloudinary.config";

const messageRouter = new Elysia({
  prefix: "message",
});
const activeClients = new Set<ElysiaWS>();
messageRouter
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "1d",
    })
  )
  .ws("/live/:id", {
    body: t.String(),
    response: t.String(),
    beforeHandle: ({ params: { id } }) => {
      if (!id) throw new Error("User ID is required for WebSocket connection.");
    },
    open: (ws) => {
      console.log("WebSocket connection opened for user:", ws);

      activeClients.add(ws);
    },
    message: (ws, message) => {
      console.log("Received:", message);
      ws.send(`Echo: ${message}`);
    },
    close: (ws) => {
      console.log("WebSocket connection closed");
      activeClients.delete(ws);
    },
  })

  .derive(async ({ jwt, headers }) => {
    try {
      const authHeader = headers["authorization"];
      if (!authHeader) {
        throw new Error("Authorization token is required");
      }

      const token = await jwt.verify(authHeader);

      if (!token || typeof token !== "object" || !("id" in token)) {
        throw new Error("Provide Authorization Token");
      }
      const userId = String(token.id);
      const user = await readUserByKey({
        key: "id",
        value: userId,
      });
      if (!user) {
        throw new Error("User not found");
      }

      return { user };
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  })

  .post(
    "/send",
    async ({ body, user }) => {
      console.log(body, "body");

      const response = await sendMessage({
        content: body.content,
        conversationId: body.conversationId,
        files: body.files,
        userId: user.id,
        replyMsgId: body.replyMsgId,
      });

      const receiveUser = await singleConversation({
        id: body.conversationId,
        userId: user.id,
      });

      for (const client of activeClients) {
        if (receiveUser?.id === (client.data as any)?.params?.id) {
          client.send(
            JSON.stringify({
              type: "new_message",
              data: response,
            })
          );
        }
      }

      return response;
    },
    {
      body: t.Object({
        conversationId: t.String(),
        content: t.String(),
        files: t.Optional(t.Files()),
        replyMsgId: t.Optional(t.String()),
      }),
    }
  )
  .get("/:conversationId", async ({ params: { conversationId }, query }) => {
    const take = Number(query.take) || 10;
    const cursor = query.cursor ?? null;
    const response = await getMessageById({
      id: conversationId,
      cursor,
      take,
    });
    return {
      data: response,
      nextCursor:
        take === response.length ? response[response.length - 1].id : null,
    };
  })
  .get(
    "/files/:conversationId",
    async ({ params: { conversationId }, query, set }) => {
      console.log("files call");

      const cursor = query.cursor ?? null;
      const cloudFiles = await cloudinary.api.resources({
        type: "upload",
        prefix: conversationId,
        next_cursor: cursor,
      });
      return cloudFiles;
    }
  );

export default messageRouter;
