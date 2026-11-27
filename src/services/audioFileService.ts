
import { File } from "expo-file-system";

// Delete an audio file from device storage
export const deleteAudioFile = async (
  uri: string
): Promise<void> => {
  try {
    const audioFile = new File(uri);

    if (audioFile.exists) {
      audioFile.delete();
    }
  } catch (error) {
    console.error("Error deleting audio file:", error);
    throw error;
  }
};
