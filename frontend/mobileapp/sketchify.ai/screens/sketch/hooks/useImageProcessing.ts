import { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from "axios";
import { useRouter } from 'expo-router';
import { DrawingPath, ApiResponse, ApiErrorResponse } from '../types';
import { API_BASE_URL } from '../constants';

/**
 * Call the API to process the sketch image
 */
const callApi = async (imageData: string): Promise<ApiResponse | ApiErrorResponse> => {
  try {
    const cleanImageData = imageData.includes('base64,') 
      ? imageData
      : `data:image/png;base64,${imageData}`;
    
    console.log("Calling API with image data");

    // console.log(imageData.substring(0,100))
    // console.log(imageData.substring(-100))

    
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
 * Save the enhanced image to the gallery
 */
const saveToGallery = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const timestamp = new Date().getTime();
    const filename = `sketch_enhanced_${timestamp}.png`;
    const filepath = `${FileSystem.documentDirectory}gallery/${filename}`;
    
    // Ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}gallery`);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}gallery`, { intermediates: true });
    }
    
    // Save the image
    await FileSystem.writeAsStringAsync(filepath, base64Image, { encoding: FileSystem.EncodingType.Base64 });
    
    // Update metadata
    const galleryData = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory}gallery/metadata.json`,
      { encoding: FileSystem.EncodingType.UTF8 }
    ).catch(() => JSON.stringify({ items: [] }));
    
    const metadata = JSON.parse(galleryData);
    metadata.items = metadata.items || [];
    
    metadata.items.push({
      id: timestamp.toString(),
      filename,
      prompt,
      createdAt: new Date().toISOString(),
      filepath,
    });
    
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}gallery/metadata.json`,
      JSON.stringify(metadata),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    
    return filepath;
  } catch (error) {
    console.error("Error saving to gallery:", error);
    throw error;
  }
};


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
      
      // Capture the current drawing as an image
      const uri = await viewShotRef.current.capture();
      
      if (!uri) throw new Error("Failed to capture sketch");
      
      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const response = await callApi(base64);
      
      if (isErrorResponse(response)) {
        throw new Error(response.error);
      }
      
      // Get the description from the response, or use a default
      const promptText =  "Enhanced sketch";
      
      // Save to gallery in background
      saveToGallery(response.image, promptText)
        .catch(error => console.error("Error saving to gallery:", error));
      
      router.push({
        pathname: '/show-image',
        params: {
          imageData: response.image,
          promptText: promptText
        }
      });
      
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      console.error("Error processing sketch:", error);
      Alert.alert("Processing Error", "There was an error enhancing your sketch. Please try again.");
    }
  };

  return {
    isLoading,
    handleProcess,
  };
};

export default useImageProcessing;