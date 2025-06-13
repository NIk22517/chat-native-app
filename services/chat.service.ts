import { AxiosResponse } from "axios";
import { axiosInstance } from "./auth.service";
import { useAuthStore } from "../store/useAuthStore";

export default class Chat {
  private static async handleRequest<T>(request: Promise<AxiosResponse<T>>) {
    try {
      const response = await request;
      return response;
    } catch (error: any) {
      console.error(
        `API Error: ${error?.response?.data?.message || error.message}`
      );
      console.error(error);
      return null;
    }
  }

  private static getToken() {
    return useAuthStore.getState().auth?.token;
  }

  static getChatList({ query }: { query: string }) {
    const token = this.getToken();

    return this.handleRequest(
      axiosInstance.get("/conversation" + query, {
        headers: {
          Authorization: token,
        },
      })
    );
  }

  static sendMessage({ data }: { data: FormData }) {
    const token = this.getToken();
    return this.handleRequest(
      axiosInstance.post("/message/send", data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  static getMessage({
    conversationId,
    query,
  }: {
    conversationId: string;
    query: string;
  }) {
    const token = this.getToken();
    return this.handleRequest(
      axiosInstance.get(`/message/${conversationId}` + query, {
        headers: {
          Authorization: token,
        },
      })
    );
  }

  static getSingleList({ conversationId }: { conversationId: string }) {
    const token = this.getToken();
    return this.handleRequest(
      axiosInstance.get(`/conversation/${conversationId}`, {
        headers: {
          Authorization: token,
        },
      })
    );
  }

  static getAllFiles({
    conversationId,
    query,
  }: {
    conversationId: string;
    query: string;
  }) {
    const token = this.getToken();
    return this.handleRequest(
      axiosInstance.get(`/message/files/${conversationId}` + query, {
        headers: {
          Authorization: token,
        },
      })
    );
  }
}
