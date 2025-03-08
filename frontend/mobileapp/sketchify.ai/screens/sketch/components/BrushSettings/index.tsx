import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from './styles';

interface BrushSettingsProps {
  isDark: boolean;
  strokeWidth: number;
  strokeColor: string;
  onStrokeWidthChange: (delta: number) => void;
  isVisible: boolean;
  onClose: () => void;
}

const BrushSettings: React.FC<BrushSettingsProps> = ({
  isDark,
  strokeWidth,
  strokeColor,
  onStrokeWidthChange,
  isVisible,
  onClose
}) => {
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

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <Animated.View 
        style={[
          styles.brushSettingsContainer,
          { opacity: opacityValue }
        ]}
      >
        <BlurView
          intensity={90}
          tint={isDark ? 'dark' : 'light'}
          style={styles.brushSettingsBlur}
        >
          <View style={styles.brushSettingsHeader}>
            <Text style={[styles.brushSettingsTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Brush Size
            </Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <IconSymbol size={20} name="xmark" color={isDark ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.brushSizeControls}>
            <TouchableOpacity 
              style={styles.brushSizeButton} 
              onPress={() => onStrokeWidthChange(-1)}
            >
              <IconSymbol size={18} name="minus" color={isDark ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
            
            <View style={styles.brushSizePreview}>
              <View style={[
                styles.brushSizeCircle,
                { 
                  width: strokeWidth * 2, 
                  height: strokeWidth * 2,
                  backgroundColor: strokeColor 
                }
              ]} />
              <Text style={[styles.brushSizeText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {strokeWidth}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.brushSizeButton} 
              onPress={() => onStrokeWidthChange(1)}
            >
              <IconSymbol size={18} name="plus" color={isDark ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
    </>
  );
};

export default BrushSettings;