import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pagerView: {
    width: '100%',
    height: 150, // Defines the height constraint for the entire pager
  },
  pageContainer: {
    flex: 1, // Fills the pagerView
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCard: {
    width: width * 0.85, // 80% of screen width
    height: 150, // Explicit height for the container
    borderRadius: 12,
    overflow: 'hidden', // Clips the image to the card’s bounds
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeImage: {
    width: '100%', // 100% of themeCard’s width
    height: '100%', // 100% of themeCard’s height
    borderRadius: 12, // Matches themeCard’s borderRadius
    resizeMode: 'cover', // Ensures the image fills the space, cropping if needed
  },
  overlay: {
    width: '100%', // 100% of themeCard
    height: '100%', // 100% of themeCard
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    position: 'absolute', // Overlay needs absolute to layer over the image
  },
  themeLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    position: 'absolute', // Label needs absolute to layer over the image
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  activePaginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
});