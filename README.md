<img src="https://socialify.git.ci/Siyanda-Mabaso/Audio-Recorder/image?language=1&name=1&owner=1&pattern=Circuit+Board&stargazers=1&theme=Dark" alt="Audio-Recorder" width="640" height="320" />
React Native Audio Recorder

A React Native voice journal application built with Expo and TypeScript. The app allows users to record, save, play, rename, search, and delete voice recordings directly on their devices.

## Features

- **Audio Recording:** Record voice notes using the device microphone.
- **Microphone Permissions:** Requests permission before accessing the microphone.
- **Recording Timer:** Displays the recording duration.
- **Audio Playback:** Play and pause saved recordings.
- **Recording Management:** Rename and delete recordings.
- **Search:** Find recordings by name.
- **Local Storage:** Saves recording information and audio files on the device.
- **Offline Support:** Designed to allow locally saved recordings to be accessed without an internet connection.

## Technologies Used

- React Native
- Expo SDK
- TypeScript
- Expo Router
- Expo Audio
- Expo File System
- AsyncStorage

## Project Structure

```text
Audio-Recorder/
├── assets/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── recorder.tsx
│   ├── components/
│   │   └── RecordingItem.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── RecorderScreen.tsx
│   ├── services/
│   │   ├── audioFileService.ts
│   │   └── recordingService.ts
│   └── types/
│       └── Recording.ts
├── app.json
├── package.json
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate into the project

```bash
cd Audio-Recorder
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npx expo start
```

You can open the application using Expo Go or a supported development environment.

## Running the Application

- Press `w` to open the web version, where supported.
- Scan the QR code using Expo Go to test on a mobile device.
- Use an Android emulator if available.

**Note:** Microphone recording and native audio functionality should be tested on a supported mobile device or development build. Browser support may differ.

## Data Storage

The application uses:

- **AsyncStorage** to store recording details.
- **Expo Audio** to record and play audio.
- **Expo File System** to manage saved audio files.
