import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
    backgroundColor: 'transparent',
  },
  expandedTools: {
    overflow: 'hidden',
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 100, 
  },
  colorPickerContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  colorButtonLarge: {
    width: width / 6 - 16,
    height: width / 6 - 16,
    borderRadius: (width / 6 - 16) / 2,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  selectedColorLarge: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  colorCheckmark: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});