import type { Signal } from "@/context/ScanContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  signal: Signal;
}

export function SignalRow({ signal }: Props) {
  const colors = useColors();

  const barColor = signal.flagged
    ? signal.score < 40
      ? colors.destructive
      : colors.warning
    : colors.success;

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.top}>
        <View style={styles.labelRow}>
          <Feather
            name={signal.flagged ? "alert-triangle" : "check"}
            size={13}
            color={barColor}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.label, { color: colors.foreground }]}>
            {signal.label}
          </Text>
        </View>
        <Text style={[styles.score, { color: barColor }]}>
          {signal.score}
        </Text>
      </View>
      <View
        style={[styles.trackBg, { backgroundColor: colors.border }]}
      >
        <View
          style={[
            styles.trackFill,
            {
              width: `${signal.score}%` as any,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      <Text style={[styles.desc, { color: colors.mutedForeground }]}>
        {signal.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flexShrink: 1,
  },
  score: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    marginLeft: 8,
    minWidth: 28,
    textAlign: "right",
  },
  trackBg: {
    height: 4,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  trackFill: {
    height: 4,
    borderRadius: 4,
  },
  desc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
});
