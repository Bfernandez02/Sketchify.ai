import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AVAILABLE_COLORS } from '../../constants';
import { styles } from './styles';

interface ToolsPanelProps {
  isDark: boolean;
  strokeColor: string;
  onColorChange: (color: string) => void;
  isExpanded: boolean;
  onDismiss?: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  isDark,
  strokeColor,
  onColorChange,
  isExpanded,
  onDismiss
}) => {
  // Animation value for the panel height
  const panelHeight = useRef(new Animated.Value(0)).current;
  
  // Animate panel height when expanded state changes
  useEffect(() => {
    Animated.timing(panelHeight, {
      toValue: isExpanded ? 200 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, panelHeight]);
  
  // Handle color selection and auto-dismiss
  const handleColorSelect = (color: string) => {
    onColorChange(color);
    if (onDismiss) {
      onDismiss();
    }
  };
  
  return (
    <>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      {/* The panel itself */}
      <Animated.View style={[styles.expandedTools, { height: panelHeight }]}>
        <BlurView
          intensity={80}
          tint={isDark ? 'dark' : 'light'}
          style={styles.colorPickerContainer}
        >
          <View style={styles.colorGrid}>
            {AVAILABLE_COLORS.map(({ color, name }) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButtonLarge,
                  { backgroundColor: color, borderColor: isDark ? '#555555' : '#DDDDDD' },
                  strokeColor === color && styles.selectedColorLarge,
                  color === '#FFFFFF' && { borderWidth: 1, borderColor: '#CCCCCC' }
                ]}
                onPress={() => handleColorSelect(color)}
              >
                {strokeColor === color && (
                  <View style={styles.colorCheckmark}>
                    <IconSymbol 
                      size={16} 
                      name="checkmark" 
                      color={color === '#FFFFFF' || color === '#FFFF00' ? '#000000' : '#FFFFFF'} 
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </Animated.View>
    </>
  );
};

export default ToolsPanel;