import { useColors } from "@/hooks/useColors";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

const ADMOB_BANNER_ID =
  Platform.OS === "android"
    ? "ca-app-pub-3940256099942544/6300978111"
    : "ca-app-pub-3940256099942544/2934735716";

export function AdBanner() {
  const colors = useColors();

  if (Platform.OS === "web") return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary, borderTopColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        Advertisement
      </Text>
      <View style={[styles.adPlaceholder, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Text style={[styles.adText, { color: colors.mutedForeground }]}>
          AdMob Banner · {ADMOB_BANNER_ID}
        </Text>
        <Text style={[styles.adSub, { color: colors.mutedForeground }]}>
          Install react-native-google-mobile-ads and replace this view
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  label: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  adPlaceholder: {
    width: 320,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  adText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  adSub: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 2,
  },
});
