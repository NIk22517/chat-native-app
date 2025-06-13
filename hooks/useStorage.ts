import AsyncStorage from "@react-native-async-storage/async-storage";

type KeyType = "auth-storage";

export type AuthDataType = {
  name: string;
  id: string;
  email: string;
  password: string;
  avatar: string | null;
  createdAt: Date;
  active: boolean;
  lastSeen: Date | null;
  token: string | null;
};

type StorageDataType = {
  "auth-storage": AuthDataType;
};

export const setStorageData = async <K extends KeyType>({
  data,
  key,
}: {
  data: StorageDataType[K];
  key: K;
}) => {
  try {
    const strData = JSON.stringify(data);
    await AsyncStorage.setItem(key, strData);
  } catch (error) {
    console.error(`something when wrong while adding ${key}`, error);
  }
};

export const getStorageData = async <K extends KeyType>(key: K) => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    return jsonData ? (JSON.parse(jsonData) as StorageDataType[K]) : null;
  } catch (error) {
    console.error(`something when wrong while getting ${key}`, error);
  }
};

export const removeStorageData = async (key: KeyType) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`something when wrong while removing ${key}`, error);
  }
};
