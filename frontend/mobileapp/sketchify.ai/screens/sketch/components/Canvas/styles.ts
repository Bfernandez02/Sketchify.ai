// src/screens/sketch/components/Canvas/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  canvasContainer: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: '75%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawingStatusContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  drawingStatus: {
    fontSize: 14,
    opacity: 0.7,
  },
});