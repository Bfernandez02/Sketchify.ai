import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  toolbar: {
    paddingTop: 15,
    paddingBottom: 60,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    zIndex: 100,
  },
  toolbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  toolbarLeft: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  toolbarCenter: {
    width: '40%',
    alignItems: 'center',
    paddingTop: 0,
  },
  toolbarRight: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  activeToolButton: {
    backgroundColor: 'rgba(0,122,255,0.2)',
  },
  enhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44, // Match the height of other circular buttons
    paddingHorizontal: 24,
    borderRadius: 22, // Half of the height for perfect circle ends
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  enhanceButtonLoading: {
    backgroundColor: '#0055B0',
  },
  enhanceButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  currentColorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  colorIndicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.3)',
  },
  currentColorText: {
    fontSize: 13,
  },
});