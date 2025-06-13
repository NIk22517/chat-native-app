import { useEffect } from "react";
import Routes from "./router";
import * as Notification from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldShowAlert: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    const subscribe = Notification.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    return () => subscribe.remove();
  }, []);

  return (
    <GestureHandlerRootView>
      <Routes />
    </GestureHandlerRootView>
  );
}
