import { TouchableOpacity, View } from "react-native";
import { MessageType } from "../Messages";
import { Attachments } from "./MsgFiles";
import { Typography } from "../../../../components/Typograhy";
import { Icon } from "../../../../components/Icon";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackType } from "../../../../router";

export const ReplyMessages = ({
  data,
  onClose,
}: {
  data: MessageType;
  onClose: () => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackType>>();

  return (
    <TouchableOpacity
      style={{
        padding: 5,
        borderRadius: 5,
        borderLeftWidth: 4,
        borderColor: "#B2A5FF",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderTopColor: "grey",
        borderBottomWidth: 1,
        marginBottom: 10,
      }}
      onPress={() => {
        navigation.setParams({
          replyId: data.id,
        });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
            }}
          >
            {data?.files?.slice(0, 6)?.map((file: any) => {
              return (
                <Attachments
                  key={file.asset_id}
                  file={file}
                  imageStyle={{
                    width: 40,
                    height: 40,
                  }}
                  onPress={() => {}}
                />
              );
            })}
          </View>
          <Typography
            content={data?.content}
            numberOfLines={1}
            ellipsizeMode="tail"
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "50%",
          }}
          onPress={onClose}
        >
          <Icon name="close" size={20} color={"grey"} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
