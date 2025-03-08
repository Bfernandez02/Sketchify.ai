import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DrawingPath } from '../../types';
import { AVAILABLE_COLORS } from '../../constants';
import { styles } from './styles';

interface ToolbarProps {
  isDark: boolean;
  paths: DrawingPath[];
  isLoading: boolean;
  strokeColor: string;
  onUndo: () => void;
  onClear: () => void;
  onProcess: () => Promise<void>;
  onToggleBrushSettings?: () => void;
  onToggleColorPanel?: () => void;
  isBrushSettingsOpen?: boolean;
  isColorPanelOpen?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  isDark,
  paths,
  isLoading,
  strokeColor,
  onUndo,
  onClear,
  onProcess,
  onToggleBrushSettings,
  onToggleColorPanel,
  isBrushSettingsOpen = false,
  isColorPanelOpen = false
}) => {

  return (
    <BlurView
      intensity={95}
      tint={isDark ? 'dark' : 'light'}
      style={styles.toolbar}
    >
      <View style={styles.toolbarContent}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={onUndo}
            disabled={paths.length === 0}
          >
            <IconSymbol 
              size={22} 
              name="arrow.uturn.left" 
              color={paths.length === 0 
                ? (isDark ? '#666666' : '#CCCCCC') 
                : (isDark ? '#FFFFFF' : '#333333')} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={onClear}
            disabled={paths.length === 0}
          >
            <IconSymbol 
              size={22} 
              name="trash" 
              color={paths.length === 0 
                ? (isDark ? '#666666' : '#CCCCCC') 
                : (isDark ? '#FFFFFF' : '#333333')} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.toolbarCenter}>
            <TouchableOpacity
              style={[
                styles.enhanceButton,
                isLoading ? styles.enhanceButtonLoading : null
              ]}
              onPress={onProcess}
              disabled={isLoading || paths.length === 0}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <IconSymbol size={24} name="wand.and.stars" color="#FFFFFF" />
                  <Text style={styles.enhanceButtonText}>Enhance</Text>
                </>
              )}
            </TouchableOpacity>
        </View>
        
        <View style={styles.toolbarRight}>
          <TouchableOpacity 
            style={[
              styles.circleButton,
              isBrushSettingsOpen && styles.activeToolButton
            ]} 
            onPress={onToggleBrushSettings}
          >
            <IconSymbol 
              size={22} 
              name="paintbrush" 
              color={isDark ? '#FFFFFF' : '#333333'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.circleButton,
              isColorPanelOpen && styles.activeToolButton
            ]} 
            onPress={onToggleColorPanel}
          >
            <IconSymbol 
              size={22} 
              name="paintpalette" 
              color={isDark ? '#FFFFFF' : '#333333'} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.currentColorIndicator}>
        <View style={[
          styles.colorIndicatorDot, 
          { backgroundColor: strokeColor }
        ]} />
        <Text style={[
          styles.currentColorText,
          { color: isDark ? '#E0E0E0' : '#555555' }
        ]}>
          {AVAILABLE_COLORS.find(c => c.color === strokeColor)?.name || 'Custom'}
        </Text>
      </View>
    </BlurView>
  );
};

export default Toolbar;