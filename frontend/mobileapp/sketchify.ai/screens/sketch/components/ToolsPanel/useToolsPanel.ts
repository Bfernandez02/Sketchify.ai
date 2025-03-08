import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * Custom hook for managing ToolsPanel state and animations
 */
export const useToolsPanel = () => {
  // Expanded state
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Animation value for the panel height
  const panelHeight = useRef(new Animated.Value(0)).current;
  
  // Animate panel height when expanded state changes
  useEffect(() => {
    Animated.timing(panelHeight, {
      toValue: isExpanded ? 120 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, panelHeight]);
  
  const togglePanel = () => {
    setIsExpanded(prev => !prev);
  };
  
  // Explicitly collapse the panel
  const dismissPanel = () => {
    setIsExpanded(false);
  };
  
  // Explicitly expand the panel
  const expandPanel = () => {
    setIsExpanded(true);
  };
  
  return {
    isExpanded,
    panelHeight,
    togglePanel,
    dismissPanel,
    expandPanel,
  };
};