
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import { addRecording } from "../services/recordingService";

export default function RecorderScreen() {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    directory: "document",
  });

  const recorderState = useAudioRecorderState(recorder);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      setIsProcessing(true);

      const permission =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow microphone access to record audio."
        );
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      console.error("Recording error:", error);

      Alert.alert("Error", "Could not start recording.");

      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
      } catch (modeError) {
        console.error("Audio mode error:", modeError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsProcessing(true);

      const duration = recorderState.durationMillis;

      await recorder.stop();

      const audioUri = recorder.uri;

      if (!audioUri) {
        Alert.alert("Error", "Recording file could not be found.");
        return;
      }

      const newRecording = {
        id: Date.now().toString(),
        name: `Voice Recording ${new Date().toLocaleString()}`,
        uri: audioUri,
        duration: Math.floor(duration / 1000),
        createdAt: new Date().toISOString(),
      };

      await addRecording(newRecording);

      Alert.alert(
        "Recording saved",
        "Your recording has been saved successfully."
      );
    } catch (error) {
      console.error("Saving error:", error);
      Alert.alert("Error", "Could not save your recording.");
    } finally {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error("Could not restore audio mode:", error);
      }

      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Journal</Text>

      <Text style={styles.subtitle}>
        Capture your thoughts and memories
      </Text>

      <View style={styles.recordingCard}>
        <Text style={styles.status}>
          {recorderState.isRecording
            ? "Recording in progress"
            : "Ready to record"}
        </Text>

        <Text style={styles.timer}>
          {formatTime(recorderState.durationMillis)}
        </Text>

        <TouchableOpacity
          style={[
            styles.recordButton,
            recorderState.isRecording && styles.stopButton,
          ]}
          onPress={
            recorderState.isRecording
              ? stopRecording
              : startRecording
          }
          disabled={isProcessing}
        >
          <View style={styles.recordButtonInner} />
        </TouchableOpacity>

        <Text style={styles.buttonText}>
          {isProcessing
            ? "Please wait..."
            : recorderState.isRecording
            ? "Stop Recording"
            : "Start Recording"}
        </Text>
      </View>

      <Text style={styles.footer}>
        Your recordings are stored on your device.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101827",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 50,
  },
  recordingCard: {
    width: "100%",
    backgroundColor: "#1C293B",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  status: {
    color: "#A5B4FC",
    fontSize: 16,
  },
  timer: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "bold",
    marginVertical: 35,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  stopButton: {
    backgroundColor: "#F59E0B",
  },
  recordButtonInner: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 20,
  },
  footer: {
    color: "#9CA3AF",
    marginTop: 30,
    textAlign: "center",
  },
});
