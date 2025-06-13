import { StyleSheet, View } from "react-native";
import Input from "../../components/Input";
import { Link } from "@react-navigation/native";
import Button from "../../components/Button";
import { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackType } from "../../router";
import Auth from "../../services/auth.service";
import { useAuthStore } from "../../store/useAuthStore";

type SignUpProps = StackScreenProps<RootStackType, "sign_in">;

const SignUp = ({ navigation }: SignUpProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuthStore();
  const handleLogIn = async () => {
    const res = await Auth.signUn({
      data: {
        email,
        password,
        name,
      },
    });

    if ("token" in res.data) {
      setAuth(res.data);
      navigation.replace("main_screen");
    }
  };
  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Input
            value={name}
            labelProps={{
              content: "Name",
            }}
            placeholder="Enter Name"
            onChangeText={setName}
          />
          <Input
            value={email}
            labelProps={{
              content: "Email",
            }}
            placeholder="Enter Email"
            onChangeText={setEmail}
          />
          <Input
            value={password}
            labelProps={{
              content: "Password",
            }}
            placeholder="Enter Password"
            onChangeText={setPassword}
          />
          <Link screen={"sign_in"} style={styles.linkText}>
            Create a new account
          </Link>
          <Button content={"Sign-Up"} onPress={handleLogIn} variant="primary" />
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

export default SignUp;
