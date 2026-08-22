import type { ComponentType } from "react";
import type { ViewProps } from "react-native";
import { Platform, Text, View } from "react-native";
import { resolveNativeComponent } from "@/src/components/native/resolveNativeComponent";

export type NativeDemoCardProps = { title?: string } & ViewProps;

const NativeView =
  resolveNativeComponent<NativeDemoCardProps>("NativeDemoCard");

export function NativeDemoCard(props: NativeDemoCardProps) {
  if (Platform.OS === "web" || !NativeView) {
    return (
      <View {...props} style={[props.style, { backgroundColor: "#e5e5e5", justifyContent: "center", padding: 16 }]}>
        <Text style={{ textAlign: "center", fontSize: 16 }}>{props.title ?? "Native Demo Card"}</Text>
      </View>
    );
  }
  const C = NativeView as ComponentType<NativeDemoCardProps>;
  return <C {...props} />;
}
