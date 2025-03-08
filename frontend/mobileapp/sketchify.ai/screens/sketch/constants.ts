import { ColorOption } from './types';

// Available colors with names for better UX
export const AVAILABLE_COLORS: ColorOption[] = [
  { color: '#000000', name: 'Black' },
  { color: '#FFFFFF', name: 'White' },
  { color: '#FF0000', name: 'Red' },
  { color: '#0000FF', name: 'Blue' },
  { color: '#008000', name: 'Green' },
  { color: '#FFA500', name: 'Orange' },
  { color: '#800080', name: 'Purple' },
  { color: '#FFFF00', name: 'Yellow' },
  { color: '#FFC0CB', name: 'Pink' },
  { color: '#A52A2A', name: 'Brown' },
];

// API endpoints
export const API_BASE_URL = "http://localhost:5000";

// Canvas settings
export const DEFAULT_STROKE_WIDTH = 5;
export const DEFAULT_STROKE_COLOR = '#000000';
export const MIN_STROKE_WIDTH = 2;
export const MAX_STROKE_WIDTH = 20;