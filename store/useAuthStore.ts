import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthDataType = {
  name: string;
  id: string;
  email: string;
  password: string;
  avatar: string | null;
  createdAt: Date;
  active: boolean;
  lastSeen: Date | null;
  token: string | null;
};

interface AuthState {
  auth: AuthDataType | null;
  setAuth: (data: AuthDataType) => void;
  removeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      setAuth: (data) => set({ auth: data }),
      removeAuth: () => set({ auth: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
