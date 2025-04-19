import { 
    StyleSheet,
    Dimensions
  } from 'react-native';

  const { width } = Dimensions.get('window');
  


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    headerContainer: {
      position: 'relative',
      height: 200,
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    profileImageContainer: {
      position: 'absolute',
      bottom: -50,
      left: 20,
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      overflow: 'hidden',
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    profileInfoContainer: {
      marginTop: 60,
      paddingHorizontal: 20,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    userEmail: {
      fontSize: 16,
      marginTop: 4,
    },
    userBio: {
      fontSize: 16,
      marginTop: 12,
      lineHeight: 22,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 24,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    statLabel: {
      fontSize: 14,
      marginTop: 4,
    },
    divider: {
      width: 1,
      height: '80%',
    },
    buttonContainer: {
      marginTop: 20,
    },
    button: {
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
    },
    activityContainer: {
      marginTop: 30,
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    activityCard: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    activityItem: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
    },
    activityDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 12,
    },
    activityText: {
      fontSize: 16,
    },
    activityDate: {
      fontSize: 14,
      marginTop: 4,
    },
    joinDate: {
      textAlign: 'center',
      fontSize: 14,
      marginTop: 20,
    },
  });