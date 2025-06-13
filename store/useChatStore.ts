import { create } from "zustand";
import { MessageType } from "../screen/home/chat/Messages";

type ChatState = {
  replyData: MessageType | null;
  setReplyData: (data: MessageType) => void;
  removeReplyData: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  replyData: null,
  setReplyData: (state) => set({ replyData: state }),
  removeReplyData: () => set({ replyData: null }),
}));
