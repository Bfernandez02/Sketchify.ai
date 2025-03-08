import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DrawingPath } from '../../../types';
import { styles } from './styles';

interface DrawPathProps {
  path: DrawingPath;
}

const DrawPath: React.FC<DrawPathProps> = ({ path }) => {
  // Create an SVG path string from the points
  const createSvgPath = (path: DrawingPath): string => {
    if (path.points.length === 0) return '';
    
    const startPoint = path.points[0];
    let pathStr = `M ${startPoint.x} ${startPoint.y}`;
    
    for (let i = 1; i < path.points.length; i++) {
      const point = path.points[i];
      pathStr += ` L ${point.x} ${point.y}`;
    }
    
    return pathStr;
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg style={styles.svg}>
        <Path
          d={createSvgPath(path)}
          stroke={path.color}
          strokeWidth={path.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

export default DrawPath;