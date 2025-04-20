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
    retryText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 14,
    },
    retryButton: {
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: '#3498db',
      borderRadius: 20,
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
    loader: {
      position: 'absolute',
      alignSelf: 'center',
      top: '50%',
      marginTop: -20,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#666',
      marginTop: 10,
    },
    errorSubtext: {
      fontSize: 12,
      color: '#999',
      marginTop: 5,
      textAlign: 'center',
    },
    drawingSection: {
      marginTop: 20,
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 10,
      alignSelf: 'flex-start',
      marginLeft: '5%',
    },
    drawingContainer: {
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    drawingImage: {
      borderRadius: 8,
    },
    themeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 5,
      marginLeft: '5%',
    },
    themeLabel: {
      fontSize: 14,
      color: '#666',
      marginRight: 8,
    },
    themeTag: {
      backgroundColor: '#e0f0ff',
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    themeTagText: {
      fontSize: 12,
      color: '#0066cc',
      fontWeight: '500',
    },
    page: {
      paddingBottom: 20,
      flex: 1,
      justifyContent:'flex-start',
      alignItems: 'center',
      paddingVertical: 20,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginVertical: 10,
    },
    pageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: '#F0F0F0',
    },
    activePageButton: {
      backgroundColor: '#3498db',
    },
    pageText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#666666',
      marginLeft: 4,
    },
    activePageText: {
      color: '#FFFFFF',
    },
    paginationDots: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#DDDDDD',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: '#3498db',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });