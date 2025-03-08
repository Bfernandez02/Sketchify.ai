// DrawPath.tsx
import React from 'react';
import { View } from 'react-native';
import { DrawingPath } from '../models';

export const DrawPath: React.FC<{ path: DrawingPath }> = ({ path }) => {
  const { points, color, width } = path;
  
  if (points.length < 2) return null;

  return (
    <View style={{ position: 'absolute' }}>
      {points.map((point, index) => {
        if (index === 0) return null;
        const prevPoint = points[index - 1];
        
        const dx = point.x - prevPoint.x;
        const dy = point.y - prevPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.5) return null;

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
          <View
            key={`${index}-${point.x}-${point.y}`}
            style={{
              position: 'absolute',
              left: prevPoint.x,
              top: prevPoint.y,
              width: distance,
              height: width,
              backgroundColor: color,
              transform: [
                { translateY: -width / 2 },
                { rotate: `${angle}deg` },
              ],
            }}
          />
        );
      })}
    </View>
  );
};