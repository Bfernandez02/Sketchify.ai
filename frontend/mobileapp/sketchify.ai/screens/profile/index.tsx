import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  StyleSheet,
  ScrollView,
  Animated
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { UserData } from '@/types/auth';
import { SketchPost } from '@/types/sketch';
import { styles } from './styles';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function ProfileScreen({ route }: { route?: { params?: { userId?: string } } }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [userData, setUserData] = useState<UserData & { documentId: string } | null>(null);
  const [userPosts, setUserPosts] = useState<SketchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [activePage, setActivePage] = useState(0);
  
  const pagerRef = useRef<PagerView>(null);

  // Theme settings
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBackgroundColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const accentColor = Colors[colorScheme ?? 'light'].tint;

  // Get the userId from route params or use current user
  const userId = route?.params?.userId;
  
  // Fetch user posts (limited to 10 most recent)
  const fetchUserPosts = useCallback(async (userId: string) => {
    try {
      const db = getFirestore();
      const postsRef = collection(db, 'users', userId, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const posts: SketchPost[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          title: data.title || '',
          prompt: data.prompt || '',
          theme: data.theme || '',
          createdAt: data.createdAt instanceof Date 
            ? data.createdAt 
            : (data.createdAt?.toDate ? data.createdAt.toDate() : new Date()),
          drawing: data.drawing || '',
          image: data.image || ''
        });
      });
      
      setUserPosts(posts);
      console.log(`Fetched ${posts.length} posts for user: ${userId}`);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  }, []);

  // Fetch user data
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
      
      setUserData({
        ...userData,
        documentId: targetUserId
      });

      console.log("Fetched user data for ID:", targetUserId);
      
      // Fetch user posts
      await fetchUserPosts(targetUserId as string);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError((err as Error).message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserPosts]);
  
  // Share profile
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

  // Handle page change in the carousel
  const handlePageChange = (event: any) => {
    const newPage = event.nativeEvent.position;
    setActivePage(newPage);
  };

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignSelf:'center' }]}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={{ marginTop: 12, color: textColor }}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
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
        {/* Profile Header */}
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
        
        {/* Profile Info */}
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
                {userPosts.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: textColor + '99' }]}>
                Sketches
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>
                {userData?.savedPosts?.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: textColor + '99' }]}>
                Saved Posts
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

        {userPosts.length > 0 && (
          <View style={styles.sketchesContainer}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Recent Sketches
            </Text>
            
            <View style={styles.carouselContainer}>
              <AnimatedPagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                orientation='horizontal'
                onPageSelected={handlePageChange}
              >
                {userPosts.slice(0, 10).map((post) => (
                  <View key={post.id} style={styles.pageContainer}>
                    <TouchableOpacity
                      style={[styles.postItem, { backgroundColor: cardBackgroundColor }]}
                      onPress={() => router.push({
                        pathname: '/show-image',
                        params: {
                          imageUrl: post.image,
                          drawingUrl: post.drawing,
                          promptText: post.prompt,
                          title: post.title,
                          theme: post.theme
                        }
                      })}
                    >
                      <Image
                        source={{ uri: post.image || post.drawing }}
                        style={styles.postImage}
                        resizeMode="cover"
                      />
                      <View style={styles.postInfo}>
                        <Text style={[styles.postTitle, { color: textColor }]} numberOfLines={1}>
                          {post.title || 'Untitled Sketch'}
                        </Text>
                        <Text style={[styles.postDate, { color: textColor + '80' }]}>
                          {post.createdAt.toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </AnimatedPagerView>
              
              {/* Pagination dots */}
              <View style={styles.paginationContainer}>
                {userPosts.slice(0, 10).map((post, index) => (
                  <TouchableOpacity
                    key={post.id}
                    style={[
                      styles.paginationDot,
                      activePage === index && styles.activePaginationDot,
                    ]}
                    onPress={() => {
                      pagerRef.current?.setPage(index);
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Activity Section */}
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
