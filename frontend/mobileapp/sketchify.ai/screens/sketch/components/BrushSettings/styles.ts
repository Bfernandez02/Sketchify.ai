import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50, // Higher than canvas but lower than panel
    backgroundColor: 'transparent',
  },
  brushSettingsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 100, // Higher than overlay
  },
  brushSettingsBlur: {
    padding: 15,
    borderRadius: 20,
  },
  brushSettingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  brushSettingsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  brushSizeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brushSizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  brushSizePreview: {
    alignItems: 'center',
  },
  brushSizeCircle: {
    borderRadius: 50,
    marginBottom: 5,
  },
  brushSizeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});