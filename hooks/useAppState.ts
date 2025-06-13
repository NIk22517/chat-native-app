import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return { appState };
};
