import { useMemo } from "react";

export const useMsgTime = (msgTime: string | Date | null | undefined) => {
  return useMemo(() => {
    if (!msgTime) return "";
    const currentTime = new Date();
    const messageDate = new Date(msgTime);

    if (
      messageDate.getDate() === currentTime.getDate() &&
      messageDate.getMonth() === currentTime.getMonth() &&
      messageDate.getFullYear() === currentTime.getFullYear()
    ) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const yesterday = new Date();
    yesterday.setDate(currentTime.getDate() - 1);
    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return messageDate.toLocaleDateString("en-US", options);
    }
  }, [msgTime]);
};
