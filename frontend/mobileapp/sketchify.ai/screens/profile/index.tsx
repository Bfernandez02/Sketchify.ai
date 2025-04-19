import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';



export default function ProfileScreen({ route }: { route?: { params?: { userId?: string } } }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBackgroundColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const accentColor = Colors[colorScheme ?? 'light'].tint;

  // Get the userId from route params or use current user
  const userId = route?.params?.userId;
  
  // Simple implementation to fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser && !userId) {
        throw new Error('Not authenticated');
      }
      
      const targetUserId = userId || currentUser?.uid;
      const isViewingOwnProfile = !userId || (currentUser && userId === currentUser.uid);
      setIsCurrentUser(isViewingOwnProfile);
      
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', targetUserId as string));
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data() as UserData;
      // Store both the document data and the document ID
      setUserData({
        ...userData,
        // We'll store the document ID separately for reference
        documentId: targetUserId
      });

      console.log("Fetched user data for ID:", targetUserId); 
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError((err as Error).message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Simple share functionality
  const handleShare = useCallback(async () => {
    if (!userData) return;
    
    try {
      await Share.share({
        message: `Check out ${userData.name}'s profile on SketchApp!`,
        url: `sketchapp://profile/${userData.documentId}`
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  }, [userData]);

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={{ marginTop: 12, color: textColor }}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={{ marginTop: 12, color: textColor, textAlign: 'center' }}>
          {error}
        </Text>
        <TouchableOpacity 
          style={{ 
            marginTop: 20, 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            backgroundColor: accentColor, 
            borderRadius: 8 
          }} 
          onPress={() => router.back()}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          {userData?.bannerImage ? (
            <Image 
              source={{ uri: userData.bannerImage }} 
              style={styles.bannerImage}
              resizeMode="cover" 
            />
          ) : (
            <View style={[styles.bannerImage, { backgroundColor: accentColor + '40' }]} />
          )}
          
          <View style={[styles.profileImageContainer, { borderColor: backgroundColor }]}>
            {userData?.profileImage ? (
              <Image 
                source={{ uri: userData.profileImage }} 
                style={styles.profileImage} 
                resizeMode="cover" 
              />
            ) : (
              <View style={[styles.profileImage, { 
                backgroundColor: accentColor,
                justifyContent: 'center',
                alignItems: 'center'
              }]}>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 36, 
                  fontWeight: 'bold' 
                }}>
                  {userData?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.profileInfoContainer}>
          <Text style={[styles.userName, { color: textColor }]}>
            {userData?.name || 'User'}
          </Text>
          
          <Text style={[styles.userEmail, { color: textColor + '99' }]}>
            {userData?.email || 'No email provided'}
          </Text>
          
          {userData?.bio && (
            <Text style={[styles.userBio, { color: textColor }]}>
              {userData.bio}
            </Text>
          )}
          
          <View style={[styles.statsContainer, { borderColor: dividerColor }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>
                {'-'}
              </Text>
              <Text style={[styles.statLabel, { color: textColor + '99' }]}>
                Sketches
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>
                {'-'}
              </Text>
              <Text style={[styles.statLabel, { color: textColor + '99' }]}>
                Posts
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: accentColor }]} 
              onPress={handleShare}
            >
              <Text style={styles.buttonText}>
                Share Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Account Activity
          </Text>
          
          <View style={[styles.activityCard, { backgroundColor: cardBackgroundColor }]}>
            {userData?.createdAt && (
              <View style={[styles.activityItem, { borderColor: dividerColor }]}>
                <View style={[styles.activityDot, { backgroundColor: accentColor }]} />
                <View>
                  <Text style={[styles.activityText, { color: textColor }]}>
                    <Text style={{ fontWeight: 'bold' }}>{userData.name}</Text> joined SketchApp
                  </Text>
                  <Text style={[styles.activityDate, { color: textColor + '80' }]}>
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}

            {userData?.updatedAt && userData.createdAt !== userData.updatedAt && (
              <View style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: accentColor }]} />
                <View>
                  <Text style={[styles.activityText, { color: textColor }]}>
                    <Text style={{ fontWeight: 'bold' }}>{userData.name}</Text> updated their profile
                  </Text>
                  <Text style={[styles.activityDate, { color: textColor + '80' }]}>
                    {new Date(userData.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {userData?.createdAt && (
            <Text style={[styles.joinDate, { color: textColor + '50' }]}>
              Joined {new Date(userData.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

