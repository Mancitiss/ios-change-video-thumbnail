import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import VideoPlayer from './video-player';

export default function App() {
  return (
    <View style={styles.container}>
      <VideoPlayer />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
