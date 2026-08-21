import type { HostComponent } from "react-native";
import { Platform, UIManager, requireNativeComponent } from "react-native";
import Constants from "expo-constants";

function isExpoGo(): boolean {
  return (
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient"
  );
}

/**
 * Safely resolve a native view manager. Returns null in Expo Go / web when the
 * native module is not linked (avoids "View config not found" crashes).
 */
export function resolveNativeComponent<Props extends object>(
  name: string
): HostComponent<Props> | null {
  if (Platform.OS === "web" || isExpoGo()) {
    return null;
  }
  try {
    const hasConfig =
      typeof UIManager.hasViewManagerConfig === "function"
        ? UIManager.hasViewManagerConfig(name)
        : Boolean(UIManager.getViewManagerConfig?.(name));
    if (!hasConfig) {
      return null;
    }
    return requireNativeComponent<Props>(name);
  } catch {
    return null;
  }
}
