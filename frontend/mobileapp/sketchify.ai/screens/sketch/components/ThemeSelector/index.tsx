import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { ThemeType, THEMES } from '@/types/themes';
import { styles } from './styles';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface ThemeSelectorProps {
  selectedTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
}

export default function ThemeSelector({
  selectedTheme,
  onSelectTheme,
}: ThemeSelectorProps) {
  const pagerRef = useRef<PagerView>(null);
  const [activePage, setActivePage] = useState(
    THEMES.findIndex((theme) => theme.id === selectedTheme) || 0
  );

  const handlePageChange = (event: any) => {
    const newPage = event.nativeEvent.position;
    setActivePage(newPage);
    onSelectTheme(THEMES[newPage].id);
  };

  return (
    <View style={styles.container}>
      <AnimatedPagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={activePage}
        orientation='horizontal'
        onPageSelected={handlePageChange}
      >
        {THEMES.map((theme) => (
          <View key={theme.id} style={styles.pageContainer}>
            <View style={styles.themeCard}>
              <Image source={theme.image} style={styles.themeImage} />
              <View style={styles.overlay} />
              <Text style={styles.themeLabel}>{theme.label}</Text>
            </View>
          </View>
        ))}
      </AnimatedPagerView>

      <View style={styles.paginationContainer}>
        {THEMES.map((theme, index) => (
          <TouchableOpacity
            key={theme.id}
            style={[
              styles.paginationDot,
              activePage === index && styles.activePaginationDot,
            ]}
            onPress={() => {
              pagerRef.current?.setPage(index);
            }}
          />
        ))}
      </View>
    </View>
  );
}