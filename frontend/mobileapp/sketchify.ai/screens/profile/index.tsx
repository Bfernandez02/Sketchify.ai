import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Share,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase/config';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { UserData } from '@/types/auth';
import { styles } from './styles';

const { width } = Dimensions.get('window');

// Define constants with integer values to avoid floating point issues
const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const PROFILE_IMAGE_MAX_SIZE = 100;
const PROFILE_IMAGE_MIN_SIZE = 40;
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function ProfileScreen({ userId }: { userId?: string }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const scrollY = useSharedValue(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sketches, setSketches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBackgroundColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const accentColor = Colors[colorScheme ?? 'light'].tint;
  
  // Handle scroll events with Reanimated 2
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Animated styles using Reanimated 2 - avoids precision issues
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP
    );
    
    return {
      height,
      zIndex: scrollY.value > SCROLL_RANGE - 1 ? 1 : 0,
      elevation: scrollY.value > SCROLL_RANGE - 1 ? 1 : 0,
    };
  });
  
  const profileImageAnimatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [PROFILE_IMAGE_MAX_SIZE, PROFILE_IMAGE_MIN_SIZE],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_SIZE / 2, HEADER_MIN_HEIGHT - PROFILE_IMAGE_MIN_SIZE / 2],
      Extrapolate.CLAMP
    );
    
    return {
      width: size,
      height: size,
      transform: [{ translateY }],
    };
  });
  
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_RANGE - 20, SCROLL_RANGE],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });
  
  const bannerOpacityAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        // Determine if we're viewing our own profile or someone else's
        const targetUserId = userId || (currentUser ? currentUser.uid : null);
        setIsCurrentUser(!userId || (currentUser && userId === currentUser.uid));
        if (!targetUserId) {
          throw new Error('No user to display');
        }
        
        // Fetch user data
        const userRef = doc(db, "users", targetUserId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data() as UserData;
          setUserData(data);
        } else {
          throw new Error('User data not found');
        }
        
        // Fetch user's sketches
        const sketchesQuery = query(
          collection(db, "sketches"),
          where("userId", "==", targetUserId),
          limit(6)
        );
        
        const sketchesSnapshot = await getDocs(sketchesQuery);
        const sketchesData: any[] = [];
        sketchesSnapshot.forEach((doc) => {
          sketchesData.push({ id: doc.id, ...doc.data() });
        });
        
        setSketches(sketchesData);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  const handleShare = async () => {
    if (!userData) return;
    
    try {
      await Share.share({
        message: `Check out ${userData.name}'s profile on SketchApp!`,
        url: `https://yourapp.com/profile/${userData.uid}`,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleFollowUser = () => {
    Alert.alert("Success", "You are now following this user");
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.errorContainer}>
          <IconSymbol size={50} name="exclamationmark.circle" color={textColor} />
          <Text style={[styles.errorText, { color: textColor }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accentColor }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        {/* Banner Image with Gradient Overlay */}
        <Animated.View style={[styles.bannerContainer, bannerOpacityAnimatedStyle]}>
          {userData?.bannerImage ? (
            <Image
              source={{ uri: userData.bannerImage }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.bannerImage, { backgroundColor: accentColor + '40' }]} />
          )}
          
          <LinearGradient
            colors={['transparent', isDark ? 'rgba(18,18,18,0.8)' : 'rgba(249,249,249,0.8)']}
            style={styles.bannerGradient}
          />
        </Animated.View>
        
        {/* Header Bar (visible when scrolled) */}
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={100}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.headerBar, { paddingTop: insets.top }]}
          >
            <Animated.Text
              style={[styles.headerTitle, headerTitleAnimatedStyle, { color: textColor }]}
              numberOfLines={1}
            >
              {userData?.name}
            </Animated.Text>
          </BlurView>
        ) : (
          <Animated.View
            style={[
              styles.headerBar,
              { backgroundColor: backgroundColor + 'F0', paddingTop: insets.top },
            ]}
          >
            <Animated.Text
              style={[styles.headerTitle, headerTitleAnimatedStyle, { color: textColor }]}
              numberOfLines={1}
            >
              {userData?.name}
            </Animated.Text>
          </Animated.View>
        )}
        
        {/* Action Button (Share or Edit) */}
        <TouchableOpacity
          style={[styles.actionButton, { top: insets.top + 10 }]}
          onPress={isCurrentUser ? handleEditProfile : handleShare}
        >
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.blurButton}
          >
            <IconSymbol
              size={20}
              name={isCurrentUser ? "pencil" : "square.and.arrow.up"}
              color={textColor}
            />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Profile Image */}
      <Animated.View style={[styles.profileImageContainer, profileImageAnimatedStyle]}>
        {userData?.profileImage ? (
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.profileImagePlaceholder, { backgroundColor: accentColor }]}>
            <Text style={styles.profileImagePlaceholderText}>
              {userData?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        contentContainerStyle={[styles.scrollViewContent, { paddingTop: HEADER_MAX_HEIGHT + 60 }]}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.userInfoSection}>
          <Text style={[styles.userName, { color: textColor }]}>
            {userData?.name || 'User'}
          </Text>
          
          <Text style={[styles.userEmail, { color: textColor + '99' }]}>
            {userData?.email || 'No email provided'}
          </Text>
          
          {userData?.bio ? (
            <Text style={[styles.userBio, { color: textColor }]}>
              {userData.bio}
            </Text>
          ) : null}
          
          {/* Stats Row */}
          <View style={[styles.statsRow, { borderColor: dividerColor }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>
                {sketches.length}
              </Text>
              <Text style={[styles.statLabel, { color: textColor + '99' }]}>
                Sketches
              </Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: dividerColor }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>
                {Math.floor(Math.random() * 500)}
              </Text>
              <Text style={[styles.statLabel, { color: textColor + '99' }]}>
                Followers
              </Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: dividerColor }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>
                {Math.floor(Math.random() * 200)}
              </Text>
              <Text style={[styles.statLabel, { color: textColor + '99' }]}>
                Following
              </Text>
            </View>
          </View>
          
          {/* Action Button (Follow or Edit) */}
          {isCurrentUser ? (
            <TouchableOpacity
              style={[styles.editProfileButton, { backgroundColor: accentColor }]}
              onPress={handleEditProfile}
            >
              <IconSymbol size={18} name="pencil" color="#FFFFFF" />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.followButton, { backgroundColor: accentColor }]}
              onPress={handleFollowUser}
            >
              <IconSymbol size={18} name="person.badge.plus" color="#FFFFFF" />
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Recent Sketches */}
        <View style={styles.sketchesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Recent Sketches
            </Text>
            
            {sketches.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push(`/user/${userData?.uid}/sketches`)}
              >
                <Text style={[styles.seeAllText, { color: accentColor }]}>
                  See All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {sketches.length > 0 ? (
            <View style={styles.sketchesGrid}>
              {sketches.map((sketch) => (
                <TouchableOpacity
                  key={sketch.id}
                  style={[styles.sketchCard, { backgroundColor: cardBackgroundColor }]}
                  onPress={() => router.push(`/sketch/${sketch.id}`)}
                >
                  <Image
                    source={{ uri: sketch.imageUrl }}
                    style={styles.sketchImage}
                    resizeMode="cover"
                  />
                  <View style={styles.sketchInfo}>
                    <Text
                      style={[styles.sketchTitle, { color: textColor }]}
                      numberOfLines={1}
                    >
                      {sketch.title || 'Untitled'}
                    </Text>
                    <Text
                      style={[styles.sketchDate, { color: textColor + '80' }]}
                    >
                      {new Date(sketch.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyStateContainer, { backgroundColor: cardBackgroundColor }]}>
              <IconSymbol
                size={48}
                name="pencil.tip"
                color={textColor + '50'}
              />
              <Text style={[styles.emptyStateText, { color: textColor + '99' }]}>
                No sketches yet
              </Text>
              {isCurrentUser && (
                <TouchableOpacity
                  style={[styles.createButton, { backgroundColor: accentColor }]}
                  onPress={() => router.push('/sketch')}
                >
                  <Text style={styles.createButtonText}>Create a Sketch</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        {/* Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Recent Activity
            </Text>
          </View>
          
          {/* Activity Timeline (Simulated) */}
          <View style={[styles.timelineContainer, { backgroundColor: cardBackgroundColor }]}>
            {/* Activity Item */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: accentColor }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineText, { color: textColor }]}>
                  <Text style={{ fontWeight: 'bold' }}>{userData?.name}</Text> created a new sketch
                </Text>
                <Text style={[styles.timelineDate, { color: textColor + '80' }]}>
                  {new Date(Date.now() - 86400000 * 2).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            {/* Activity Item */}
            <View style={[styles.timelineItem, { borderColor: dividerColor }]}>
              <View style={[styles.timelineDot, { backgroundColor: accentColor }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineText, { color: textColor }]}>
                  <Text style={{ fontWeight: 'bold' }}>{userData?.name}</Text> updated their profile
                </Text>
                <Text style={[styles.timelineDate, { color: textColor + '80' }]}>
                  {new Date(Date.now() - 86400000 * 5).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            {/* Activity Item */}
            <View style={[styles.timelineItem, { borderColor: dividerColor }]}>
              <View style={[styles.timelineDot, { backgroundColor: accentColor }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineText, { color: textColor }]}>
                  <Text style={{ fontWeight: 'bold' }}>{userData?.name}</Text> joined SketchApp
                </Text>
                <Text style={[styles.timelineDate, { color: textColor + '80' }]}>
                  {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Footer Space */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textColor + '50' }]}>
            {userData?.name}'s Profile • Joined {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
