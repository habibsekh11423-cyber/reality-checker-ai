import type { ScanResult } from "@/context/ScanContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { VerdictBadge } from "./VerdictBadge";

interface Props {
  item: ScanResult;
  onPress: () => void;
}

const TYPE_ICON: Record<string, "file-text" | "image" | "link"> = {
  text: "file-text",
  image: "image",
  url: "link",
};

export function ScanHistoryCard({ item, onPress }: Props) {
  const colors = useColors();

  const elapsed = (() => {
    const diff = Date.now() - item.scannedAt;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  const preview =
    item.input.length > 60 ? item.input.slice(0, 57) + "..." : item.input;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[styles.iconWrap, { backgroundColor: colors.secondary }]}
      >
        <Feather
          name={TYPE_ICON[item.type]}
          size={18}
          color={colors.primary}
        />
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.preview, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {preview}
        </Text>
        <View style={styles.meta}>
          <VerdictBadge verdict={item.verdict} />
          <Text style={[styles.time, { color: colors.mutedForeground }]}>
            {elapsed}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  preview: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  time: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
