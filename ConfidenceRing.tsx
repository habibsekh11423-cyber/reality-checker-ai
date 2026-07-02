import type { Verdict } from "@/context/ScanContext";
import { useColors } from "@/hooks/useColors";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  confidence: number;
  verdict: Verdict;
  size?: number;
}

export function ConfidenceRing({ confidence, verdict, size = 140 }: Props) {
  const colors = useColors();
  const anim = useRef(new Animated.Value(0)).current;

  const strokeColor = {
    authentic: colors.success,
    suspicious: colors.warning,
    "likely-fake": colors.destructive,
  }[verdict];

  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: confidence,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [confidence]);

  const strokeDashoffset = anim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor + "22"}
          strokeWidth={10}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={10}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.inner}>
        <Text style={[styles.percent, { color: strokeColor }]}>
          {confidence}%
        </Text>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          confidence
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    position: "absolute",
    alignItems: "center",
  },
  percent: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: -2,
  },
});
