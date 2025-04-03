/**
 * Type definition for a user sketch/post that exactly matches the Firestore structure
 */
export type SketchPost = {
    id: string;
    title: string;
    prompt: string;
    theme: "minimalism" | "realism" | "nature";
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
  
  /**
   * Drawing path for canvas
   */
  export interface DrawingPath {
    path: string;
    color: string;
    width: number;
    opacity: number;
  }