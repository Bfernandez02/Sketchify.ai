import * as FileSystem from 'expo-file-system';
import axios, { AxiosResponse, AxiosError } from "axios";
import { ApiResponse, ApiErrorResponse  } from './types'

const BASE_URL = "http://localhost:5000";



/**
 * Call the API to process the sketch image
 * @param imageData Base64 encoded image data
 * @returns API response or error object
 */
export const callApi = async (imageData: string): Promise<AxiosResponse<ApiResponse> | ApiErrorResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${BASE_URL}/generate-prompt`, {
      image: imageData,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Something went wrong while calling the API" };
  }
};

/**
 * Type guard to check if the response is an error
 */
function isApiErrorResponse(response: AxiosResponse<ApiResponse> | ApiErrorResponse): response is ApiErrorResponse {
  return (response as ApiErrorResponse).error !== undefined;
}

/**
 * Processes the sketch image by calling the API
 * @param imageUri URI of the captured ViewShot
 * @returns The processed image data
 */
export const processSketchWithAPI = async (imageUri: string): Promise<{ success: boolean; imageData?: string; promptText?: string }> => {
  try {
    // Convert ViewShot URI to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Call the API with the image data
    const response = await callApi(base64);
    
    if (isApiErrorResponse(response)) {
      throw new Error(response.error);
    }
    
    // Extract the image and prompt from the response
    const enhancedImageData = response.data.image;
    const promptText = response.data.prompt || "Enhanced sketch";
    
    return {
      success: true,
      imageData: enhancedImageData,
      promptText
    };
  } catch (error) {
    console.error("Error processing sketch:", error instanceof Error ? error.message : String(error));
    return { success: false };
  }
};

/**
 * Interface for the gallery metadata item
 */
interface GalleryItem {
  id: string;
  filename: string;
  prompt: string;
  createdAt: string;
  filepath: string;
}

/**
 * Interface for the gallery metadata
 */
interface GalleryMetadata {
  items: GalleryItem[];
}

/**
 * Save the enhanced image to the gallery
 * @param base64Image Base64 encoded image data
 * @param prompt Description of the image
 * @returns Path to the saved image
 */
export const saveToGallery = async (base64Image: string, prompt: string): Promise<string> => {
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
    
    const metadata: GalleryMetadata = JSON.parse(galleryData);
    
    const newItem: GalleryItem = {
      id: timestamp.toString(),
      filename,
      prompt,
      createdAt: new Date().toISOString(),
      filepath,
    };
    
    metadata.items.push(newItem);
    
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}gallery/metadata.json`,
      JSON.stringify(metadata),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    
    return filepath;
  } catch (error) {
    console.error("Error saving to gallery:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};