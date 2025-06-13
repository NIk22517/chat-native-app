import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { Avatar } from "../../components/Avatar";
import * as DocumentPicker from "expo-document-picker";
import Button from "../../components/Button";
import { Icon } from "../../components/Icon";
import ProfileApi from "../../services/profile.service";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackType } from "../../router";
import { useAuthStore } from "../../store/useAuthStore";

const Profile = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackType>>();
  const { auth: data, setAuth, removeAuth } = useAuthStore();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [files, setFiles] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);

  const handlePickProfile = async () => {
    setPopoverVisible(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled) {
        console.log("User cancelled document picker");
        return;
      }

      setFiles(result);

      console.log(result, "result");
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handleChangeProfile = async () => {
    try {
      if (files?.assets && files?.assets?.length > 0) {
        const form = new FormData();

        const file = files.assets[0];

        console.log(file, "file");

        form.append("file", {
          uri: file.uri,
          name: file.name ?? "uploaded_file",
          type: file.mimeType ?? "application/octet-stream",
        } as any);

        const res = await ProfileApi.avatarChange(form);
        if ("url" in res.data && data) {
          setFiles(null);
          setAuth({
            ...data,
            avatar: res.data.url,
          });
        }
        console.log(res.data, "res");
      } else {
        console.log("No file selected.");
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const handleLogOut = async () => {
    removeAuth();
    navigation.navigate("log_in");
  };

  if (!data) return null;

  return (
    <View style={styles.container}>
      <Popover
        isVisible={popoverVisible}
        placement={PopoverPlacement.BOTTOM}
        from={
          <TouchableOpacity
            onPress={() => setPopoverVisible(true)}
            style={styles.img}
          >
            <Avatar
              uri={files?.assets?.[0]?.uri ?? data.avatar}
              fallbackText={data.name}
              size={250}
            />
          </TouchableOpacity>
        }
        onRequestClose={() => setPopoverVisible(false)}
        onCloseComplete={() => setPopoverVisible(false)}
      >
        <View style={styles.popoverContent}>
          <TouchableOpacity onPress={handlePickProfile}>
            <Text>Select Profile</Text>
          </TouchableOpacity>

          <Button content={"Log-Out"} onPress={handleLogOut} />
        </View>
      </Popover>
      {files && (
        <View style={styles.selectImgBtn}>
          <Button
            content={<Icon name="close" size={50} />}
            style={{
              backgroundColor: "transparent",
            }}
            onPress={() => {
              setFiles(null);
            }}
          />
          <Button
            onPress={handleChangeProfile}
            content={<Icon name="done" size={50} />}
            style={{
              backgroundColor: "transparent",
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  popoverContent: {
    padding: 10,
    backgroundColor: "white",
    // borderRadius: 5,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
  },
  img: {
    alignItems: "center",
  },
  selectImgBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "inherite",
  },
});

export default Profile;
