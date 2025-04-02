import { useState } from 'react';
import { Alert } from 'react-native';
import axios from "axios";
import { useRouter } from 'expo-router';
import { DrawingPath, ApiResponse, ApiErrorResponse } from '../types';
import { API_BASE_URL } from '../constants';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const callApi = async (imageData: string): Promise<ApiResponse | ApiErrorResponse> => {
  try {
    const cleanImageData = imageData.includes('base64,') 
      ? imageData
      : `data:image/png;base64,${imageData}`;
    
    console.log("Calling API with image data");

    const response = await axios.post<ApiResponse>(`${API_BASE_URL}/generate-prompt`, {
      image: cleanImageData,
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      return { error: `API Error: ${JSON.stringify(error.response.data)}` };
    }
    console.error("Error:", error);
    return { error: "Something went wrong while calling the API" };
  }
};

/**
 * Check if response is an error
 */
const isErrorResponse = (response: ApiResponse | ApiErrorResponse): response is ApiErrorResponse => {
  return (response as ApiErrorResponse).error !== undefined;
};

/**
 * Save images to Firebase with React Native compatible approach
 */
const saveToGallery = async (
  base64Image: string,
  originalDrawing: string,
  prompt: string,
  theme: "minimalism" | "realism" | "nature" = "minimalism",
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

    const postData = {
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

/**
 * Hook for processing images with the simplified storage approach
 */
const useImageProcessing = (
  viewShotRef: React.RefObject<any>,
  paths: DrawingPath[],
  currentPath: DrawingPath | null
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  
/**
 * Process the sketch drawing and enhance it with AI
 */
const handleProcess = async (): Promise<void> => {
  if (paths.length === 0 && !currentPath) {
    Alert.alert("Empty Canvas", "Please draw something before enhancing.");
    return;
  }

  try {
    setIsLoading(true);
    
    if (!viewShotRef.current) {
      throw new Error("ViewShot ref is not initialized");
    }
    
    // Capture the current drawing as an image using ViewShot
    const uri = await viewShotRef.current.capture();
    
    if (!uri) throw new Error("Failed to capture sketch");
    
    console.log("Captured sketch URI:", uri);
    
    // Read the image as base64 using expo-image-manipulator
    const manipResult = await manipulateAsync(
      uri,
      [], // no transformations needed
      { format: SaveFormat.PNG, base64: true }
    );
    
    if (!manipResult.base64) {
      throw new Error("Failed to convert image to base64");
    }
    
    console.log("Converted to base64, length:", manipResult.base64.length);
    
    // Call API to enhance the image
    console.log("Calling API...");
    const response = await callApi(manipResult.base64);
    
    if (isErrorResponse(response)) {
      throw new Error(response.error);
    }
    
    console.log("API call successful");
    
    // Use response data or defaults
    const promptText = response.prompt || "Enhanced sketch";
    const title = response.title || "My AI Enhanced Sketch";
    const theme: "minimalism" | "realism" | "nature" = "minimalism";
    
    try {
      // Try to save to Firebase
      console.log("Saving to Firebase...");
      const enhancedImageUrl = await saveToGallery(
        response.image, 
        manipResult.base64, 
        promptText,
        theme,
        title
      );
      
      console.log("Successfully saved to gallery with URL:", enhancedImageUrl);
      
      // Navigate to show-image page with URLs
      router.push({
        pathname: '/show-image',
        params: {
          imageUrl: enhancedImageUrl,
          promptText: promptText,
          title: title,
          theme: theme
        }
      });
    } catch (saveError) {
      console.error("Firebase save failed:", saveError);
      
      // Fallback: Navigate with base64 data instead of URLs
      console.log("Using fallback navigation with base64 data");
      router.push({
        pathname: '/show-image',
        params: {
          imageData: response.image, // Use base64 data directly
          promptText: promptText,
          title: title,
          theme: theme
        }
      });
    }
  } catch (error) {
    console.error("Error processing sketch:", error);
    Alert.alert(
      "Processing Error", 
      "There was an error enhancing your sketch. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  return {
    isLoading,
    handleProcess,
  };
};

export default useImageProcessing;