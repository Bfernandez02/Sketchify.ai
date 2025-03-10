import {StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    header: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#EEEEEE',
    },
    backButton: {
      padding: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      alignItems: 'center',
    },
    imageContainer: {
      marginVertical: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 8,
    },
    image: {
      borderRadius: 8,
      backgroundColor: '#F0F0F0',
    },
    promptContainer: {
      width: '100%',
      padding: 16,
      backgroundColor: '#F8F8F8',
      borderRadius: 12,
      marginVertical: 16,
    },
    promptTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333333',
    },
    promptText: {
      fontSize: 14,
      color: '#555555',
      lineHeight: 20,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
    },
    button: {
      backgroundColor: '#4A90E2',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },

    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    secondaryButton: {
      backgroundColor: '#F0F0F0',
    },
    secondaryButtonText: {
      color: '#4A90E2',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });