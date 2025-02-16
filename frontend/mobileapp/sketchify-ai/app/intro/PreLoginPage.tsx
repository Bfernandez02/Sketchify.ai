import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform
} from 'react-native';
import { styles } from './styles';

const { width } = Dimensions.get('window');

export default function PreLoginPage() {
  const FeaturedArtwork = () => (
    <View style={styles.featuredContainer}>
      <Image
        source={require('@assets/images/brushes.png')}
        style={styles.brushesImage}
        resizeMode="contain"
      />
      <View style={styles.galleryContainer}>
        <View style={styles.galleryRow}>
          <Image
            source={require('@assets/images/abstract.jpg')}
            style={[styles.galleryImage, { width: width * 0.44 }]}
          />
          <Image
            source={require('@assets/images/cake.jpg')}
            style={[styles.galleryImage, { width: width * 0.44 }]}
          />
        </View>
        <Image
          source={require('@assets/images/forest.jpg')}
          style={[styles.galleryImage, { width: width * 0.9 }]}
        />
        <View style={styles.galleryRow}>
          <Image
            source={require('@assets/images/astro.jpg')}
            style={[styles.galleryImage, { width: width * 0.44 }]}
          />
          <Image
            source={require('@assets/images/bunny.jpg')}
            style={[styles.galleryImage, { width: width * 0.44 }]}
          />
        </View>
      </View>
    </View>
  );

  const renderAuthButton = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity style={[styles.button, styles.appleButton]}>
          <Text style={styles.buttonText}>Sign in with Apple</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={[styles.button, styles.googleButton]}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.mainTitle}>
            From Sketch{'\n'}to Stunning{'\n'}– Powered by AI.
          </Text>
          <Text style={styles.subtitle}>
            Start sketching and bring your ideas to life!{'\n'}
            Let your creativity flow and see where it takes you!
          </Text>
          <View style={styles.buttonContainer}>
            {renderAuthButton()}
          </View>
        </View>
        <FeaturedArtwork />
        <TouchableOpacity style={[styles.button, styles.exploreButton, styles.bottomButton]}>
          <Text style={styles.buttonText}>Explore</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}