import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from './styles';

interface HeaderProps {
  colorScheme: string | undefined;
}

const Header: React.FC<HeaderProps> = ({ colorScheme }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconSymbol size={24} name="arrow.left" color={Colors[colorScheme ?? 'light'].text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
        Sketch Creator
      </Text>
      <TouchableOpacity 
        style={styles.helpButton}
        onPress={() => Alert.alert("Help", "Draw on the canvas and tap 'Enhance' to transform your sketch into art using AI.")}
      >
        <IconSymbol size={20} name="questionmark.circle" color={Colors[colorScheme ?? 'light'].text} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;