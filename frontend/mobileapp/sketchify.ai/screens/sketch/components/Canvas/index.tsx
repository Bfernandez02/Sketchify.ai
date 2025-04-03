import React from 'react';
import { View, Text } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { DrawingPath } from '../../types';
import DrawPath from './DrawPath';
import { styles } from './styles';

interface CanvasProps {
  viewShotRef: React.RefObject<any>;
  panResponder: any;
  paths: DrawingPath[];
  currentPath: DrawingPath | null;
  isDark: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  viewShotRef,
  panResponder,
  paths,
  currentPath,
  isDark
}) => {

  return (
    <>
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 0.9 }}
        style={styles.canvasContainer}
      >
        <View
          style={[
            styles.canvas,
            { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }
          ]}
          pointerEvents="auto" // Explicitly enable pointer events
          collapsable={false} // Important for panResponder
          {...panResponder.panHandlers} // Apply pan handlers
        >
          {/* Drawing paths */}
          {paths.map((path, index) => (
            <DrawPath key={`path-${index}`} path={path} />
          ))}
          {currentPath && <DrawPath key="current-path" path={currentPath} />}
        </View>
      </ViewShot>
      
      <View style={styles.drawingStatusContainer}>
        <Text style={[styles.drawingStatus, { color: isDark ? '#E0E0E0' : '#555555' }]}>
          {paths.length > 0
            ? `${paths.length} stroke${paths.length !== 1 ? 's' : ''} drawn`
            : 'Start drawing...'} 
        </Text>
      </View>
    </>
  );
};

export default Canvas;