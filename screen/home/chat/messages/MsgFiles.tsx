import {
  Image,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import useFileType from "../../../../hooks/useFileType";
import { Icon } from "../../../../components/Icon";
import { FlatList } from "react-native";
import { Typography } from "../../../../components/Typograhy";
import { ViewFiles } from "../../../../components/ViewFiles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackType } from "../../../../router";
import { useFilesStore } from "../../../../store/useFilesStore";

type CloudinaryImage = {
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
};

export const Attachments = ({
  file,
  imageStyle,
  onPress,
}: {
  file: CloudinaryImage;
  imageStyle?: ImageStyle;
  onPress: () => void;
}) => {
  const fileType = useFileType({
    fileType: file.format,
  });

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      {fileType === "image" ? (
        <Image
          source={{ uri: file.secure_url }}
          style={[
            {
              width: 150,
              height: 150,
              borderRadius: 10,
            },
            imageStyle,
          ]}
        />
      ) : fileType === "pdf" ? (
        <Icon name="picture-as-pdf" size={60} />
      ) : (
        <Icon name="file-open" size={60} />
      )}
    </TouchableOpacity>
  );
};

export const MsgFiles = ({ files }: { files: CloudinaryImage[] }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackType>>();
  const { setFiles } = useFilesStore();
  if (!files) return null;

  return (
    <FlatList
      data={files?.slice(0, 4)}
      keyExtractor={(item) => item.asset_id}
      numColumns={2}
      renderItem={({ item, index }) => {
        return (
          <>
            {index < 3 ? (
              <Attachments
                file={item}
                onPress={() => {
                  setFiles({
                    files: files,
                    index: index,
                  });
                  navigation.navigate("view_files");
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "grey",
                  flexGrow: 1,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 2,
                }}
              >
                <Typography
                  content={`+${files.length - 3}`}
                  variant="h2"
                  style={{ color: "white" }}
                />
              </View>
            )}
          </>
        );
      }}
      contentContainerStyle={styles.container}
      style={{ alignSelf: "flex-start" }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
});
