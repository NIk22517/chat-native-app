import { useEffect, useState } from "react";
import Chat from "../../../services/chat.service";
import { FlatList } from "react-native-gesture-handler";
import { List } from "./List";
import { useAuthStore } from "../../../store/useAuthStore";

const ChatList = () => {
  const [list, setList] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>();
  const { auth } = useAuthStore();

  const getList = async () => {
    if (cursor === null) return;
    let query = `?take=10`;
    if (cursor) {
      query += `&cursor=${cursor}`;
    }
    const res = await Chat.getChatList({
      query,
    });
    if (res?.data?.data?.length > 0) {
      setList((prev) => {
        return [...prev, ...res?.data.data];
      });
    }

    if ("nextCursor" in res?.data) {
      setCursor(res?.data.nextCursor);
    }
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <FlatList
      style={{
        backgroundColor: "#A0C878",
      }}
      data={list}
      renderItem={({ item }) => {
        return <List item={item} />;
      }}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (cursor) {
          getList();
        }
      }}
    />
  );
};

export default ChatList;
