import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  FlatList, 
  Image, 
  Text, 
  TouchableOpacity, 
   Dimensions, 
   ActivityIndicator,
   RefreshControl
   } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { styles } from './styles';

export default function GalleryScreen() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const imageSize = (width - 48) / 2; 

  useEffect(() => {
    loadGalleryItems();
    
    const unsubscribe = setupFirestoreListener();
    
    return () => {
      unsubscribe();
    };
  }, []);

  const setupFirestoreListener = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      setLoading(false);
      return () => {};
    }
    
    const userId = currentUser.uid;
    const db = getFirestore();
    const postsRef = collection(db, `users/${userId}/posts`);
    const q = query(postsRef, orderBy("createdAt", "desc"));
    
    return onSnapshot(q, (snapshot) => {
      const items: GalleryItem[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          prompt: data.prompt,
          theme: data.theme,
          createdAt: data.createdAt.toDate().toISOString(),
          imageUrl: data.image,
          drawingUrl: data.drawing
        };
      });
      
      setGalleryItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error setting up Firestore listener:", error);
      setLoading(false);
    });
  };

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setGalleryItems([]);
        setLoading(false);
        return;
      }
      
      const userId = currentUser.uid;
      const db = getFirestore();
      const postsRef = collection(db, `users/${userId}/posts`);
      const q = query(postsRef, orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      
      const items: GalleryItem[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          prompt: data.prompt,
          theme: data.theme,
          createdAt: data.createdAt.toDate().toISOString(),
          imageUrl: data.image,
          drawingUrl: data.drawing
        };
      });
      
      setGalleryItems(items);
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
        style={[styles.galleryItem, { width: imageSize, height: imageSize + 80 }]}
        onPress={() => {
          router.push({
            pathname: '/show-image',
            params: {
              imageUrl: item.imageUrl,
              drawingUrl: item.drawingUrl,
              promptText: item.prompt,
              title: item.title,
              theme: item.theme
            }
          });
        }}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.galleryImage, { width: imageSize - 16, height: imageSize - 16 }]}
          resizeMode="cover"
        />
        <Text style={styles.galleryItemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.galleryItemDate}>{formattedDate}</Text>
        <View style={styles.themeTag}>
          <Text style={styles.themeTagText}>{item.theme}</Text>
        </View>
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

        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#666" />
            <Text style={styles.emptySubtext}>Loading your gallery...</Text>
          </View>
        ) : galleryItems.length === 0 ? (
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
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={loadGalleryItems} />
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}