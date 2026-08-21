import type { ComponentType } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import { resolveNativeComponent } from "@/src/components/native/resolveNativeComponent";

export type NativeSparklineProps = {
  trend?: "up" | "down" | "flat";
  data?: number[];
  style?: ViewProps["style"];
} & ViewProps;

const NativeSparklineNative = resolveNativeComponent<NativeSparklineProps>("NativeSparkline");

export function NativeSparkline({ trend = "flat", data, style, ...rest }: NativeSparklineProps) {
  if (!NativeSparklineNative) {
    return <View style={[{ width: 60, height: 32, backgroundColor: "transparent" }, style]} {...rest} />;
  }
  const NativeView = NativeSparklineNative as ComponentType<NativeSparklineProps>;
  return <NativeView trend={trend} data={data} style={[{ width: 60, height: 32 }, style]} {...rest} />;
}
