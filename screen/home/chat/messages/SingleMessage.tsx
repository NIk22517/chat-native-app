import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Attachments, MsgFiles } from "./MsgFiles";
import { Typography } from "../../../../components/Typograhy";
import { MessageType } from "../Messages";
import { useChatStore } from "../../../../store/useChatStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackType } from "../../../../router";

export const SingleMessage = ({
  data,
  isUserMessage,
  replyId,
}: {
  data: MessageType;
  isUserMessage: boolean;
  replyId?: string;
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackType>>();
  const { setReplyData } = useChatStore();
  const highlightOpacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const MAX_SWIPE = 100;

  useEffect(() => {
    highlightOpacity.value = withTiming(replyId === data.id ? 1 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [replyId, data.id]);

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = withSpring(event.translationX, {
        damping: 10,
        stiffness: 100,
      });
    })
    .onEnd(() => {
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 120,
        mass: 0.8,
      });
      runOnJS(setReplyData)(data);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    borderWidth: highlightOpacity.value > 0 ? 2 : 0,
    borderColor: "orange",
  }));

  return (
    <Animated.View
      style={[
        isUserMessage
          ? styles.rightMessageContainer
          : styles.leftMessageContainer,
      ]}
    >
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          style={[
            isUserMessage
              ? styles.rightMessageContent
              : styles.leftMessageContent,
            animatedStyle,
            highlightStyle,
          ]}
        >
          {data?.replyToId && data?.replyTo && (
            <TouchableOpacity
              onPress={() => {
                navigation.setParams({
                  replyId: data.replyToId as string,
                });
              }}
              style={{
                backgroundColor: `rgba(0,0,0,0.1)`,
                padding: 5,
                borderRadius: 5,
                borderLeftWidth: 4,
                borderColor: !isUserMessage ? "#DDEB9D" : "#B2A5FF",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                {data?.replyTo?.files?.slice(0, 6)?.map((file: any) => {
                  return (
                    <Attachments
                      key={file.asset_id}
                      file={file}
                      imageStyle={{
                        width: 30,
                        height: 30,
                      }}
                      onPress={() => {
                        navigation.setParams({
                          replyId: data.replyToId as string,
                        });
                      }}
                    />
                  );
                })}
              </View>
              <Typography
                content={data?.replyTo?.content}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </TouchableOpacity>
          )}
          <MsgFiles files={data?.files} />
          <Typography content={data.content} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
