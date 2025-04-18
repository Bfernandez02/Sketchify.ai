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
  title: string;
  prompt: string;
}

export interface ApiErrorResponse {
  error: string;
}