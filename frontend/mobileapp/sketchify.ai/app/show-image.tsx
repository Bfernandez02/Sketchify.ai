import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import ShowImageScreen from '@/screens/show-image';

export default function ShowImageRoute() {
  const params = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ShowImageScreen 
        imageData={params.imageData as string} 
        promptText={params.promptText as string} 
      />
    </>
  );
}