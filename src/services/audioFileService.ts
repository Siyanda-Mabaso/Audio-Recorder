
import { File } from "expo-file-system";
import { Platform } from "react-native";

// Delete an audio file from device storage
export const deleteAudioFile = async (
  uri: string
): Promise<void> => {
  try {
    // Expo FileSystem deletion is intended for native platforms here.
    if (Platform.OS === "web") {
      return;
    }

    const audioFile = new File(uri);

    if (audioFile.exists) {
      audioFile.delete();
    }
  } catch (error) {
    console.error("Error deleting audio file:", error);
    throw error;
  }
};
