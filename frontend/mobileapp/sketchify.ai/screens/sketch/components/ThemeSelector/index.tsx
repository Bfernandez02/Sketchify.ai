import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  Animated 
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { styles } from './styles';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (theme: 'minimalism' | 'realism' | 'nature') => void;
  isDark: boolean;
}

const themes = [
  {
    id: 'minimalism',
    label: 'Minimalism',
    image: require('@/assets/images/theme-minimalism.png'), // Make sure to add these images to your assets
  },
  {
    id: 'realism',
    label: 'Realism',
    image: require('@/assets/images/theme-realism.png'),
  },
  {
    id: 'nature',
    label: 'Nature',
    image: require('@/assets/images/theme-nature.png'),
  },
];

export default function CarouselThemeSelector({
  selectedTheme,
  onSelectTheme,
  isDark
}: ThemeSelectorProps) {
  const pagerRef = useRef<PagerView>(null);
  const [activePage, setActivePage] = useState(
    themes.findIndex(theme => theme.id === selectedTheme) || 0
  );

  const handlePageChange = (event: any) => {
    const newPage = event.nativeEvent.position;
    setActivePage(newPage);
    onSelectTheme(themes[newPage].id as 'minimalism' | 'realism' | 'nature');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <AnimatedPagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={activePage}
        orientation="horizontal"
        onPageSelected={handlePageChange}
      >
        {themes.map((theme) => (
          <View key={theme.id} style={styles.pageContainer}>
            <View style={styles.themeCard}>
              <Image source={theme.image} style={styles.themeImage} />
              <View style={styles.overlay} />
              <Text style={styles.themeLabel}>{theme.label}</Text>
            </View>
          </View>
        ))}
      </AnimatedPagerView>

      {/* Pagination indicators */}
      <View style={styles.paginationContainer}>
        {themes.map((theme, index) => (
          <TouchableOpacity
            key={theme.id}
            style={[
              styles.paginationDot,
              activePage === index && styles.activePaginationDot
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
