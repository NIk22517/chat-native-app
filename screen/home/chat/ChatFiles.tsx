import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Chat from "../../../services/chat.service";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackType } from "../../../router";
import { Attachments } from "./messages/MsgFiles";

type MessagesProps = StackScreenProps<RootStackType, "user_files">;
const ChatFiles = ({
  route: {
    params: { conversationId },
  },
}: MessagesProps) => {
  const [data, setData] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);

  const getFiles = async () => {
    const query = cursor ? `?cursor=${cursor}` : "";
    const res = await Chat.getAllFiles({
      conversationId: conversationId,
      query: query,
    });
    if (res?.data.resources?.length > 0) {
      setData((prev) => [...prev, ...res?.data.resources]);
      setCursor(res?.data.next_cursor);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);
  return (
    <FlatList
      data={data}
      numColumns={3}
      renderItem={({ item }) => {
        return (
          <Attachments
            file={item}
            imageStyle={{
              width: 80,
              height: 80,
            }}
            onPress={() => {}}
          />
        );
      }}
      onEndReached={() => {
        if (cursor) {
          getFiles();
        }
      }}
    />
  );
};

export default ChatFiles;
