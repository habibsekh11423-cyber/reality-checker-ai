import { ScanHistoryCard } from "@/components/ScanHistoryCard";
import { useScan } from "@/context/ScanContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { history, setCurrentResult, clearHistory } = useScan();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const handleClear = () => {
    Alert.alert(
      "Clear History",
      "This will permanently delete all past scans.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearHistory();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 16,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.heading, { color: colors.foreground }]}>
          Scan History
        </Text>
        {history.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={8}>
            <Feather name="trash-2" size={18} color={colors.destructive} />
          </Pressable>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Feather name="clock" size={32} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No scans yet
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            Results from your scans will appear here for easy review.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ScanHistoryCard
              item={item}
              onPress={() => {
                setCurrentResult(item);
                router.push("/result");
              }}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: bottomPadding + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!history.length}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
