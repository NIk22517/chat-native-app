import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import rootRoter from "./routes/routes";

const app = new Elysia({
  prefix: "/api",
});

app
  .use(cors())
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "1d",
    })
  )
  .use(cookie())
  .use(rootRoter);

app.listen(Bun.env.PORT!);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
