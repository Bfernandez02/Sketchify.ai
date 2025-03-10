import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

export default function GalleryScreen() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const imageSize = (width - 48) / 2; // 2 columns with padding

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      
      const metadataPath = `${FileSystem.documentDirectory}gallery/metadata.json`;
      const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
      
      if (!metadataInfo.exists) {
        setGalleryItems([]);
        setLoading(false);
        return;
      }
      
      // Load gallery metadata
      const metadata = await FileSystem.readAsStringAsync(metadataPath, {
        encoding: FileSystem.EncodingType.UTF8
      });
      
      const parsedMetadata: GalleryMetadata = JSON.parse(metadata);
      
      // Sort by creation date (newest first)
      const sortedItems = [...parsedMetadata.items].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setGalleryItems(sortedItems);
    } catch (error) {
      console.error("Error loading gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderGalleryItem = ({ item }: { item: GalleryItem }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString();
    
    return (
      <TouchableOpacity 
        style={[styles.galleryItem, { width: imageSize, height: imageSize + 60 }]}
        onPress={() => {
          FileSystem.readAsStringAsync(item.filepath, {
            encoding: FileSystem.EncodingType.Base64
          }).then(imageData => {
            router.push({
              pathname: '/show-image',
              params: {
                imageData,
                promptText: item.prompt
              }
            });
          }).catch(error => {
            console.error("Error reading image:", error);
          });
        }}
      >
        <Image
          source={{ uri: `file://${item.filepath}` }}
          style={[styles.galleryImage, { width: imageSize - 16, height: imageSize - 16 }]}
          resizeMode="cover"
        />
        <Text style={styles.galleryItemDate}>{formattedDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>My Gallery</Text>
          <View style={{ width: 40 }} />
        </View>

        {galleryItems.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Your gallery is empty</Text>
            <Text style={styles.emptySubtext}>
              Enhanced sketches will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={galleryItems}
            renderItem={renderGalleryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.galleryList}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  galleryList: {
    padding: 16,
  },
  galleryItem: {
    margin: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryImage: {
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  galleryItemDate: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
});