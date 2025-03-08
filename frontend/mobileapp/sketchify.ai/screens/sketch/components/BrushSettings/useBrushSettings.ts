import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * Custom hook for managing BrushSettings state and animations
 */
export const useBrushSettings = () => {
  // Visibility state
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Animation value for opacity
  const opacityValue = useRef(new Animated.Value(0)).current;
  
  // Animate opacity when visibility changes
  useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible, opacityValue]);
  
  // Toggle panel visibility
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };
  
  // Explicitly hide the panel
  const hidePanel = () => {
    setIsVisible(false);
  };
  
  // Explicitly show the panel
  const showPanel = () => {
    setIsVisible(true);
  };
  
  return {
    isVisible,
    opacityValue,
    toggleVisibility,
    hidePanel,
    showPanel,
  };
};