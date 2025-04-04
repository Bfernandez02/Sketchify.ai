import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { UserData } from '@/types/auth';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchUserData, handleShare, handleEditProfile, handleFollowUser } from './functions';
import { useNavigation } from '@react-navigation/native';
import { RecentSketches } from './components/RecentSketches';

// Core constants with integer values
const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const PROFILE_IMAGE_MAX_SIZE = 100;
const PROFILE_IMAGE_MIN_SIZE = 40;
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function ProfileScreen({ userId }: { userId?: string }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const scrollY = useSharedValue(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(true);
  
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBackgroundColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const accentColor = Colors[colorScheme ?? 'light'].tint;
  
  // Simplified scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Animated styles - consolidated and simplified
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP
    ),
    zIndex: scrollY.value > SCROLL_RANGE - 1 ? 1 : 0,
  }));
  
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
  
  const headerTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [SCROLL_RANGE - 20, SCROLL_RANGE],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));
  
  const bannerOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  // Configure the stack header
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitleStyle: { 
        opacity: 0 // Hide the default title
      },
      headerBackground: () => (
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'transparent'
          }}
        />
      ),
      // Right header button
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 16
          }}
          onPress={isCurrentUser ? handleEditProfile : () => handleShare(userData)}
        >
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <IconSymbol
              size={20}
              name={isCurrentUser ? "pencil" : "square.and.arrow.up"}
              color={textColor}
            />
          </BlurView>
        </TouchableOpacity>
      )
    });
  }, [navigation, userData, isCurrentUser, isDark, textColor]);

  useEffect(() => {
    // Use the imported function
    fetchUserData(
      userId, 
      setLoading, 
      setIsCurrentUser, 
      setUserData, 
      () => {}, // We're not using this setSketches anymore
      setError
    );
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={{ marginTop: 12, color: textColor }}>Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <IconSymbol size={50} name="exclamationmark.circle" color={textColor} />
        <Text style={{ marginTop: 12, color: textColor, textAlign: 'center' }}>{error}</Text>
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
    <View style={{ flex: 1, backgroundColor }}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          { 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            backgroundColor: 'transparent',
            overflow: 'hidden',
            marginTop: insets.top + 44 // Adjust for the stack header
          }, 
          headerAnimatedStyle
        ]}
      >
        {/* Banner Image with Gradient */}
        <Animated.View style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
          bannerOpacityStyle
        ]}>
          {userData?.bannerImage ? (
            <Image
              source={{ uri: userData.bannerImage }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: '100%', height: '100%', backgroundColor: accentColor + '40' }} />
          )}
          
          <LinearGradient
            colors={['transparent', isDark ? 'rgba(18,18,18,0.8)' : 'rgba(249,249,249,0.8)']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
          />
        </Animated.View>
        
        {/* Custom Header Title (visible on scroll) */}
        <Animated.View
          style={[
            { 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              paddingTop: 10,
              height: HEADER_MIN_HEIGHT,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent'
            }
          ]}
        >
          <Animated.Text
            style={[
              { 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: textColor 
              }, 
              headerTitleStyle
            ]}
            numberOfLines={1}
          >
            {userData?.name}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
      
      {/* Profile Image */}
      <Animated.View 
        style={[
          {
            position: 'absolute',
            left: 20,
            top: 44 + insets.top, // Adjust for the stack header
            borderRadius: PROFILE_IMAGE_MAX_SIZE / 2,
            borderWidth: 4,
            borderColor: backgroundColor,
            overflow: 'hidden',
            zIndex: 10
          },
          profileImageAnimatedStyle
        ]}
      >
        {userData?.profileImage ? (
          <Image
            source={{ uri: userData.profileImage }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: accentColor,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              {userData?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        contentContainerStyle={{ 
          paddingTop: HEADER_MAX_HEIGHT + 60 + insets.top + 44, // Adjust for the stack header
          paddingBottom: 30 
        }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor }}>
            {userData?.name || 'User'}
          </Text>
          
          <Text style={{ fontSize: 16, color: textColor + '99', marginTop: 4 }}>
            {userData?.email || 'No email provided'}
          </Text>
          
          {userData?.bio ? (
            <Text style={{ 
              fontSize: 16, 
              color: textColor, 
              marginTop: 12,
              lineHeight: 22
            }}>
              {userData.bio}
            </Text>
          ) : null}
          
          {/* Stats Row */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            marginTop: 24,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: dividerColor
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>
                {/* This will be updated by the RecentSketches component */}
                -
              </Text>
              <Text style={{ fontSize: 14, color: textColor + '99', marginTop: 4 }}>
                Sketches
              </Text>
            </View>
            
            <View style={{ width: 1, height: '80%', backgroundColor: dividerColor }} />
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>
                {Math.floor(Math.random() * 500)}
              </Text>
              <Text style={{ fontSize: 14, color: textColor + '99', marginTop: 4 }}>
                Followers
              </Text>
            </View>
            
            <View style={{ width: 1, height: '80%', backgroundColor: dividerColor }} />
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>
                {Math.floor(Math.random() * 200)}
              </Text>
              <Text style={{ fontSize: 14, color: textColor + '99', marginTop: 4 }}>
                Following
              </Text>
            </View>
          </View>
          
          {/* Action Button */}
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: accentColor,
              borderRadius: 12,
              paddingVertical: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={isCurrentUser ? handleEditProfile : handleFollowUser}
          >
            <IconSymbol 
              size={18} 
              name={isCurrentUser ? "pencil" : "person.badge.plus"} 
              color="#FFFFFF" 
            />
            <Text style={{ 
              marginLeft: 8, 
              color: '#FFFFFF', 
              fontWeight: '600',
              fontSize: 16
            }}>
              {isCurrentUser ? "Edit Profile" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Sketches - using the modular component */}
        {userData?.uid && (
          <RecentSketches
            userId={userData.uid}
            isCurrentUser={isCurrentUser}
            textColor={textColor}
            accentColor={accentColor}
            cardBackgroundColor={cardBackgroundColor}
            maxSketches={6}
          />
        )}
        
        {/* Activity Section - simplified */}
        <View>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: textColor,
            paddingHorizontal: 20, 
            marginBottom: 16 
          }}>
            Recent Activity
          </Text>
          
          <View style={{
            margin: 16,
            backgroundColor: cardBackgroundColor,
            borderRadius: 12,
            overflow: 'hidden'
          }}>
            {/* Activity items - simplified */}
            <View style={{ padding: 16, borderBottomWidth: 1, borderColor: dividerColor }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: 5, 
                  backgroundColor: accentColor,
                  marginRight: 12 
                }} />
                <View>
                  <Text style={{ fontSize: 16, color: textColor }}>
                    <Text style={{ fontWeight: 'bold' }}>{userData?.name}</Text> created a new sketch
                  </Text>
                  <Text style={{ fontSize: 14, color: textColor + '80', marginTop: 4 }}>
                    {new Date(Date.now() - 86400000 * 2).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={{ padding: 16, borderBottomWidth: 1, borderColor: dividerColor }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: 5, 
                  backgroundColor: accentColor,
                  marginRight: 12 
                }} />
                <View>
                  <Text style={{ fontSize: 16, color: textColor }}>
                    <Text style={{ fontWeight: 'bold' }}>{userData?.name}</Text> updated their profile
                  </Text>
                  <Text style={{ fontSize: 14, color: textColor + '80', marginTop: 4 }}>
                    {new Date(Date.now() - 86400000 * 5).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: 5, 
                  backgroundColor: accentColor,
                  marginRight: 12 
                }} />
                <View>
                  <Text style={{ fontSize: 16, color: textColor }}>
                    <Text style={{ fontWeight: 'bold' }}>{userData?.name}</Text> joined SketchApp
                  </Text>
                  <Text style={{ fontSize: 14, color: textColor + '80', marginTop: 4 }}>
                    {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Footer */}
          <Text style={{ 
            textAlign: 'center', 
            fontSize: 14, 
            color: textColor + '50',
            marginTop: 20,
            marginBottom: 8
          }}>
            {userData?.name}'s Profile • Joined {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}