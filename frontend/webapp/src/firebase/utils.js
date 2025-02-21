import { db, storage } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageToStorage = async (file, userId, type) => {
  if (!file) return null;
  
  const storageRef = ref(storage, `users/${userId}/${type}/${file.file.name}`);
  await uploadBytes(storageRef, file.file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const saveUserToFirestore = async (userData, uid) => {
  try {
    // Upload images if they exist
    const profileImageUrl = await uploadImageToStorage(userData.profile, uid, 'profile');
    const bannerImageUrl = await uploadImageToStorage(userData.banner, uid, 'banner');

    const userDoc = {
      uid,
      name: userData.name,
      email: userData.email,
      bio: userData.bio || '',
      profileImage: profileImageUrl || '',
      bannerImage: bannerImageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    await setDoc(doc(db, "users", uid), userDoc);
    return userDoc;
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
    throw error;
  }
};