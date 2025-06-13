import axios, { AxiosResponse } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.1.35:8080/api",
});

export default class Auth {
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
  static logIn({ data }: { data: { email: string; password: string } }) {
    return this.handleRequest(
      axiosInstance.post("/auth/sign-in", { data: data })
    );
  }
  static signUn({
    data,
  }: {
    data: { email: string; password: string; name: string };
  }) {
    return this.handleRequest(
      axiosInstance.post("/auth/sign-up", { data: data })
    );
  }
}
