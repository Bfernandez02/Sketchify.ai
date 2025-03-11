import React from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function ShowImageScreen() {
  const { imageData, promptText } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const imageWidth = width * 0.9;
  const imageHeight = imageWidth;

  const handleBack = () => {
    router.back();
  };

  const handleViewGallery = () => {
    router.push('/(tabs)/gallery');
  };

  const handleNewSketch = () => {
    router.push('/(tabs)/sketch');
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
          <Text style={styles.title}>Generated Image</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            {imageData && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${imageData}` }}
                style={[styles.image, { width: imageWidth, height: imageHeight }]}
                resizeMode="contain"
              />
            )}
          </View>
          
          {/* <View style={styles.promptContainer}>
            <Text style={styles.promptTitle}>AI Interpretation</Text>
            <Text style={styles.promptText}>{promptText as string}</Text>
          </View> */}
        </ScrollView>

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

