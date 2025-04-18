import { useState } from 'react';
import { Alert } from 'react-native';
import axios from "axios";
import { useRouter } from 'expo-router';
import { DrawingPath, ApiResponse, ApiErrorResponse } from '@/types/sketch';
import { ThemeType, DEFAULT_THEME } from '@/types/themes';
import { LOCAL_API_URL, EXPO_PUBLIC_PROD_API_URL } from '../constants';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { saveToGallery } from './saveToGallary';

const callApi = async (imageData: string, theme: ThemeType = DEFAULT_THEME): Promise<ApiResponse | ApiErrorResponse> => {
  try {
    const cleanImageData = imageData.includes('base64,') 
      ? imageData
      : `data:image/png;base64,${imageData}`;
    
    console.log("Calling API with image data and theme:", theme);

    const response = await axios.post<ApiResponse>(`${EXPO_PUBLIC_PROD_API_URL}/generate-prompt`, {
      image: cleanImageData,
      theme: theme
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
 * Hook for processing images with the simplified storage approach
 */
const useImageProcessing = (
  viewShotRef: React.RefObject<any>,
  paths: DrawingPath[],
  currentPath: DrawingPath | null,
  selectedTheme: ThemeType = DEFAULT_THEME
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  
/**
 * Process the sketch drawing and enhance it with AI
 */
// Inside useImageProcessing hook

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
    
    // Call API to enhance the image - pass the selected theme
    console.log("Calling API with theme:", selectedTheme);
    const response = await callApi(manipResult.base64, selectedTheme);
    
    if (isErrorResponse(response)) {
      throw new Error(response.error);
    }
    
    console.log("API call successful");
    
    // Use response data or defaults
    const promptText = response.prompt || "Enhanced sketch";
    const title = response.title || "My AI Enhanced Sketch";
    // Use the selected theme
    const theme = selectedTheme;
    
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
      
      // Navigate to show-image page with URLs and make sure to include drawingData
      router.push({
        pathname: '/show-image',
        params: {
          imageUrl: enhancedImageUrl,
          // Original drawing - pass both URL and data as fallback
          drawingData: manipResult.base64, 
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
          imageData: response.image, // Enhanced image as base64
          drawingData: manipResult.base64, // Original drawing as base64
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