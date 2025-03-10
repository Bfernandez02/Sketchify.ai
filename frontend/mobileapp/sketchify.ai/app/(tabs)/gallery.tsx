import React from 'react';
import { Stack } from 'expo-router';
import GalleryScreen from '@/screens/gallery';

export default function GalleryRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GalleryScreen />
    </>
  );
}