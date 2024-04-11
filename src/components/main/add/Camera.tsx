import React, {useRef, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useIsFocused} from '@react-navigation/native';

const VideoScreen: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false); // Tracks recording state.
  const cameraRef = useRef<RNCamera>(null); // Reference to the camera component.
  const isFocused = useIsFocused(); // Checks if the screen is in focus.

  // Function to take a picture.
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true, skipProcessing: true};
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri); // Logging the image URI for demonstration.
    }
  };

  // Function to start or stop video recording.
  const recordVideo = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true); // Set recording state to true.
      const videoData = await cameraRef.current.recordAsync();
      console.log(videoData.uri); // Logging the video URI for demonstration.
      setIsRecording(false); // Reset recording state after recording.
    } else if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording(); // Stops recording.
      setIsRecording(false); // Reset recording state.
    }
  };

  // Only render the camera UI if the screen is currently focused.
  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back} // Use the back camera.
        flashMode={RNCamera.Constants.FlashMode.off} // Flash disabled.
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your microphone',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        <View style={styles.buttonContainer}>
          {/* Buttons for taking a picture and recording video. */}
          <TouchableOpacity onPress={takePicture} style={styles.capture} />
          <TouchableOpacity onPress={recordVideo} style={styles.capture} />
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  capture: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    margin: 20,
  },
});

export default VideoScreen;
