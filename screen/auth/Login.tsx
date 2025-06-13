import { StyleSheet, View } from "react-native";
import Input from "../../components/Input";
import { Link } from "@react-navigation/native";
import Button from "../../components/Button";
import { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackType } from "../../router";
import Auth from "../../services/auth.service";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation } from "../../hooks/useMutation";

type LoginProps = StackScreenProps<RootStackType, "log_in">;

const useLogIn = () => {
  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: { email: string; password: string };
    }) => {
      const res = await Auth.logIn({ data });
      if ("token" in res.data) {
        return res.data;
      } else {
        throw new Error("Something went wrong");
      }
    },
  });
};

const Login = ({ navigation }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuthStore();
  const { mutate } = useLogIn();

  const handleLogIn = async () => {
    mutate(
      {
        data: {
          email,
          password,
        },
      },
      {
        onSuccess: ({ data }) => {
          if (data) {
            setAuth(data);
            navigation.replace("main_screen");
          }
        },
      }
    );
  };
  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Input
            labelProps={{
              content: "Email",
            }}
            placeholder="Enter Email"
            onChangeText={setEmail}
          />
          <Input
            labelProps={{
              content: "Password",
            }}
            placeholder="Enter Password"
            onChangeText={setPassword}
          />
          <Link screen={"sign_in"} style={styles.linkText}>
            Create a new account
          </Link>
          <Button content={"Log in"} onPress={handleLogIn} variant="primary" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "90%",
    gap: 15,
  },
  linkText: {
    textAlign: "right",
  },
});

export default Login;
