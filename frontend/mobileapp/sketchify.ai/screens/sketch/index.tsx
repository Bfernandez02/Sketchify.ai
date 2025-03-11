import React, { useRef, useState } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

// Components
import Header from './components/Header';
import Canvas from './components/Canvas';
import ToolsPanel from './components/ToolsPanel';
import BrushSettings from './components/BrushSettings';
import Toolbar from './components/Toolbar';

// Hooks
import useDrawing from './hooks/useDrawing';
import useImageProcessing from './hooks/useImageProcessing';

// Styles
import { styles } from './styles';

export default function SketchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const viewShotRef = useRef<any>(null);
  
  // UI panel states
  const [isColorPanelOpen, setIsColorPanelOpen] = useState(false);
  const [isBrushSettingsOpen, setIsBrushSettingsOpen] = useState(false);
  
  // Core drawing functionality
  const {
    paths,
    currentPath,
    strokeWidth,
    strokeColor,
    panResponder,
    handleUndo,
    handleClear,
    handleColorChange,
    handleStrokeWidthChange,
  } = useDrawing();
  
  const { isLoading, handleProcess } = useImageProcessing(
    viewShotRef, 
    paths, 
    currentPath
  );

  // Toggle color panel
  const toggleColorPanel = () => {
    setIsColorPanelOpen(!isColorPanelOpen);
    if (!isColorPanelOpen) {
      setIsBrushSettingsOpen(false); // Close brush settings if opening color panel
    }
  };

  // Toggle brush settings
  const toggleBrushSettings = () => {
    setIsBrushSettingsOpen(!isBrushSettingsOpen);
    if (!isBrushSettingsOpen) {
      setIsColorPanelOpen(false); // Close color panel if opening brush settings
    }
  };

  // Dismiss all panels
  const dismissPanels = () => {
    setIsColorPanelOpen(false);
    setIsBrushSettingsOpen(false);
  };
  
  // Handle color change with auto-dismiss
  const handleColorChangeWithDismiss = (color: string) => {
    handleColorChange(color);
    dismissPanels();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={['#F9F9F9', '#FFFFFF']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Header colorScheme={colorScheme} />
      
      <View style={[styles.canvasWrapper]}>
      <Canvas
        viewShotRef={viewShotRef}
        panResponder={panResponder}
        paths={paths}
        currentPath={currentPath}
        isDark={isDark}
      />
    </View>

      <Toolbar
        isDark={isDark}
        paths={paths}
        isLoading={isLoading}
        strokeColor={strokeColor}
        onUndo={handleUndo}
        onClear={handleClear}
        onProcess={handleProcess}
        onToggleBrushSettings={toggleBrushSettings}
        onToggleColorPanel={toggleColorPanel}
        isBrushSettingsOpen={isBrushSettingsOpen}
        isColorPanelOpen={isColorPanelOpen}
      />

    {isColorPanelOpen && (
        <ToolsPanel
          isDark={isDark}
          strokeColor={strokeColor}
          onColorChange={handleColorChangeWithDismiss}
          isExpanded={isColorPanelOpen}
          onDismiss={dismissPanels}
        />
      )}
      
      {/* Conditionally render the brush settings */}
      {isBrushSettingsOpen && (
        <BrushSettings
          isDark={isDark}
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          onStrokeWidthChange={handleStrokeWidthChange}
          isVisible={isBrushSettingsOpen}
          onClose={dismissPanels}
        />
      )}
      
    </SafeAreaView>
  );
}