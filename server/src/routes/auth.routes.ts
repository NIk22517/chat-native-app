import { Elysia, t } from "elysia";
import { signIn, signUp } from "../controller/auth.controller";
import jwt from "@elysiajs/jwt";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../types/auth.types";
import cors from "@elysiajs/cors";

const authRouter = new Elysia({
  prefix: "/auth",
});

authRouter
  .use(cors())
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "1d",
    })
  )
  .post(
    "/sign-up",
    async ({ body, set, jwt }) => {
      const response = await signUp({ data: body.data });

      if (response.error) {
        set.status = 400;
        return {
          status: response.error.status ?? 400,
          body: response.error,
        };
      }

      if (response.data) {
        set.status = 201;
        const token = await jwt.sign({
          id: response.data.id,
        });
        return { data: { ...response.data, token } };
      }
    },
    {
      body: t.Object({
        data: t.Object({
          name: validateName,
          password: validatePassword,
          email: validateEmail,
        }),
      }),
      error: (error) => {
        return {
          error: {
            data: error.error,
          },
        };
      },
    }
  )
  .post(
    "/sign-in",
    async ({ body, set, jwt }) => {
      console.log(body, "body");

      const response = await signIn({ data: body.data });
      if (response.error) {
        set.status = response.error.status ?? 400;
        return { data: response };
      }
      set.status = 200;
      const token = await jwt.sign({
        id: response.data?.id!,
      });
      return { data: { ...response.data, token } };
    },
    {
      body: t.Object({
        data: t.Object({
          email: validateEmail,
          password: validatePassword,
        }),
      }),
      error: (error) => {
        return {
          error: {
            data: error.error,
          },
        };
      },
    }
  )
  .get("/check-user", async ({ headers, jwt, set }) => {
    const authHeader = headers["authorization"];
    if (!authHeader) {
      set.status = 401;
      return { message: "Authorization token is required" };
    }
    try {
      const checkToken = await jwt.verify(authHeader);
      if (!checkToken) {
        set.status = 401;
        return { message: "Authorization token is required" };
      }

      set.status = 200;
      return { checkToken };
    } catch (error) {
      set.status = 401;
      return { message: "Invalid or expired token" };
    }
  });

export default authRouter;
