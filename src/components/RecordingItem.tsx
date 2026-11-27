
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Recording } from "../types/Recording";
import {
  renameRecording,
  deleteRecording,
} from "../services/recordingService";
import { deleteAudioFile } from "../services/audioFileService";

interface RecordingItemProps {
  recording: Recording;
  onUpdate: () => void;
}

export default function RecordingItem({
  recording,
  onUpdate,
}: RecordingItemProps) {
  const player = useAudioPlayer(recording.uri);
  const status = useAudioPlayerStatus(player);

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(recording.name);

  const isPlaying = status.playing;

  const handlePlayback = () => {
    if (isPlaying) {
      player.pause();
    } else {
      if (status.currentTime >= status.duration && status.duration > 0) {
        player.seekTo(0);
      }

      player.play();
    }
  };

  const handleRename = async () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      Alert.alert("Invalid name", "Please enter a recording name.");
      return;
    }

    try {
      await renameRecording(recording.id, trimmedName);
      setIsRenaming(false);
      onUpdate();
    } catch {
      Alert.alert("Error", "Could not rename this recording.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete recording",
      `Are you sure you want to delete "${recording.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              player.pause();
              await deleteAudioFile(recording.uri);
              await deleteRecording(recording.id);
              onUpdate();
            } catch {
              Alert.alert("Error", "Could not delete this recording.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={handlePlayback}
      >
        <Text style={styles.playIcon}>
          {isPlaying ? "Ⅱ" : "▶"}
        </Text>
      </TouchableOpacity>

      <View style={styles.info}>
        {isRenaming ? (
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            autoFocus
            placeholder="Recording name"
            placeholderTextColor="#94A3B8"
            onSubmitEditing={handleRename}
          />
        ) : (
          <Text style={styles.name} numberOfLines={1}>
            {recording.name}
          </Text>
        )}

        <Text style={styles.date}>
          {new Date(recording.createdAt).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.duration}>
        {formatDuration(recording.duration)}
      </Text>

      {isRenaming ? (
        <TouchableOpacity
          onPress={handleRename}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setNewName(recording.name);
            setIsRenaming(true);
          }}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  playIcon: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  date: {
    color: "#94A3B8",
    fontSize: 10,
    marginTop: 5,
  },
  input: {
    color: "#FFFFFF",
    backgroundColor: "#334155",
    borderRadius: 6,
    padding: 6,
    fontSize: 12,
  },
  duration: {
    color: "#60A5FA",
    fontSize: 12,
    marginHorizontal: 7,
    fontWeight: "bold",
  },
  actionButton: {
    padding: 7,
  },
  actionText: {
    color: "#60A5FA",
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
  deleteText: {
    color: "#F87171",
    fontSize: 24,
  },
});
