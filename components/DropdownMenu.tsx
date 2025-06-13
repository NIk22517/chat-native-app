import { ReactNode, useRef, useState } from "react";
import { LayoutRectangle, StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DropdownMenuProps {
  trigger: (toggle: () => void) => ReactNode;
  children: (props: { closeMenu: () => void }) => React.ReactNode;
  animationDuration?: number;
  menuStyle?: ViewStyle;
}

export const DropdownMenu = ({
  trigger,
  children,
  animationDuration = 200,
  menuStyle,
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const height = useSharedValue(0); // Initially set to 0 for closed menu
  const menuRef = useRef<View>(null);
  const [menuLayout, setMenuLayout] = useState<LayoutRectangle | null>(null);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
    height.value = open
      ? withTiming(0, { duration: animationDuration }) // Close the menu
      : withTiming(1, { duration: animationDuration }); // Open the menu
  };

  const closeMenu = () => {
    setOpen(false);
    height.value = withTiming(0, { duration: animationDuration });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: height.value,
    zIndex: 1000, // Ensure it's on top
    transform: [
      {
        scale: height.value,
      },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      {trigger(toggleMenu)}
      <View
        ref={menuRef}
        onLayout={(event) => setMenuLayout(event.nativeEvent.layout)}
        style={styles.menuContainer}
      >
        <Animated.View style={[styles.menu, menuStyle, animatedStyle]}>
          {children({ closeMenu })}
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative", // Ensure container is positioned for dropdown
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    overflow: "hidden",
    elevation: 5,
    width: 150,
  },
});
