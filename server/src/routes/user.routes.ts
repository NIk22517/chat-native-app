import { t } from "elysia";
import authMiddleWare from "../middleware/auth.middleware";
import { createRouteHandler, UTApi } from "uploadthing/server";
import { uploadRouter } from "../helper/uploadFiles";
import db from "../db";

const userRouter = authMiddleWare;

const handlers = createRouteHandler({
  router: uploadRouter,
  config: {
    token: Bun.env.UPLOADTHING_TOKEN!,
  },
});

userRouter.get("/user", async ({ user }) => {
  return user;
});

userRouter.post(
  "/avatar",
  async ({ body, set, user }) => {
    try {
      if (!body.file) {
        set.status = 400;
        return { error: { message: "No file uploaded." } };
      }

      const file = body.file;

      // Ensure it's an image
      if (!file.type || !file.type.includes("image")) {
        set.status = 400;
        return { error: { message: "Only image uploads are allowed." } };
      }

      // Initialize UploadThing API
      const utApi = new UTApi({
        token: Bun.env.UPLOADTHING_TOKEN!,
        defaultKeyType: "customId",
      });

      // Upload file
      const uploadedFiles = await utApi.uploadFiles([file]);

      if (uploadedFiles.length === 0 || !uploadedFiles[0]?.data?.ufsUrl) {
        set.status = 500;
        return { error: { message: "File upload failed." } };
      }

      const previosAvatart = await db.user.findFirst({
        where: {
          id: user.id,
        },
        select: {
          avatar: true,
        },
      });

      if (previosAvatart?.avatar) {
        const newUrl = previosAvatart.avatar.substring(
          previosAvatart.avatar.lastIndexOf("/") + 1
        );
        const utapi = new UTApi();
        const deleteData = await utapi.deleteFiles(newUrl);

        console.log(deleteData, "deleteData");
      }

      // Update user avatar in DB
      await db.user.update({
        where: { id: user.id },
        data: {
          avatar: uploadedFiles[0].data.ufsUrl,
          lastSeen: new Date(),
        },
      });

      return { url: uploadedFiles[0].data.ufsUrl };
    } catch (error) {
      console.error("Error uploading file:", error);
      set.status = 500;
      return { error: { message: "Internal server error." } };
    }
  },
  {
    body: t.Object({
      file: t.File(),
    }),
  }
);

export default userRouter;
