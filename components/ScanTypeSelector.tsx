import type { ScanType } from "@/context/ScanContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  selected: ScanType;
  onSelect: (t: ScanType) => void;
}

const TABS: { type: ScanType; icon: "file-text" | "image" | "link"; label: string }[] = [
  { type: "text", icon: "file-text", label: "Text" },
  { type: "image", icon: "image", label: "Image" },
  { type: "url", icon: "link", label: "URL" },
];

export function ScanTypeSelector({ selected, onSelect }: Props) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.muted, borderRadius: 16 },
      ]}
    >
      {TABS.map((tab) => {
        const active = selected === tab.type;
        return (
          <Pressable
            key={tab.type}
            style={[
              styles.tab,
              {
                backgroundColor: active ? colors.card : "transparent",
                borderRadius: 12,
                shadowColor: active ? "#000" : "transparent",
                shadowOpacity: active ? 0.08 : 0,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: active ? 2 : 0,
              },
            ]}
            onPress={() => onSelect(tab.type)}
          >
            <Feather
              name={tab.icon}
              size={16}
              color={active ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.label,
                {
                  color: active ? colors.primary : colors.mutedForeground,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
