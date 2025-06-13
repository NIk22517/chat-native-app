import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type IconType = React.ComponentProps<typeof MaterialIcons> & {};

export const Icon = ({ ...props }: IconType) => {
  return <MaterialIcons {...props} />;
};
