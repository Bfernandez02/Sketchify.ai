import { useState, useCallback, useMemo } from 'react';
import { PanResponder, Alert, GestureResponderEvent } from 'react-native';
import { DrawingPath, Point } from '@/types/sketch';
import { DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR, MIN_STROKE_WIDTH, MAX_STROKE_WIDTH } from '../constants';

/**
 * Hook that provides drawing functionality for the sketch screen
 */
const useDrawing = () => {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [strokeWidth, setStrokeWidth] = useState<number>(DEFAULT_STROKE_WIDTH);
  const [strokeColor, setStrokeColor] = useState<string>(DEFAULT_STROKE_COLOR);

  // Extract touch coordinates from event
  const getLocationCoordinates = (evt: GestureResponderEvent): Point => {
    const { locationX, locationY } = evt.nativeEvent;
    // console.log("Touch location:", locationX, locationY);
    return { x: locationX, y: locationY };
  };

  // Helper to convert points to SVG path
  const pointsToPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    
    // Start with move to first point
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Add line to each subsequent point
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  // Handle start of the drawing
  const handleDrawStart = useCallback((evt: GestureResponderEvent) => {
    const point = getLocationCoordinates(evt);
    console.log("Drawing started at", point);
    setCurrentPath({
      color: strokeColor,
      width: strokeWidth,
      points: [point],
      opacity: 1,
    });
  }, [strokeColor, strokeWidth]);

  // Handle drawing movement
  const handleDrawMove = useCallback((evt: GestureResponderEvent) => {
    const point = getLocationCoordinates(evt);
    setCurrentPath(prev => {
      if (!prev || !prev.points) return prev;
      
      const lastPoint = prev.points[prev.points.length - 1];
      const dx = point.x - lastPoint.x;
      const dy = point.y - lastPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only add points if they're a certain distance away (prevents too many points)
      if (distance > 2) {
        console.log("Adding point at distance", distance);
        const newPoints = [...prev.points, point];
        return {
          ...prev,
          points: newPoints,
          path: pointsToPath(newPoints), // Update path string
        };
      }
      return prev;
    });
  }, []);

  // Handle end of drawing
  const handleDrawEnd = useCallback(() => {
    console.log("Drawing ended");
    setCurrentPath(prev => {
      if (prev && prev.points && prev.points.length > 1) {
        console.log("Completed path with", prev.points.length, "points");
        
        // Ensure the final path has both points and path string
        const finalPath = {
          ...prev,
          path: prev.path || pointsToPath(prev.points),
        };
        
        setPaths(prevPaths => [...prevPaths, finalPath]);
      }
      return null;
    });
  }, []);

  // Create the pan responder with our drawing handlers
  const panResponder = useMemo(() => PanResponder.create({
    // We want to become responder when the user touches the canvas
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    
    // When the gesture starts, handle drawing start
    onPanResponderGrant: handleDrawStart,
    
    // When moving, handle drawing lines
    onPanResponderMove: handleDrawMove,
    
    // When released, end the drawing
    onPanResponderRelease: handleDrawEnd,
    onPanResponderTerminate: handleDrawEnd,
  }), [handleDrawStart, handleDrawMove, handleDrawEnd]);

  // Function to clear all paths
  const handleClear = (): void => {
    Alert.alert(
      "Clear Canvas", 
      "Are you sure you want to clear your drawing?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            setPaths([]);
            setCurrentPath(null);
          }
        }
      ]
    );
  };

  // Function to undo last path
  const handleUndo = (): void => {
    setPaths((prev) => prev.slice(0, -1));
    setCurrentPath(null);
  };

  // Function to change stroke color
  const handleColorChange = (color: string) => {
    setStrokeColor(color);
    setCurrentPath((prev) => (prev ? { ...prev, color } : null));
  };

  // Function to change stroke width
  const handleStrokeWidthChange = (delta: number) => {
    const newWidth = Math.min(MAX_STROKE_WIDTH, Math.max(MIN_STROKE_WIDTH, strokeWidth + delta));
    setStrokeWidth(newWidth);
    setCurrentPath((prev) => (prev ? { ...prev, width: newWidth } : null));
  };

  return {
    paths,
    currentPath,
    strokeWidth,
    strokeColor,
    panResponder,
    handleUndo,
    handleClear,
    handleColorChange,
    handleStrokeWidthChange,
  };
};

export default useDrawing;