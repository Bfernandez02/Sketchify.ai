import SketchScreen from '@/screens/sketch';
import { Stack } from 'expo-router';

export default function Sketch() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerBackVisible: false, 
        }} 
      />
      <SketchScreen />
    </>
  );
}
