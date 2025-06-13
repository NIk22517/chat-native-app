import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Typography } from "./Typograhy";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "text"
  | "outline"
  | "error"
  | "delete"
  | "default";

interface ButtonProps extends PressableProps {
  content: string | React.ReactNode;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}

const Button = ({
  content,
  variant = "default",
  style,
  ...props
}: ButtonProps) => {
  const buttonStyle = [styles[variant], style];

  return (
    <Pressable style={buttonStyle} {...props}>
      {typeof content === "string" ? <Typography content={content} /> : content}
    </Pressable>
  );
};

const styles = StyleSheet.create<Record<ButtonVariant, ViewStyle>>({
  primary: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  secondary: {
    backgroundColor: "#D3D3D3",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    backgroundColor: "transparent",
    padding: 8,
    alignItems: "center",
  },
  outline: {
    borderColor: "#1E90FF",
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  error: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  delete: {
    backgroundColor: "#DC143C",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  default: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default Button;
