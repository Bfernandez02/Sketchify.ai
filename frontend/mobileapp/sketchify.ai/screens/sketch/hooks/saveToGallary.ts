import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { SketchPost } from '@/types/sketch';
import { ThemeType, DEFAULT_THEME } from '@/types/themes';

export const saveToGallery = async (
  base64Image: string,
  originalDrawing: string,
  prompt: string,
  theme: ThemeType = DEFAULT_THEME,
  title: string = "My Sketch"
): Promise<string> => {
  try {
    console.log("Starting saveToGallery function");

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const userId = currentUser.uid;
    console.log("User authenticated:", userId);

    // Create timestamp and filenames
    const timestamp = new Date();
    const filenameEnhanced = `sketch_enhanced_${timestamp.getTime()}.png`;
    const filenameOriginal = `sketch_original_${timestamp.getTime()}.png`;

    // Get storage reference
    const storage = getStorage();
    console.log("Getting storage references");
    
    // Create storage references for both images
    const enhancedImageRef = ref(storage, `users/${userId}/profile/${filenameEnhanced}`);
    const originalDrawingRef = ref(storage, `users/${userId}/profile/${filenameOriginal}`);
    
    console.log("Created storage references:", enhancedImageRef.fullPath, originalDrawingRef.fullPath);

    // Clean and validate enhanced image base64 data
    let cleanEnhancedBase64 = base64Image;
    if (!cleanEnhancedBase64.startsWith('data:image/png;base64,')) {
      cleanEnhancedBase64 = `data:image/png;base64,${cleanEnhancedBase64}`;
    }

    if (!cleanEnhancedBase64 || cleanEnhancedBase64.trim() === '') {
      throw new Error("Invalid enhanced image data");
    }
    
    // Clean and validate original drawing base64 data
    let cleanOriginalBase64 = originalDrawing;
    if (!cleanOriginalBase64.startsWith('data:image/png;base64,')) {
      cleanOriginalBase64 = `data:image/png;base64,${cleanOriginalBase64}`;
    }

    if (!cleanOriginalBase64 || cleanOriginalBase64.trim() === '') {
      throw new Error("Invalid original drawing data");
    }

    console.log("Enhanced image length:", cleanEnhancedBase64.length);
    console.log("Original drawing length:", cleanOriginalBase64.length);

    // Upload enhanced image
    console.log("Converting enhanced image to Blob...");
    const enhancedResponse = await fetch(cleanEnhancedBase64);
    const enhancedBlob = await enhancedResponse.blob();
    console.log("Enhanced image blob created successfully, size:", enhancedBlob.size);

    console.log("Uploading enhanced image...");
    const metadata = {
      contentType: 'image/png',
    };

    const enhancedUploadTask = uploadBytesResumable(enhancedImageRef, enhancedBlob, metadata);
    
    // First upload the enhanced image
    const enhancedImageUrl = await new Promise<string>((resolve, reject) => {
      enhancedUploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Enhanced image upload progress: ${progress.toFixed(2)}%`);
        },
        (error) => {
          console.error("Enhanced image upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(enhancedUploadTask.snapshot.ref);
            console.log("Enhanced image URL obtained:", url);
            resolve(url);
          } catch (error) {
            console.error("Failed to get enhanced image URL:", error);
            reject(error);
          }
        }
      );
    });
    
    // Now upload the original drawing
    console.log("Converting original drawing to Blob...");
    const originalResponse = await fetch(cleanOriginalBase64);
    const originalBlob = await originalResponse.blob();
    console.log("Original drawing blob created successfully, size:", originalBlob.size);
    
    console.log("Uploading original drawing...");
    const originalUploadTask = uploadBytesResumable(originalDrawingRef, originalBlob, metadata);
    
    const originalDrawingUrl = await new Promise<string>((resolve, reject) => {
      originalUploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Original drawing upload progress: ${progress.toFixed(2)}%`);
        },
        (error) => {
          console.error("Original drawing upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(originalUploadTask.snapshot.ref);
            console.log("Original drawing URL obtained:", url);
            resolve(url);
          } catch (error) {
            console.error("Failed to get original drawing URL:", error);
            reject(error);
          }
        }
      );
    });

    // Save to Firestore with both URLs
    console.log("Saving to Firestore...");
    const db = getFirestore();
    const postRef = doc(collection(db, `users/${userId}/posts`));

    // Using the SketchPost type for type consistency
    const postData: SketchPost = {
      id: postRef.id,
      title,
      prompt,
      theme,
      createdAt: timestamp,
      drawing: originalDrawingUrl,  // URL for the original drawing
      image: enhancedImageUrl,      // URL for the enhanced image
    };

    await setDoc(postRef, postData);
    console.log("Firestore document created successfully");

    return enhancedImageUrl;
  } catch (error) {
    console.error("Error saving to gallery:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
};