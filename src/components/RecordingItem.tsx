
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Recording } from "../types/Recording";

interface RecordingItemProps {
  recording: Recording;
}

export default function RecordingItem({
  recording,
}: RecordingItemProps) {
  const player = useAudioPlayer(recording.uri);
  const status = useAudioPlayerStatus(player);

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
        <Text style={styles.name} numberOfLines={1}>
          {recording.name}
        </Text>

        <Text style={styles.date}>
          {new Date(recording.createdAt).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.duration}>
        {formatDuration(recording.duration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  playButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
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
    fontSize: 14,
    fontWeight: "600",
  },
  date: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },
  duration: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "bold",
  },
});

