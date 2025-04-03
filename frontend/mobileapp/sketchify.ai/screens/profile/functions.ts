import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase/config';
import { Share, Alert } from 'react-native';
import { router } from 'expo-router';
import { UserData } from '@/types/auth';

/**
 * Fetches user data and sketches from Firebase
 */
export const fetchUserData = async (
  userId: string | undefined,
  setLoading: (value: boolean) => void,
  setIsCurrentUser: (value: boolean) => void,
  setUserData: (data: UserData | null) => void,
  setSketches: (sketches: any[]) => void,
  setError: (error: string | null) => void
): Promise<void> => {
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

/**
 * Handles sharing user profile
 */
export const handleShare = async (userData: UserData | null): Promise<void> => {
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

/**
 * Handles edit profile navigation
 */
export const handleEditProfile = (): void => {
  router.push('/edit-profile');
};

/**
 * Handles following a user
 */
export const handleFollowUser = (): void => {
  Alert.alert("Success", "You are now following this user");
};