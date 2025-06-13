import { Image, StyleSheet, Text, View } from "react-native";
import { Icon } from "./Icon";

interface AvatarProps {
  uri?: string | null;
  fallbackText?: string;
  size?: number;
}

export const Avatar = ({ uri, fallbackText, size = 50 }: AvatarProps) => {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {uri ? (
        <Image
          source={{
            uri: uri,
          }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <>
          {fallbackText ? (
            <Text style={[styles.fallbackText, { fontSize: size / 2 }]}>
              {fallbackText[0]?.toUpperCase()}
            </Text>
          ) : (
            <Icon name="account-circle" color={"grey"} size={size} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  fallbackText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
