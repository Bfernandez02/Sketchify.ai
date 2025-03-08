// Common types shared across multiple components

export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  color: string;
  width: number;
  points: Point[];
}

export interface ColorOption {
  color: string;
  name: string;
}

// API responses
export interface ApiResponse {
  image: string;
  prompt: string;
}

export interface ApiErrorResponse {
  error: string;
}

// Gallery data types
export interface GalleryItem {
  id: string;
  filename: string;
  prompt: string;
  createdAt: string;
  filepath: string;
}

export interface GalleryMetadata {
  items: GalleryItem[];
}