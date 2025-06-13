import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { readUserByKey } from "../helper/auth.helper";
import {
  findOrCreateConversation,
  getAllConversations,
  singleConversation,
} from "../controller/conversation.controller";
import cloudinary from "../helper/cloudinary.config";

const conversationsRouter = new Elysia({
  prefix: "conversation",
});

conversationsRouter
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "1d",
    })
  )
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
    "/create",
    async ({ user, body, set }) => {
      if (user.id === body.id) {
        set.status = 400;
        return {
          error: "Can not create convesation with same user",
        };
      }
      const response = await findOrCreateConversation(user.id, body.id);
      return response;
    },
    {
      body: t.Object({
        id: t.String(),
      }),
    }
  )
  .get("/", async ({ user, query }) => {
    const take = parseInt(query.take ?? "10");
    const cursor = query.cursor;

    const response = await getAllConversations({
      userId: user.id,
      take,
      cursor,
    });

    return {
      data: response,
      nextCursor:
        response.length === take ? response[response.length - 1].id : null,
    };
  })
  .get("/:id", async ({ params: { id }, user }) => {
    const response = await singleConversation({
      id,
      userId: user.id,
    });

    return response;
  })
  .get("/files/:id", async ({ params: { id } }) => {
    const url = await cloudinary.api.resources({
      type: "upload",
      prefix: id,
      max_results: 25,
    });

    console.log(url, "url");

    return url;
  });

export default conversationsRouter;
