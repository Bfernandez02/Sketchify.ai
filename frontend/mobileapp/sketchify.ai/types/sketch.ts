// src/types/sketch.ts
import { ThemeType } from './themes';

/**
 * Point interface for drawing coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Unified DrawingPath interface that supports both point-based drawing
 * and SVG path-based rendering
 */
export interface DrawingPath {
  color: string;
  width: number;
  points?: Point[];    // For canvas drawing with touch points
  path?: string;       // For SVG path representation
  opacity?: number;    // Optional opacity
}

/**
 * Color option for drawing tools
 */
export interface ColorOption {
  color: string;
  name: string;
}

/**
 * Type definition for a user sketch/post that exactly matches the Firestore structure
 */
export type SketchPost = {
  id: string;
  title: string;
  prompt: string;
  theme: ThemeType;
  createdAt: Date;
  drawing: string;  // URL for the original drawing
  image: string;    // URL for the enhanced image
};

/**
 * API Response types
 */
export interface ApiResponse {
  image: string;
  prompt?: string;
  title?: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface GalleryMetadata {
  items: SketchPost[];
}