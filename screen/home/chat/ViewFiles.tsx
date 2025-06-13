import { View, Dimensions } from "react-native";
import { useFilesStore } from "../../../store/useFilesStore";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ViewFiles = () => {
  const { files, index, setIndex } = useFilesStore();
  const translateX = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2;

      if (event.translationX < -SWIPE_THRESHOLD && index < files.length - 1) {
        runOnJS(setIndex)(index + 1);
      } else if (event.translationX > SWIPE_THRESHOLD && index > 0) {
        runOnJS(setIndex)(index - 1);
      }

      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Animated.Image
          source={{ uri: files[index]?.secure_url }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default ViewFiles;
