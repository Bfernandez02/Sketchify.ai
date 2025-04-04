import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  canvasOuterContainer: {
    width: '100%',
    alignItems: 'center',
  },
  canvasContainer: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  canvas: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
  },
  drawingStatusContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  drawingStatus: {
    fontSize: 14,
    fontFamily: 'System', 
    opacity: 0.8,
  },
});