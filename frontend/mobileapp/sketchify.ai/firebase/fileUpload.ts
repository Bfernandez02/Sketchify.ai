import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// Define types for clarity
interface ImageFile {
  uri: string;
}

type ImageCategory = 'profile' | 'banner' | 'sketch';

/**
 * Uploads an image to Firebase Storage
 * @param imageFile The image file object with URI
 * @param userId The user ID to associate with the image
 * @param category The category of image (profile, banner, sketch, etc.)
 * @param quality Optional image quality (0-1), defaults to 0.7
 * @returns Promise with the download URL of the uploaded image
 */
export const uploadImageToStorage = async (
  imageFile: ImageFile | null,
  userId: string,
  category: ImageCategory,
  quality: number = 0.7
): Promise<string> => {
  if (!imageFile || !imageFile.uri) {
    return '';
  }

  try {
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(imageFile.uri);
    if (!fileInfo.exists) {
      console.error("File doesn't exist");
      return '';
    }

    // Resize and compress image
    const processedImage = await processImage(imageFile.uri, category, quality);
    
    // Convert to blob
    const blob = await uriToBlob(processedImage.uri);
    
    // Generate a unique filename
    const fileExtension = processedImage.uri.split('.').pop() || 'jpg';
    const fileName = `${userId}_${category}_${Date.now()}.${fileExtension}`;
    
    // Upload to Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, `users/${userId}/${category}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Process an image (resize and compress) based on category
 */
const processImage = async (
  uri: string, 
  category: ImageCategory,
  quality: number
) => {
  // Define dimensions based on image category
  let width: number;
  let height: number;
  
  switch (category) {
    case 'profile':
      width = 400;
      height = 400;
      break;
    case 'banner':
      width = 1200;
      height = 400;
      break;
    case 'sketch':
      width = 1080;
      height = 0; // 0 means "auto"
      break;
    default:
      width = 800;
      height = 0;
  }

  // Resize and compress
  return await manipulateAsync(
    uri,
    [
      height > 0 
        ? { resize: { width, height } } 
        : { resize: { width } }
    ],
    { compress: quality, format: SaveFormat.JPEG }
  );
};

/**
 * Convert a uri to a blob
 */
const uriToBlob = async (uri: string): Promise<Blob> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error converting uri to blob:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 * Currently not used but may be useful for profile/banner image updates
 */
export const deleteImageFromStorage = async (downloadURL: string): Promise<void> => {
  if (!downloadURL) return;
  
  try {
    const storage = getStorage();
    const storageRef = ref(storage, downloadURL);
    await deleteImageFromStorage(downloadURL);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};