import { StyleSheet, View } from "react-native";
import { Avatar } from "../../../components/Avatar";
import { Typography } from "../../../components/Typograhy";
import { useNavigation } from "@react-navigation/native";
import { RootStackType } from "../../../router";
import Button from "../../../components/Button";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMsgTime } from "../../../hooks/useMsgTime";

export const List = ({ item }: { item: any }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackType>>();

  return (
    <Button
      style={{
        alignItems: "flex-start",
        backgroundColor: "#DDEB9D",
        margin: 5,
      }}
      content={
        <View style={styles.container}>
          <Avatar uri={item.avatar} fallbackText={item.name} size={35} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View>
              <Typography content={item.name} />
              {item?.lastMessage && (
                <Typography
                  content={item?.lastMessage}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  variant="caption"
                />
              )}
            </View>
            <Typography
              variant="caption"
              content={useMsgTime(item.updatedAt)}
            />
          </View>
        </View>
      }
      onPress={() => {
        navigation.navigate("user_conversation", {
          conversationId: item.id,
          name: item.name,
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    width: "95%",
  },
});
