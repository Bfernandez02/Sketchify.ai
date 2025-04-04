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
  isDark,
}) => {
  return (
    <View style={styles.canvasOuterContainer}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 0.9 }}
        style={styles.canvasContainer}
      >
        <View
          style={[
            styles.canvas,
            {
              backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
              borderColor: isDark ? '#3A3A3C' : '#E0E0E0',
            },
          ]}
          pointerEvents="auto"
          collapsable={false}
          {...panResponder.panHandlers}
        >
          {paths.map((path, index) => (
            <DrawPath key={`path-${index}`} path={path} />
          ))}
          {currentPath && <DrawPath key="current-path" path={currentPath} />}
        </View>
      </ViewShot>

      <View style={styles.drawingStatusContainer}>
        <Text
          style={[
            styles.drawingStatus,
            { color: isDark ? '#B0B0B0' : '#666666' },
          ]}
        >
          {paths.length > 0
            ? `${paths.length} stroke${paths.length !== 1 ? 's' : ''} drawn`
            : 'Start sketching...'}
        </Text>
      </View>
    </View>
  );
};

export default Canvas;