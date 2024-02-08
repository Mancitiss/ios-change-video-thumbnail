import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Button, Text } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function VideoPlayer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoSource, setVideoSource] = useState(null);
  const [buttonText, setButtonText] = useState('Play');
  const [frameRate, setFrameRate] = useState(0);

  const videoPlayer = useRef(null);
  const playButton = useRef(null);

  const formatTime = (timeInMillis) => {
    let totalSeconds = timeInMillis / 1000;
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    let seconds = totalSeconds - (hours * 3600 + minutes * 60);
    let milliseconds = (seconds - Math.floor(seconds)) * 1000;

    return `${hours.toFixed(0)}:${minutes.toFixed(0)}:${seconds.toFixed(0)}:${milliseconds.toFixed(0)}`;
  };

  const onLoad = (status) => {
    setDuration(status.durationMillis);
  };

  const onProgress = (status) => {
    if (status.isPlaying) {
      setCurrentTime(status.positionMillis);
    }
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
      // GET FRAME RATE
      
      setVideoSource(result.assets.at(0).uri);
    }
  };

  const playOrStop = () => {
    if (videoSource) {
      if (videoPlayer.current != null) {
        if (buttonText === 'Pause') {
          videoPlayer.current.pauseAsync().then(() => {
            setButtonText('Play');
          });
        } else {
          videoPlayer.current.playAsync().then(() => {
            setButtonText('Pause');
          });
        }
      }
    }
  }

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
      <Text>{formatTime(currentTime)}</Text>
      <Slider
        style={styles.slider}
        maximumValue={duration}
        value={currentTime}
        onSlidingComplete={onSlide}
      />
      <View>
        <Button ref={playButton} title="Play" onPress={() => playOrStop()} />
      </View>
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