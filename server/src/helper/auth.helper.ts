import type { User } from "@prisma/client";
import db from "../db";

export const createUser = async ({
  data,
}: {
  data: Pick<User, "email" | "password" | "name">;
}): Promise<User> => {
  return db.user.create({ data });
};

export const readUserByKey = async ({
  key,
  value,
}: {
  key: "email" | "id";
  value: string;
}): Promise<User | null> => {
  const whereClause = { [key]: value };
  return db.user.findUnique({
    where: whereClause as { id: string } | { email: string },
  });
};
