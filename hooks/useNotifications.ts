import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackType } from "../router";

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackType>>();

  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (!Device.isDevice) {
        console.warn("Push notifications only work on real devices.");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Permission Denied", "Enable notifications in settings.");
        return;
      }

      try {
        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId ?? "chat-app",
          })
        ).data;
        setExpoPushToken(token);
      } catch (error) {
        console.error("Error getting push token:", error);
      }
    };

    registerForPushNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Received:", notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Clicked:", response);
        const data = response.notification.request.content.data;

        // Debugging: Log the data to check if it's correct
        console.log("Notification Response Data:", data);

        if (data?.conversationId) {
          console.log(
            "Navigating to conversation with ID:",
            data.conversationId
          );
          navigation.navigate("user_conversation", {
            conversationId: data.conversationId,
            name: data.name,
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [navigation]);

  const sendNotification = async ({
    title,
    body,
    data,
    identifier,
  }: {
    title: string;
    body: string;
    data?: any;
    identifier: string;
  }) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: null,
      identifier: identifier,
    });
  };

  return { expoPushToken, sendNotification };
};
