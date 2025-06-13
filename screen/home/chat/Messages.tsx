import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { RootStackType } from "../../../router";
import { Typography } from "../../../components/Typograhy";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "../../../components/Avatar";
import { MessageFooter } from "./MessageFooter";
import Chat from "../../../services/chat.service";
import { FlatList } from "react-native-gesture-handler";
import { useSocket } from "../../../hooks/useSocket";
import { MessageProcess } from "../../../hooks/messageProcess";

import { SingleMessage } from "./messages/SingleMessage";
import { useAuthStore } from "../../../store/useAuthStore";

type MessagesProps = StackScreenProps<RootStackType, "user_conversation">;

export type MessageType = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  files: any[];
  createdAt: string;
  replyToId?: string | null;
  replyTo?: MessageType | null;
};

export type ChatResponseType = {
  data: MessageType[];
  nextCursor?: string | null;
};

const Messages = ({
  route: {
    params: { conversationId, name, replyId },
  },
  navigation,
}: MessagesProps) => {
  const flatListRef =
    useRef<FlatList<{ date: string } | { items: MessageType }>>(null);
  const [cursor, setCursor] = useState<string | null>();
  const [messages, setMessages] = useState<any[]>([]);
  const { socket } = useSocket({});
  const { auth } = useAuthStore();

  useEffect(() => {
    const setHeaderOptions = (name: string) => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("user_files", {
                conversationId: conversationId,
              });
            }}
            style={styles.header}
          >
            <Avatar fallbackText={name} size={40} />
            <Typography
              content={name}
              style={{ fontWeight: "bold", fontSize: 20 }}
            />
          </TouchableOpacity>
        ),
      });
    };

    if (name) {
      setHeaderOptions(name);
    } else {
      const fetchData = async () => {
        try {
          const data = await Chat.getSingleList({ conversationId });
          if (data?.data.name) {
            setHeaderOptions(data.data.name);
          }
        } catch (error) {
          console.error("Error fetching conversation data:", error);
        }
      };

      fetchData();
    }
  }, [navigation, name, conversationId]);

  const getMessages = async () => {
    if (cursor === null) return;
    let query = `?take=10`;
    if (cursor) {
      query += `&cursor=${cursor}`;
    }
    const res = await Chat.getMessage({
      conversationId,
      query,
    });

    const resData: ChatResponseType = res?.data;

    if ("nextCursor" in resData) {
      setCursor(resData?.nextCursor);
    }
    if (resData.data.length > 0) {
      setMessages((prev) => [...prev, ...resData.data]);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "new_message") {
        const msg_data = data.data;
        if (
          "conversationId" in msg_data &&
          msg_data.conversationId === conversationId
        ) {
          setMessages((prev) => [msg_data, ...prev]);
        }
      }
    };
  }, [socket]);

  const messageData = useMemo(() => {
    const process = new MessageProcess({
      data: messages,
      dateKey: "createdAt",
      groupTemplate: {
        items: [],
      },
      getMessageType: () => {
        return "items";
      },
    });

    const msgData = process.flatData();
    return msgData;
  }, [messages]);

  const scrollToMessage = async (id: string) => {
    const index = messages.findIndex((item) => item.id === id);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setTimeout(() => {
        navigation.setParams({
          replyId: undefined,
        });
      }, 3000);
    } else {
      await getMessages();
    }
  };

  useEffect(() => {
    if (!replyId) return;
    scrollToMessage(replyId);
  }, [replyId, messages]);

  return (
    <View style={styles.main}>
      <FlatList
        ref={flatListRef}
        style={styles.flatList}
        data={messageData}
        inverted
        renderItem={({ item }) => {
          if ("date" in item) {
            return (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Typography
                  content={item.date}
                  style={{
                    backgroundColor: "#0D7C66",
                    padding: 4,
                    borderRadius: 5,
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </View>
            );
          } else if ("items" in item) {
            const isUserMessage = auth?.id === item.items.senderId;
            return (
              <SingleMessage
                data={item.items}
                isUserMessage={isUserMessage}
                replyId={replyId}
              />
            );
          }

          return null;
        }}
        keyExtractor={(item, index) =>
          "date" in item ? `date-${index}` : `msg-${item.items.id ?? index}`
        }
        onEndReached={() => {
          if (cursor) {
            getMessages();
          }
        }}
        onEndReachedThreshold={0.5}
      />
      <MessageFooter
        setMessage={(data) => {
          setMessages((prev) => [data, ...prev]);
          flatListRef?.current?.scrollToIndex({ index: 0, animated: true });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginLeft: 25,
  },
  main: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  leftMessageContainer: {
    alignItems: "flex-start",
  },
  rightMessageContainer: {
    alignItems: "flex-end",
  },
  leftMessageContent: {
    backgroundColor: "#B2A5FF",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    maxWidth: "95%",
  },
  rightMessageContent: {
    backgroundColor: "#DDEB9D",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    maxWidth: "95%",
  },
});

export default Messages;
