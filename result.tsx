import { ConfidenceRing } from "@/components/ConfidenceRing";
import { SignalRow } from "@/components/SignalRow";
import { VerdictBadge } from "@/components/VerdictBadge";
import { useScan } from "@/context/ScanContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TYPE_LABEL: Record<string, string> = {
  text: "Text Analysis",
  image: "Image Analysis",
  url: "URL Analysis",
};

const VERDICT_HEADLINE: Record<string, string> = {
  authentic: "Appears Authentic",
  suspicious: "Needs Verification",
  "likely-fake": "Likely Fabricated",
};

export default function ResultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentResult } = useScan();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = insets.bottom + (Platform.OS === "web" ? 34 : 0) + 16;

  useEffect(() => {
    if (!currentResult) {
      router.replace("/");
    }
  }, [currentResult]);

  if (!currentResult) return null;

  const { verdict, confidence, signals, summary, type, input } = currentResult;

  const verdictColor = {
    authentic: colors.success,
    suspicious: colors.warning,
    "likely-fake": colors.destructive,
  }[verdict];

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Reality Checker Result: ${VERDICT_HEADLINE[verdict]} (${confidence}% confidence)\n\n${summary}\n\nScanned with Reality Checker AI`,
      });
    } catch {}
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: topPadding + 8,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            {
              backgroundColor: colors.secondary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.topBarTitle, { color: colors.foreground }]}>
          {TYPE_LABEL[type]}
        </Text>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.backBtn,
            {
              backgroundColor: colors.secondary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="share-2" size={16} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero verdict card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: verdictColor + "10",
              borderColor: verdictColor + "30",
            },
          ]}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={[styles.heroHeadline, { color: colors.foreground }]}>
                {VERDICT_HEADLINE[verdict]}
              </Text>
              <View style={{ marginTop: 8 }}>
                <VerdictBadge verdict={verdict} large />
              </View>
            </View>
            <ConfidenceRing
              confidence={confidence}
              verdict={verdict}
              size={120}
            />
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: verdictColor + "30" },
            ]}
          />

          <Text style={[styles.summaryText, { color: colors.foreground }]}>
            {summary}
          </Text>
        </View>

        {/* Input preview */}
        <View
          style={[
            styles.inputPreview,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            SCANNED CONTENT
          </Text>
          <Text
            style={[styles.inputText, { color: colors.foreground }]}
            numberOfLines={3}
          >
            {type === "image" ? "📷 Image file" : input}
          </Text>
        </View>

        {/* Signals */}
        <View
          style={[
            styles.signalsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.signalsHeader}>
            <Feather name="activity" size={16} color={colors.primary} />
            <Text style={[styles.signalsTitle, { color: colors.foreground }]}>
              Signal Breakdown
            </Text>
          </View>
          {signals.map((sig, i) => (
            <SignalRow key={i} signal={sig} />
          ))}
        </View>

        {/* Footer notice */}
        <View
          style={[
            styles.notice,
            {
              backgroundColor: colors.secondary,
              borderRadius: 12,
            },
          ]}
        >
          <Feather
            name="info"
            size={13}
            color={colors.mutedForeground}
            style={{ marginTop: 1 }}
          />
          <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>
            Results are AI-generated estimates for informational purposes only. Always verify important information with trusted sources.
          </Text>
        </View>

        <Pressable
          style={[
            styles.scanAgainBtn,
            {
              backgroundColor: colors.primary + "14",
              borderColor: colors.primary + "40",
              borderRadius: 14,
            },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Feather name="refresh-cw" size={16} color={colors.primary} />
          <Text style={[styles.scanAgainText, { color: colors.primary }]}>
            Scan Something Else
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  content: {
    padding: 20,
    gap: 14,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroHeadline: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    maxWidth: 180,
  },
  divider: {
    height: 1,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  inputPreview: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
  },
  inputText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  signalsCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  signalsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  signalsTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  notice: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  scanAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  scanAgainText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
