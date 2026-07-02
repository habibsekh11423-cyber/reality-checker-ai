import type { Verdict } from "@/context/ScanContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  verdict: Verdict;
  large?: boolean;
}

export function VerdictBadge({ verdict, large = false }: Props) {
  const colors = useColors();

  const config = {
    authentic: {
      label: "Authentic",
      icon: "check-circle" as const,
      bg: colors.success + "22",
      fg: colors.success,
    },
    suspicious: {
      label: "Suspicious",
      icon: "alert-circle" as const,
      bg: colors.warning + "22",
      fg: colors.warning,
    },
    "likely-fake": {
      label: "Likely Fake",
      icon: "x-circle" as const,
      bg: colors.destructive + "22",
      fg: colors.destructive,
    },
  }[verdict];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.fg + "44",
          paddingVertical: large ? 10 : 5,
          paddingHorizontal: large ? 16 : 10,
          borderRadius: large ? 20 : 12,
        },
      ]}
    >
      <Feather
        name={config.icon}
        size={large ? 20 : 14}
        color={config.fg}
        style={{ marginRight: 5 }}
      />
      <Text
        style={[
          styles.label,
          { color: config.fg, fontSize: large ? 16 : 12 },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
  },
});
