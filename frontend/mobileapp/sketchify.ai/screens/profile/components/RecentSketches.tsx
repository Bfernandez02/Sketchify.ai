import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { collection, query, where, orderBy, limit, getDocs, Timestamp, getFirestore } from 'firebase/firestore';
import { SketchPost } from '@/types/sketch';

type RecentSketchesProps = {
  userId: string | null;
  isCurrentUser: boolean;
  textColor: string;
  accentColor: string;
  cardBackgroundColor: string;
  maxSketches?: number;
};

export const RecentSketches = ({
  userId,
  isCurrentUser,
  textColor,
  accentColor,
  cardBackgroundColor,
  maxSketches = 6,
}: RecentSketchesProps) => {
  const [sketches, setSketches] = useState<SketchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("RecentSketches mounted with userId:", userId);

    const fetchSketches = async () => {
      if (!userId) {
        console.log("No userId provided to RecentSketches");
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const db = getFirestore();
        console.log("Fetching sketches for user:", userId);
        let sketchesData: SketchPost[] = [];

        // Try users/{userId}/posts
        try {
          const postsQuery = query(collection(db, `users/${userId}/posts`), orderBy("createdAt", "desc"), limit(maxSketches));
          const postsSnapshot = await getDocs(postsQuery);
          console.log(`Found ${postsSnapshot.size} sketches in users/${userId}/posts`);
          postsSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Post data:", data); // Debug raw data
            sketchesData.push(processSketchData(doc.id, data));
          });
        } catch (postsError) {
          console.error("Error fetching from posts:", postsError);
        }

        // If no sketches found, try sketches collection
        if (sketchesData.length === 0) {
          try {
            const sketchesQuery = query(collection(db, "sketches"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(maxSketches));
            const sketchesSnapshot = await getDocs(sketchesQuery);
            console.log(`Found ${sketchesSnapshot.size} sketches in sketches collection`);
            sketchesSnapshot.forEach((doc) => {
              const data = doc.data();
              console.log("Sketch data:", data); // Debug raw data
              sketchesData.push(processSketchData(doc.id, data));
            });
          } catch (sketchesError) {
            console.error("Error fetching from sketches:", sketchesError);
          }
        }

        console.log("Total sketches found:", sketchesData.length);
        setSketches(sketchesData);
      } catch (err: any) {
        console.error('Error fetching sketches:', err);
        setError(err.message || "Failed to fetch sketches");
      } finally {
        setLoading(false);
      }
    };

    fetchSketches();
  }, [userId, maxSketches]);

  const processSketchData = (docId: string, data: any): SketchPost => {
    if (!data) {
      console.error("No data provided to processSketchData for docId:", docId);
      return { id: docId, title: 'Untitled', prompt: '', theme: 'minimalism', createdAt: new Date(), drawing: '', image: '' };
    }

    let createdAtDate: Date;
    if (data.createdAt instanceof Timestamp) {
      createdAtDate = data.createdAt.toDate();
    } else if (data.createdAt && typeof data.createdAt === 'object' && 'seconds' in data.createdAt) {
      createdAtDate = new Date(data.createdAt.seconds * 1000);
    } else {
      createdAtDate = new Date(data.createdAt || Date.now());
    }

    return {
      id: data.id || docId,
      title: data.title || 'Untitled',
      prompt: data.prompt || '',
      theme: data.theme || 'minimalism',
      createdAt: createdAtDate,
      drawing: data.drawing || '',
      image: data.image || '',
    };
  };

  if (loading) {
    return (
      <View style={{ marginBottom: 24, backgroundColor: 'transparent' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor, paddingHorizontal: 20, marginBottom: 16 }}>Recent Sketches</Text>
        <View style={{ margin: 16, padding: 24, backgroundColor: cardBackgroundColor, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text style={{ marginTop: 12, color: textColor }}>Loading sketches...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ marginBottom: 24, backgroundColor: 'transparent' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor, paddingHorizontal: 20, marginBottom: 16 }}>Recent Sketches</Text>
        <View style={{ margin: 16, padding: 24, backgroundColor: cardBackgroundColor, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <IconSymbol size={48} name="exclamationmark.circle" color={textColor + '50'} />
          <Text style={{ marginTop: 12, color: textColor, textAlign: 'center' }}>Could not load sketches: {error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 24, backgroundColor: 'transparent' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor }}>Recent Sketches</Text>
        {sketches.length > 0 && (
          <TouchableOpacity onPress={() => router.push('/(tabs)/gallery')}>
            <Text style={{ fontSize: 16, color: accentColor }}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      {sketches.length > 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {sketches.map((sketch) => (
              <TouchableOpacity
                key={sketch.id}
                style={{
                  width: (Dimensions.get('window').width - 40) / 2,
                  backgroundColor: cardBackgroundColor,
                  borderRadius: 12,
                  marginBottom: 12,
                  overflow: 'hidden',
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
                onPress={() =>
                  router.push({
                    pathname: '/show-image',
                    params: { imageUrl: sketch.image, drawingUrl: sketch.drawing, promptText: sketch.prompt, title: sketch.title, theme: sketch.theme },
                  })
                }
              >
                {sketch.image ? (
                  <Image source={{ uri: sketch.image }} style={{ width: '100%', aspectRatio: 1, backgroundColor: '#f0f0f0' }} resizeMode="cover" onError={(e) => console.error("Image load error:", e.nativeEvent.error, sketch.image)} />
                ) : (
                  <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
                    <IconSymbol name="photo" size={32} color="#CCCCCC" />
                  </View>
                )}
                <View style={{ padding: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }} numberOfLines={1}>{sketch.title || 'Untitled'}</Text>
                  <Text style={{ fontSize: 14, color: textColor + '80', marginTop: 4 }}>
                    {sketch.createdAt instanceof Date ? sketch.createdAt.toLocaleDateString() : new Date(sketch.createdAt as any).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={{ margin: 16, padding: 24, backgroundColor: cardBackgroundColor, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <IconSymbol size={48} name="pencil.tip" color={textColor + '50'} />
          <Text style={{ fontSize: 16, color: textColor + '99', marginTop: 12, marginBottom: isCurrentUser ? 16 : 0 }}>No sketches yet</Text>
          {isCurrentUser && (
            <TouchableOpacity style={{ backgroundColor: accentColor, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={() => router.push('/sketch')}>
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Create a Sketch</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};