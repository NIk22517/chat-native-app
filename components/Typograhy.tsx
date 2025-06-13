import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

type TextSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "caption";

export interface TypographyProps extends TextProps {
  content: string | number;
  variant?: TextSize;
  align?: TextStyle["textAlign"];
}

export const Typography: React.FC<TypographyProps> = ({
  content,
  variant = "p",
  align = "left",
  style,
  ...props
}) => {
  if (!content) return;
  return (
    <Text style={[styles[variant], { textAlign: align }, style]} {...props}>
      {content}
    </Text>
  );
};

const styles = StyleSheet.create<Record<TextSize, TextStyle>>({
  h1: {
    fontSize: 34,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 32,
    fontWeight: "600",
  },
  h3: {
    fontSize: 26,
    fontWeight: "500",
  },
  h4: {
    fontSize: 22,
    fontWeight: "500",
  },
  h5: {
    fontSize: 20,
    fontWeight: "400",
  },
  h6: {
    fontSize: 18,
    fontWeight: "400",
  },
  p: {
    fontSize: 14,
    fontWeight: "normal",
  },
  caption: {
    fontSize: 12,
    fontWeight: "300",
    color: "#6b6b6b",
  },
});
