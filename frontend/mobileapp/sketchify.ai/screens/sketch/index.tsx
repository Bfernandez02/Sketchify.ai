import React, { useRef, useState } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

import Canvas from './components/Canvas';
import ToolsPanel from './components/ToolsPanel';
import BrushSettings from './components/BrushSettings';
import Toolbar from './components/Toolbar';
import ThemeSelector from './components/ThemeSelector';

// Hooks
import useDrawing from './hooks/useDrawing';
import useImageProcessing from './hooks/useImageProcessing';
import { styles } from './styles';

export default function SketchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const viewShotRef = useRef<any>(null);

  const [isColorPanelOpen, setIsColorPanelOpen] = useState(false);
  const [isBrushSettingsOpen, setIsBrushSettingsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'minimalism' | 'realism' | 'nature'>('minimalism');

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

  const { isLoading, handleProcess } = useImageProcessing(viewShotRef, paths, currentPath);

  const toggleColorPanel = () => {
    setIsColorPanelOpen(!isColorPanelOpen);
    setIsBrushSettingsOpen(false);
  };

  const toggleBrushSettings = () => {
    setIsBrushSettingsOpen(!isBrushSettingsOpen);
    setIsColorPanelOpen(false);
  };

  const handleThemeSelect = (theme: 'minimalism' | 'realism' | 'nature') => {
    setSelectedTheme(theme);
  };

  const dismissPanels = () => {
    setIsColorPanelOpen(false);
    setIsBrushSettingsOpen(false);
  };

  const handleColorChangeWithDismiss = (color: string) => {
    handleColorChange(color);
    dismissPanels();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1E1E1E', '#2C2C2E'] : ['#E6F0FA', '#F9F9F9']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.headerWrapper}>
        <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={handleThemeSelect} />
      </View>

      <View style={styles.canvasWrapper}>
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