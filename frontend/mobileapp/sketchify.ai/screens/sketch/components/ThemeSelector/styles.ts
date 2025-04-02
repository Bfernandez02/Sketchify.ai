import {StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    height: 100,
    marginBottom: 10,
    marginTop: 10,
  },
  containerDark: {
    // Dark mode styles if needed
  },
  pagerView: {
    height: 80,
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCard: {
    width: width * 0.8,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  themeLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    margin: 4,
  },
  activePaginationDot: {
    backgroundColor: '#3498db',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});