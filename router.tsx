import React, { useEffect } from "react";
import {
  NavigationContainer,
  useNavigationState,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./screen/auth/Login";
import SignUp from "./screen/auth/SignUp";
import { Home } from "./screen/home/Home";
import { Icon } from "./components/Icon";
import ChatList from "./screen/home/chat";
import Messages from "./screen/home/chat/Messages";
import { useNotifications } from "./hooks/useNotifications";
import Profile from "./screen/home/Profile";
import { useSocket } from "./hooks/useSocket";
import ChatFiles from "./screen/home/chat/ChatFiles";
import { useAppState } from "./hooks/useAppState";
import ViewFiles from "./screen/home/chat/ViewFiles";
import { useAuthStore } from "./store/useAuthStore";

export type AuthStackType = {
  log_in: undefined;
  sign_in: undefined;
  main_screen: undefined;
  user_conversation: {
    conversationId: string;
    name: string;
    replyId?: string;
  };
  user_files: {
    conversationId: string;
  };
  view_files: undefined;
};

export type TabStackType = {
  home: undefined;
  chat: undefined;
  profile: undefined;
};

export type RootStackType = AuthStackType & TabStackType;

const RootStack = createStackNavigator<AuthStackType>();
const TabStack = createBottomTabNavigator<TabStackType>();

const MainTabNavigator = () => {
  return (
    <TabStack.Navigator>
      <TabStack.Screen
        name="home"
        component={Home}
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <TabStack.Screen
        name="chat"
        component={ChatList}
        options={{
          title: "Chat",
          tabBarIcon: ({ size, color }) => {
            return <Icon name="chat" size={size} color={color} />;
          },
        }}
      />
      <TabStack.Screen
        name="profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => {
            return <Icon name="manage-accounts" size={size} color={color} />;
          },
        }}
      />
    </TabStack.Navigator>
  );
};

const AllRoutes = () => {
  const { auth } = useAuthStore();
  const { sendNotification } = useNotifications();
  const routes = useNavigationState((state) => state);
  const currentIndex = routes?.["index"];
  const { appState } = useAppState();

  const { socket } = useSocket({});

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data, "socket_data");
      if (data.type === "new_message") {
        const msg_data = data.data;
        if ("conversationId" in msg_data) {
          const currentParams = routes?.routes[currentIndex].params as any;
          console.log(currentParams, "currentParams");

          if (
            currentParams?.conversationId === msg_data.conversationId &&
            appState === "active"
          )
            return;

          sendNotification({
            title: "Received Message",
            body: msg_data.content,
            data: {
              conversationId: msg_data.conversationId,
              name: "",
            },
            identifier: msg_data.conversationId,
          });
        }
      }
      console.log(data, "socket_data");
    };
  }, [socket, currentIndex, appState]);

  return (
    <RootStack.Navigator initialRouteName={auth ? "main_screen" : "log_in"}>
      <RootStack.Screen
        name="main_screen"
        component={MainTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="user_conversation"
        component={Messages}
        options={{
          title: "",
        }}
      />
      <RootStack.Screen
        name="user_files"
        component={ChatFiles}
        options={{
          title: "All Files",
        }}
      />

      <RootStack.Screen
        name="view_files"
        component={ViewFiles}
        options={{
          presentation: "modal",
        }}
      />

      <RootStack.Screen
        name="log_in"
        component={Login}
        options={{
          title: "Log In",
        }}
      />
      <RootStack.Screen
        name="sign_in"
        component={SignUp}
        options={{
          title: "Sign Up",
        }}
      />
    </RootStack.Navigator>
  );
};

const Routes = () => {
  return (
    <NavigationContainer>
      <AllRoutes />
    </NavigationContainer>
  );
};

export default Routes;
