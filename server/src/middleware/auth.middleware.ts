import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { readUserByKey } from "../helper/auth.helper";

const authMiddleware = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "1d",
    })
  )
  .derive(async ({ jwt, headers }) => {
    const authHeader = headers["authorization"];

    if (!authHeader) {
      throw new Error("Authorization token is required");
    }

    const token = await jwt.verify(authHeader);
    if (!token || typeof token !== "object" || !("id" in token)) {
      throw new Error("Invalid or expired token");
    }

    const userId = String(token.id);
    const user = await readUserByKey({ key: "id", value: userId });
    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  });

export default authMiddleware;
