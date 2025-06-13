import { AxiosResponse } from "axios";
import { axiosInstance } from "./auth.service";
import { useAuthStore } from "../store/useAuthStore";

export default class ProfileApi {
  private static async handleRequest<T>(request: Promise<AxiosResponse<T>>) {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      console.error(
        `API Error: ${error?.response?.data?.message || error.message}`
      );
      return null;
    }
  }
  private static getToken() {
    return useAuthStore.getState().auth?.token;
  }

  static avatarChange(data: FormData) {
    const token = this.getToken();

    return axiosInstance.post("/avatar", data, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
