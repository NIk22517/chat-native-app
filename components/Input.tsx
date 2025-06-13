import {
  TextInput,
  TextInputProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Typography, TypographyProps } from "./Typograhy";

interface InputProps extends TextInputProps {
  boxProps?: ViewProps;
  labelProps?: TypographyProps;
  errorText?: TypographyProps;
  inputStyle?: ViewStyle;
}

const Input = ({
  labelProps,
  errorText,
  boxProps,
  inputStyle,
  ...props
}: InputProps) => {
  return (
    <View {...boxProps}>
      {labelProps?.content && <Typography {...labelProps} />}
      <View>
        <TextInput
          {...props}
          style={[
            {
              paddingHorizontal: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "grey",
            },
            inputStyle,
          ]}
        />
        {errorText?.content && (
          <Typography
            variant="caption"
            {...errorText}
            style={{
              color: "red",
              paddingTop: 5,
              paddingLeft: 5,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Input;
