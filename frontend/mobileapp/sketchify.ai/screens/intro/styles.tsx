import {
    StyleSheet,
    Dimensions,
  } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContent: {
      flexGrow: 1,
    },

    heroSection: {
      padding: 24,
      alignItems: 'center',
    },
    mainTitle: {
      fontSize: 40,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: 'column',
      gap: 12,
      width: '100%',
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 20,
      alignItems: 'center',
      width: '100%',
    },
    exploreButton: {
      backgroundColor: '#6C63FF', // secondary color
    },
    sketchButton: {
      backgroundColor: '#FF6B6B', // primary color
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    featuredContainer: {
      marginTop: 24,
    },
    brushesImage: {
      width: width * 0.75,
      height: 120,
      alignSelf: 'center',
      marginBottom: 24,
    },
    galleryContainer: {
      backgroundColor: '#FF6B6B',
      padding: 16,
      gap: 8,
    },
    galleryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    galleryImage: {
      height: 156,
      borderRadius: 20,
    },
    appleButton: {
      backgroundColor: '#000',
      width: '100%',
    },
    googleButton: {
      backgroundColor: '#4285F4',
      width: '100%',
    },
    bottomButton: {
      marginTop: 20,
      marginBottom: 30,
      width: '90%',
      alignSelf: 'center',
    }
  });