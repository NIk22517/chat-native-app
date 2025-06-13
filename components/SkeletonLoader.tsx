import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";

const ANIMATION_TYPE = {
  SHIVER: "shiver",
  FADE: "fade",
};

const ANIMATION_DIRECTION = {
  LEFT_TO_RIGHT: "leftToRight",
  RIGHT_TO_LEFT: "rightToLeft",
  TOP_TO_BOTTOM: "topToBottom",
  BOTTOM_TO_TOP: "bottomToTop",
};

export const SkeletonLoader = ({
  height = 20,
  width = 100,
  style = {},
  baseColor = "#DDEAF5",
  highlightColor = "rgba(255,255,255,0.5)",
  direction = ANIMATION_DIRECTION.LEFT_TO_RIGHT,
  animationType = ANIMATION_TYPE.SHIVER,
  speed = 1000,
}) => {
  const isXDirection =
    direction === ANIMATION_DIRECTION.LEFT_TO_RIGHT ||
    direction === ANIMATION_DIRECTION.RIGHT_TO_LEFT;

  const translate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: isXDirection
      ? [{ translateX: translate.value }]
      : [{ translateY: translate.value }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const startAnimation = useCallback(() => {
    if (animationType === ANIMATION_TYPE.SHIVER) {
      const offset = containerSize.width * 0.75;
      const start =
        direction === ANIMATION_DIRECTION.LEFT_TO_RIGHT
          ? -offset
          : containerSize.width;
      const end =
        direction === ANIMATION_DIRECTION.LEFT_TO_RIGHT
          ? containerSize.width
          : -offset;

      translate.value = start;
      translate.value = withRepeat(
        withTiming(end, { duration: speed, easing: Easing.linear }),
        -1
      );
    } else if (animationType === ANIMATION_TYPE.FADE) {
      opacity.value = withRepeat(
        withTiming(0.5, { duration: speed, easing: Easing.ease }),
        -1,
        true
      );
    }
  }, [containerSize, direction, speed]);

  useEffect(() => {
    if (containerSize.width && containerSize.height) {
      startAnimation();
    }
    return () => cancelAnimation(translate);
  }, [containerSize, startAnimation]);

  return (
    <View
      style={[
        styles.container,
        { width, height, backgroundColor: baseColor },
        style,
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
      }}
    >
      {animationType === ANIMATION_TYPE.SHIVER ? (
        <Animated.View
          style={[
            isXDirection
              ? { height: "100%", width: "80%" }
              : { width: "100%", height: "80%" },
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              highlightColor,
              "rgba(255,255,255,0)",
            ]}
            style={styles.gradient}
            start={isXDirection ? { x: 0, y: 0 } : { x: 0, y: 0 }}
            end={isXDirection ? { x: 1, y: 0 } : { x: 0, y: 1 }}
          />
        </Animated.View>
      ) : (
        <Animated.View style={[styles.fadeOverlay, fadeStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 4,
  },
  gradient: {
    height: "100%",
    width: "100%",
  },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});
