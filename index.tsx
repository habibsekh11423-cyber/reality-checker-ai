import { ScanTypeSelector } from "@/components/ScanTypeSelector";
import type { ScanType } from "@/context/ScanContext";
import { useScan } from "@/context/ScanContext";
import { useGeminiScan } from "@/hooks/useGeminiScan";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addScan, setCurrentResult } = useScan();
  const { scan, loading, error } = useGeminiScan();

  const [scanType, setScanType] = useState<ScanType>("text");
  const [inputText, setInputText] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getInput = () => {
    if (scanType === "image") return imageUri ?? "";
    return inputText.trim();
  };

  const canScan = () => getInput().length > 0;

  const runScan = async () => {
    if (!canScan() || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startPulse();

    const inp = getInput();
    const partial = await scan(scanType, inp);

    stopPulse();

    if (!partial) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const result = {
      ...partial,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      scannedAt: Date.now(),
    };

    addScan(result);
    setCurrentResult(result);
    router.push("/result");
  };

  const placeholder = {
    text: "Paste any text, news article, quote, or claim here…",
    url: "Enter a URL or website link to analyze…",
    image: "",
  }[scanType];

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPadding + 16,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <View style={[styles.logoWrap, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="shield" size={26} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>Reality Checker</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Powered by Google Gemini AI
              </Text>
            </View>
          </View>

          <ScanTypeSelector
            selected={scanType}
            onSelect={(t) => {
              setScanType(t);
              setInputText("");
              setImageUri(null);
            }}
          />

          <View style={{ height: 16 }} />

          <View
            style={[
              styles.inputCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            {scanType === "image" ? (
              <Pressable
                style={[
                  styles.imagePicker,
                  { backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: 12 },
                ]}
                onPress={pickImage}
              >
                {imageUri ? (
                  <View style={styles.imagePreviewRow}>
                    <Feather name="image" size={18} color={colors.success} />
                    <Text style={[styles.imageUri, { color: colors.foreground }]} numberOfLines={1}>
                      Image selected
                    </Text>
                    <Pressable onPress={() => setImageUri(null)} hitSlop={8}>
                      <Feather name="x" size={16} color={colors.mutedForeground} />
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.imageEmpty}>
                    <Feather name="upload" size={32} color={colors.mutedForeground} />
                    <Text style={[styles.imageHint, { color: colors.mutedForeground }]}>
                      Tap to select an image
                    </Text>
                    <Text style={[styles.imageHintSub, { color: colors.mutedForeground }]}>
                      JPG, PNG, HEIF supported
                    </Text>
                  </View>
                )}
              </Pressable>
            ) : (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                    borderRadius: 12,
                  },
                ]}
                multiline={scanType === "text"}
                numberOfLines={scanType === "text" ? 6 : 1}
                placeholder={placeholder}
                placeholderTextColor={colors.mutedForeground}
                value={inputText}
                onChangeText={setInputText}
                autoCapitalize="none"
                autoCorrect={scanType === "text"}
                keyboardType={scanType === "url" ? "url" : "default"}
                textAlignVertical="top"
              />
            )}
          </View>

          <View style={{ height: 16 }} />

          <View style={[styles.statsRow, { backgroundColor: colors.secondary, borderRadius: 12 }]}>
            {[
              { icon: "cpu" as const, label: "Gemini 2.5 Flash" },
              { icon: "clock" as const, label: "~5s scan" },
              { icon: "lock" as const, label: "Private" },
            ].map((item) => (
              <View key={item.label} style={styles.statItem}>
                <Feather name={item.icon} size={13} color={colors.mutedForeground} />
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 20 }} />

          {error ? (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "40", borderRadius: 12 },
              ]}
            >
              <Feather name="alert-triangle" size={14} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}

          {error ? <View style={{ height: 12 }} /> : null}

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable
              style={[
                styles.scanBtn,
                {
                  backgroundColor: canScan() ? colors.primary : colors.muted,
                  borderRadius: 16,
                  opacity: loading ? 0.9 : 1,
                },
              ]}
              onPress={runScan}
              disabled={!canScan() || loading}
            >
              {loading ? (
                <View style={styles.btnInner}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.btnText}>Analyzing with Gemini…</Text>
                </View>
              ) : (
                <View style={styles.btnInner}>
                  <Feather name="shield" size={18} color={canScan() ? "#fff" : colors.mutedForeground} />
                  <Text style={[styles.btnText, { color: canScan() ? "#fff" : colors.mutedForeground }]}>
                    Scan Now
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          <View style={{ height: 24 }} />

          <View
            style={[
              styles.tipCard,
              { backgroundColor: colors.primary + "0D", borderColor: colors.primary + "30", borderRadius: 12 },
            ]}
          >
            <Feather name="info" size={14} color={colors.primary} style={{ marginTop: 1 }} />
            <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Tip: </Text>
              {scanType === "text"
                ? "Paste social media posts, news excerpts, or quotes for best results."
                : scanType === "url"
                  ? "Enter the full URL including https:// for accurate domain analysis."
                  : "Images with faces are analyzed for deepfake markers automatically."}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 },
  logoWrap: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 1 },
  inputCard: { borderWidth: StyleSheet.hairlineWidth, padding: 12 },
  textInput: {
    padding: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    minHeight: 120,
    lineHeight: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  imagePicker: { borderWidth: StyleSheet.hairlineWidth, minHeight: 130, justifyContent: "center", alignItems: "center" },
  imageEmpty: { alignItems: "center", gap: 8, paddingVertical: 16 },
  imageHint: { fontSize: 15, fontFamily: "Inter_500Medium" },
  imageHintSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  imagePreviewRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 18, width: "100%" },
  imageUri: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, paddingHorizontal: 8 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  scanBtn: { paddingVertical: 18, alignItems: "center", justifyContent: "center" },
  btnInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  btnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  tipCard: { flexDirection: "row", gap: 10, padding: 14, borderWidth: 1 },
  tipText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  errorBox: { flexDirection: "row", gap: 8, padding: 12, borderWidth: 1, alignItems: "flex-start" },
  errorText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 19 },
});
