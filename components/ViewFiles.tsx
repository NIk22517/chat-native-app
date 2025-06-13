import { Modal, View } from "react-native";
import { Attachments } from "../screen/home/chat/messages/MsgFiles";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";

export const ViewFiles = ({
  data,
  open,
  onClose,
}: {
  data: any[];
  open: boolean;
  onClose: () => void;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <Modal
      visible={open}
      transparent
      onRequestClose={onClose}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: `rgba(0, 0, 0, 0.5)`,
          height: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "80%",
          }}
        >
          <Attachments
            file={data[selectedIndex]}
            onPress={() => {}}
            imageStyle={{
              width: 300,
              height: 500,
            }}
          />
        </View>

        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <Attachments
                file={item}
                onPress={() => {
                  setSelectedIndex(index);
                }}
                imageStyle={{
                  width: 50,
                  height: 50,
                }}
              />
            );
          }}
          contentContainerStyle={{
            marginTop: "auto",
          }}
        />
      </View>
    </Modal>
  );
};
