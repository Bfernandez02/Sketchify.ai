import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const useAnimations = () => {
  const [toolsExpanded, setToolsExpanded] = useState<boolean>(false);
  const [showBrushSettings, setShowBrushSettings] = useState<boolean>(false);
  
  const toolsHeight = useRef(new Animated.Value(0)).current;
  const brushSettingsOpacity = useRef(new Animated.Value(0)).current;
  const enhanceButtonScale = useRef(new Animated.Value(1)).current;

  // Tool animations
  useEffect(() => {
    Animated.timing(toolsHeight, {
      toValue: toolsExpanded ? 120 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [toolsExpanded]);

  // Brush settings animations
  useEffect(() => {
    Animated.timing(brushSettingsOpacity, {
      toValue: showBrushSettings ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showBrushSettings]);

  // Enhance button pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(enhanceButtonScale, {
        toValue: 1.05,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(enhanceButtonScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]);

    Animated.loop(pulseAnimation).start();

    return () => {
      enhanceButtonScale.stopAnimation();
    };
  }, []);

  // Toggle brush settings, closing color panel if open
  const toggleBrushSettings = () => {
    if (showBrushSettings) {
      setShowBrushSettings(false);
    } else {
      setShowBrushSettings(true);
      setToolsExpanded(false); // Close color panel if open
    }
  };

  // Toggle tools expanded, closing brush settings if open
  const toggleToolsExpanded = () => {
    if (toolsExpanded) {
      setToolsExpanded(false);
    } else {
      setToolsExpanded(true);
      setShowBrushSettings(false); // Close brush settings if open
    }
  };

  // Dismiss all panels
  const dismissAll = () => {
    setToolsExpanded(false);
    setShowBrushSettings(false);
  };

  return {
    toolsExpanded,
    showBrushSettings,
    toolsHeight,
    brushSettingsOpacity,
    enhanceButtonScale,
    toggleToolsExpanded,
    toggleBrushSettings,
    dismissAll, // New function to dismiss all panels
  };
};

export default useAnimations;