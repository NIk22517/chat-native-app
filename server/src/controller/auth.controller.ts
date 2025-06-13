import type { User } from "@prisma/client";
import { readUserByKey, createUser } from "../helper/auth.helper";
import type { AuthSignUp, ApiResponse, AuthSignIn } from "../types/auth.types";
import { eventEmitter } from "../events/createConversation";

export const signUp = async ({
  data,
}: {
  data: AuthSignUp["data"];
}): Promise<ApiResponse<Omit<User, "password">>> => {
  try {
    const alreadyUser = await readUserByKey({
      key: "email",
      value: data.email,
    });

    if (alreadyUser) {
      return {
        error: {
          message: "User already exists",
          status: 409,
        },
      };
    }

    const hashPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: 8,
    });

    const user = await createUser({
      data: { ...data, password: hashPassword },
    });

    const { password, ...restUser } = user;
    eventEmitter.emit("user:signup", user.id);
    return { data: restUser };
  } catch (error) {
    console.error("Sign-up error:", error);
    return {
      error: {
        message: "An unexpected error occurred",
        status: 500,
      },
    };
  }
};

export const signIn = async ({
  data,
}: {
  data: AuthSignIn["data"];
}): Promise<ApiResponse<Omit<User, "password">>> => {
  try {
    const foundUser = await readUserByKey({
      key: "email",
      value: data.email,
    });

    if (!foundUser) {
      return {
        error: {
          status: 400,
          message: "User not found",
        },
      };
    }

    if (!foundUser.active) {
      return {
        error: {
          message: "User no longer active",
          status: 400,
        },
      };
    }

    console.log(foundUser, "foundUser");

    const verifyPassword = await Bun.password.verify(
      data.password,
      foundUser.password,
      "bcrypt"
    );
    if (!verifyPassword) {
      return {
        error: {
          status: 404,
          message: "Invalid Cred",
        },
      };
    }

    const { password, ...rest } = foundUser;

    return { data: rest };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      error: {
        message: "An unexpected error occurred",
        status: 500,
      },
    };
  }
};
