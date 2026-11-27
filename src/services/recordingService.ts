
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recording } from "../types/Recording";

const RECORDINGS_KEY = "recordings";

// Get all saved recordings
export const getRecordings = async (): Promise<Recording[]> => {
  try {
    const data = await AsyncStorage.getItem(RECORDINGS_KEY);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting recordings:", error);
    return [];
  }
};

// Save recordings
export const saveRecordings = async (
  recordings: Recording[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      RECORDINGS_KEY,
      JSON.stringify(recordings)
    );
  } catch (error) {
    console.error("Error saving recordings:", error);
    throw error;
  }
};

// Add a new recording
export const addRecording = async (
  recording: Recording
): Promise<void> => {
  const recordings = await getRecordings();

  recordings.unshift(recording);

  await saveRecordings(recordings);
};

// Rename a recording
export const renameRecording = async (
  id: string,
  newName: string
): Promise<void> => {
  const recordings = await getRecordings();

  const updatedRecordings = recordings.map((recording) =>
    recording.id === id
      ? { ...recording, name: newName }
      : recording
  );

  await saveRecordings(updatedRecordings);
};

// Delete a recording's information
export const deleteRecording = async (
  id: string
): Promise<void> => {
  const recordings = await getRecordings();

  const updatedRecordings = recordings.filter(
    (recording) => recording.id !== id
  );

  await saveRecordings(updatedRecordings);
};
