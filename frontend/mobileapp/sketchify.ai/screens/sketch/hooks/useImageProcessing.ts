import { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from "axios";
import { DrawingPath, ApiResponse, ApiErrorResponse } from '../types';
import { API_BASE_URL } from '../constants';

/**
 * Call the API to process the sketch image
 */
const callApi = async (imageData: string): Promise<ApiResponse | ApiErrorResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${API_BASE_URL}/generate-prompt`, {
      image: imageData,
    });
    return response.data;
  } catch (error) {
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
      
      // Call the API
      const response = await callApi(base64);
      
      if (isErrorResponse(response)) {
        throw new Error(response.error);
      }
      
      // Save to gallery
      await saveToGallery(response.image, response.prompt);
      
      // Success feedback
      setIsLoading(false);
      Alert.alert(
        "Success!", 
        "Your sketch has been enhanced and saved to the gallery."
      );
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