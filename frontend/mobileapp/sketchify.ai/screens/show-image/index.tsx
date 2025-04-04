import React, { useState, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PagerView from 'react-native-pager-view';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { styles } from './styles';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function ShowImageScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [enhancedLoading, setEnhancedLoading] = useState(true);
  const [originalLoading, setOriginalLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Start on AI image
  const pagerRef = useRef<PagerView>(null);

  const imageWidth = width * 0.9;
  const imageHeight = imageWidth;

  // Extract the parameters
  const { imageUrl, drawingUrl, promptText, title, theme } = params;

  // Function to properly encode Firebase Storage URLs
  function fixFirebaseStorageUrl(url: string): string {
    try {
      const regex = /\/o\/([^?]+)/;
      const match = url.match(regex);
      if (match && match[1]) {
        const path = match[1];
        const encodedPathWithSlashes = path.split('/').map(segment => encodeURIComponent(segment)).join('%2F');
        return url.replace(path, encodedPathWithSlashes);
      }
      return url;
    } catch (e) {
      console.error("URL encoding error:", e);
      return url;
    }
  }

  // Properly encode the URLs
  const encodedImageUrl = imageUrl ? fixFirebaseStorageUrl(imageUrl as string) : null;
  const encodedDrawingUrl = drawingUrl ? fixFirebaseStorageUrl(drawingUrl as string) : null;

  const handleBack = () => {
    router.back();
  };

  const handleViewGallery = () => {
    router.push('/(tabs)/gallery');
  };

  const handleNewSketch = () => {
    router.push('/(tabs)/sketch');
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.nativeEvent.position);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#F9F9F9', '#FFFFFF']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>{title || "Generated Image"}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Custom pagination indicator */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[
              styles.pageButton, 
              currentPage === 0 && styles.activePageButton
            ]}
            onPress={() => pagerRef.current?.setPage(0)}
          >
            <Ionicons 
              name="pencil-outline" 
              size={16} 
              color={currentPage === 0 ? "#FFFFFF" : "#666666"} 
            />
            <Text 
              style={[
                styles.pageText, 
                currentPage === 0 && styles.activePageText
              ]}
            >
              Original
            </Text>
          </TouchableOpacity>
          
          <View style={styles.paginationDots}>
            <View 
              style={[
                styles.paginationDot, 
                currentPage === 0 && styles.activeDot
              ]} 
            />
            <View 
              style={[
                styles.paginationDot, 
                currentPage === 1 && styles.activeDot
              ]} 
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.pageButton, 
              currentPage === 1 && styles.activePageButton
            ]}
            onPress={() => pagerRef.current?.setPage(1)}
          >
            <Ionicons 
              name="image-outline" 
              size={16} 
              color={currentPage === 1 ? "#FFFFFF" : "#666666"} 
            />
            <Text 
              style={[
                styles.pageText, 
                currentPage === 1 && styles.activePageText
              ]}
            >
              Enhanced
            </Text>
          </TouchableOpacity>
        </View>

        {/* ViewPager for carousel effect */}
        <AnimatedPagerView
          ref={pagerRef}
          style={styles.content}
          initialPage={1} // Start on AI image (right page)
          orientation="horizontal"
          onPageSelected={handlePageChange}
          // transitionStyle="scroll" // Smooth scrolling transition
        >
          <View key="0" style={styles.page}>
            (
              <View style={[styles.drawingContainer, { width: imageWidth, height: imageWidth * 0.7 }]}>
                {originalLoading && (
                  <ActivityIndicator size="small" color="#666" style={styles.loader} />
                )}
                <Image
                  source={{ uri: encodedDrawingUrl }}
                  style={[styles.drawingImage, { width: imageWidth * 0.9, height: imageWidth * 0.6 }]}
                  resizeMode="contain"
                  onLoadStart={() => setOriginalLoading(true)}
                  onLoad={() => console.log("Original drawing loaded successfully")}
                  onLoadEnd={() => setOriginalLoading(false)}
                  onError={(e) => {
                    console.error("Original drawing load error:", e.nativeEvent.error);
                    setOriginalLoading(false);
                  }}
                />
              </View>
            )
            <Text style={styles.sectionTitle}>Original Sketch</Text>
          </View>

          {/* Page 1: AI-Generated Image */}
          <View key="1" style={styles.page}>
            {encodedImageUrl ? (
              <View style={styles.imageContainer}>
                {enhancedLoading && (
                  <ActivityIndicator size="large" color="#666" style={styles.loader} />
                )}
                <Image
                  source={{ uri: encodedImageUrl }}
                  style={[styles.image, { width: imageWidth, height: imageHeight }]}
                  resizeMode="contain"
                  onLoadStart={() => setEnhancedLoading(true)}
                  onLoad={() => console.log("Enhanced image loaded successfully")}
                  onLoadEnd={() => setEnhancedLoading(false)}
                  onError={(e) => {
                    console.error("Enhanced image load error:", e.nativeEvent.error);
                    setEnhancedLoading(false);
                  }}
                />
              </View>
            ) : (
              <View style={styles.noImageContainer}>
                <Ionicons name="image-outline" size={48} color="#CCCCCC" />
                <Text style={styles.noImageText}>No image available</Text>
              </View>
            )}
            {/* Prompt and Theme below AI image */}
            {promptText && (
              <View style={styles.promptContainer}>
                <Text style={styles.promptTitle}>AI Interpretation</Text>
                <Text style={styles.promptText}>{promptText as string}</Text>
              </View>
            )}
            {theme && (
              <View style={styles.themeContainer}>
                <Text style={styles.themeLabel}>Style:</Text>
                <View style={styles.themeTag}>
                  <Text style={styles.themeTagText}>{theme as string}</Text>
                </View>
              </View>
            )}
          </View>
        </AnimatedPagerView>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleNewSketch}
            >
              <Text style={styles.secondaryButtonText}>New Sketch</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleViewGallery}
            >
              <Text style={styles.buttonText}>View Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
