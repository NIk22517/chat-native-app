import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Input from "../../../components/Input";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackType } from "../../../router";
import Button from "../../../components/Button";
import { Icon } from "../../../components/Icon";
import { useState } from "react";
import Chat from "../../../services/chat.service";
import * as DocumentPicker from "expo-document-picker";
import { Typography } from "../../../components/Typograhy";
import { useMutation } from "../../../hooks/useMutation";
import { useChatStore } from "../../../store/useChatStore";
import { ReplyMessages } from "./messages/ReplyMessage";

interface MessageFooterProps {
  setMessage: (data: any) => void;
}

const useSendMsg = () => {
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await Chat.sendMessage({ data });
      if (res?.status === 200) {
        return res.data;
      } else {
        throw new Error("Something went wrong");
      }
    },
  });

  return mutation;
};

export const MessageFooter = ({ setMessage }: MessageFooterProps) => {
  const {
    params: { conversationId },
  } = useRoute<RouteProp<RootStackType, "user_conversation">>();
  const [content, setContent] = useState("");
  const [files, setFiles] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const { replyData, removeReplyData } = useChatStore();
  const { mutate, isLoading } = useSendMsg();

  const sendMessage = async () => {
    if (content.trim().length === 0 && !files) return;
    const data = new FormData();
    data.append("conversationId", conversationId);
    data.append("content", content);

    if (files && files.assets && files.assets.length > 0) {
      files.assets?.forEach((file) => {
        if (file.uri) {
          data.append("files", {
            uri: file.uri,
            name: file.name ?? "file",
            type: file.mimeType ?? "application/octet-stream",
          } as any);
        }
      });
    }

    if (replyData) {
      data.append("replyMsgId", replyData.id);
    }

    mutate(data, {
      onSuccess: ({ data }) => {
        setContent("");
        setFiles(null);
        removeReplyData();
        setMessage(data);
      },
    });
  };

  const addDocumnets = async () => {
    try {
      const resultDocumnets = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
        type: "*/*",
      });

      if (resultDocumnets.canceled) {
        console.log("User cancelled document picker");
        return;
      }

      setFiles(resultDocumnets);
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  return (
    <View>
      {files && (
        <ScrollView
          horizontal
          contentContainerStyle={{ flexGrow: 1, gap: 4 }}
          showsHorizontalScrollIndicator={false}
        >
          {files.assets?.map((el) => (
            <View key={el.name}>
              {el.mimeType?.startsWith("image/") ? (
                <Image
                  source={{ uri: el.uri }}
                  style={{ width: 30, height: 30 }}
                />
              ) : (
                <Typography content={el.name} />
              )}
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.footer}>
        {replyData && (
          <ReplyMessages data={replyData} onClose={removeReplyData} />
        )}
        <View style={styles.footerInput}>
          <View style={styles.inputContainer}>
            <Input
              value={content}
              placeholder="Enter Message"
              onChangeText={setContent}
              inputStyle={{
                borderWidth: 0,
                borderColor: "transparent",
              }}
              multiline
              numberOfLines={4}
              boxProps={{
                style: {
                  width: "90%",
                },
              }}
            />
            <Button
              content={<Icon name="attach-file" size={15} />}
              variant="text"
              onPress={addDocumnets}
              disabled={isLoading}
            />
          </View>
          <Button
            content={
              isLoading ? (
                <ActivityIndicator size={15} color={"white"} />
              ) : (
                <Icon name="send" size={15} color={"white"} />
              )
            }
            variant="primary"
            onPress={sendMessage}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: "auto",
    padding: 10,
    borderTopColor: "gery",
    borderWidth: 0.5,
    gap: 2,
  },
  footerInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "grey",
    justifyContent: "space-between",
    borderRadius: 10,
  },
});
