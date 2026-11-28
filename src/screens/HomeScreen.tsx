
import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { getRecordings } from "../services/recordingService";
import { Recording } from "../types/Recording";
import RecordingItem from "../components/RecordingItem";

export default function HomeScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [search, setSearch] = useState("");

  const loadRecordings = async () => {
    const savedRecordings = await getRecordings();
    setRecordings(savedRecordings);
  };

  useFocusEffect(
    useCallback(() => {
      loadRecordings();
    }, [])
  );

  const filteredRecordings = recordings.filter((recording) =>
    recording.name.toLowerCase().includes(search.toLowerCase().trim())
  );

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

      <TextInput
        style={styles.searchInput}
        placeholder="Search recordings by name..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎙️</Text>
            <Text style={styles.emptyTitle}>
              {search ? "No matching recordings" : "No recordings yet"}
            </Text>
            <Text style={styles.emptyText}>
              {search
                ? "Try searching with a different name."
                : "Your saved voice recordings will appear here."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecordingItem
            recording={item}
            onUpdate={loadRecordings}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101827",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 6,
  },
  recordButton: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  recordIcon: {
    color: "#FFFFFF",
    fontSize: 28,
    marginRight: 15,
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSubtitle: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },
  count: {
    color: "#60A5FA",
    fontSize: 13,
  },
  searchInput: {
    backgroundColor: "#1E293B",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 45,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});
