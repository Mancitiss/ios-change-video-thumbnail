import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function VideoPlayer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoSource, setVideoSource] = useState(null);
  const videoPlayer = useRef(null);

  const onLoad = (status) => {
    setDuration(status.durationMillis);
  };

  const onProgress = (status) => {
    setCurrentTime(status.positionMillis);
  };

  const onSlide = (milliseconds) => {
    videoPlayer.current.setPositionAsync(milliseconds);
  };

  const chooseVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      allowsMultipleSelection: false
    });

    if (!result.cancelled) {
      setVideoSource(result.assets.at(0).uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Video" onPress={chooseVideo} />
      {videoSource && (
        <Video
          ref={videoPlayer}
          source={{ uri: videoSource }}
          style={styles.video}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          onPlaybackStatusUpdate={(status) => {
            onLoad(status);
            onProgress(status);
          }}
        />
      )}
      <Slider
        style={styles.slider}
        maximumValue={duration}
        value={currentTime}
        onSlidingComplete={onSlide}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    alignSelf: 'center',
    width: width,
    height: height / 1.6,
  },
  slider: {
    alignSelf: 'stretch',
    margin: 10,
  },
});