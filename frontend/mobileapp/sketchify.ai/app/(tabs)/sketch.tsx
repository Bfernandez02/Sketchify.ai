import React from 'react';
import SketchScreen from '@/screens/sketch';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // Ensure this is installed
import Animated, { FadeIn } from 'react-native-reanimated'; // For animations

export default function Sketch() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          header: () => (
            <Animated.View entering={FadeIn.duration(400)} style={styles.headerOuterContainer}>
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(30, 30, 30, 0.95)', 'rgba(44, 44, 46, 0.9)']
                    : ['rgba(230, 240, 250, 0.95)', 'rgba(249, 249, 249, 0.9)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerContainer}
              >
                <Text
                  style={[
                    styles.headerTitle,
                    { color: isDark ? '#E0E0E0' : '#1A1A1A' },
                  ]}
                >
                  SketchPad
                </Text>
                {/* <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => {}}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="save-outline"
                      size={26}
                      color={isDark ? '#B0B0B0' : '#555555'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => {}}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="share-outline"
                      size={26}
                      color={isDark ? '#B0B0B0' : '#555555'}
                    />
                  </TouchableOpacity>
                </View> */}
              </LinearGradient>
            </Animated.View>
          ),
        }}
      />
      <SketchScreen />
    </>
  );
}

const styles = StyleSheet.create({
  headerOuterContainer: {
    overflow: 'hidden', // Ensures shadow doesn't bleed
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 44, // Adjusted for status bar
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System', // Replace with 'Inter', 'Poppins', etc., if available
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle button background
    marginLeft: 8,
  },
});