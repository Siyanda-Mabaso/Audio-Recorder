
import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { getRecordings } from "../services/recordingService";
import { Recording } from "../types/Recording";

export default function HomeScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const loadRecordings = async () => {
    const savedRecordings = await getRecordings();
    setRecordings(savedRecordings);
  };

  useFocusEffect(
    useCallback(() => {
      loadRecordings();
    }, [])
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Journal</Text>
        <Text style={styles.subtitle}>
          Your personal space for recording memories.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.recordButton}
        onPress={() => router.push("/recorder")}
      >
        <Text style={styles.recordIcon}>●</Text>
        <View>
          <Text style={styles.buttonTitle}>New Recording</Text>
          <Text style={styles.buttonSubtitle}>
            Tap here to record your voice
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Recordings</Text>
        <Text style={styles.count}>{recordings.length} saved</Text>
      </View>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎙️</Text>
            <Text style={styles.emptyTitle}>No recordings yet</Text>
            <Text style={styles.emptyText}>
              Your saved voice recordings will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.recordingCard}>
            <View style={styles.audioIcon}>
              <Text style={styles.audioIconText}>♫</Text>
            </View>

            <View style={styles.recordingInfo}>
              <Text style={styles.recordingName}>{item.name}</Text>
              <Text style={styles.recordingDate}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

            <Text style={styles.duration}>
              {formatDuration(item.duration)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101827",
    padding: 20,
    paddingTop: 65,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 8,
  },
  recordButton: {
    backgroundColor: "#2563EB",
    padding: 20,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  recordIcon: {
    color: "#FFFFFF",
    fontSize: 30,
    marginRight: 18,
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  buttonSubtitle: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  count: {
    color: "#94A3B8",
    fontSize: 13,
  },
  list: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  recordingCard: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  audioIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  audioIconText: {
    color: "#60A5FA",
    fontSize: 25,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  recordingDate: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },
  duration: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
  },
});
