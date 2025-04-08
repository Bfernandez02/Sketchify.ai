
export type ThemeType = 'minimalism' | 'realism' | 'nature' | 'anime' | 'cartoon';

// Theme data interface
export interface ThemeData {
  id: ThemeType;
  label: string;
  image: any; // For image requires
  description?: string;
}

// Available themes array with all theme data
export const THEMES: ThemeData[] = [
  {
    id: 'minimalism',
    label: 'Minimalism',
    image: require('@/assets/images/min.jpg'),
    description: 'Clean, simple designs with minimal elements'
  },
  {
    id: 'realism',
    label: 'Realism',
    image: require('@/assets/images/rea.jpg'),
    description: 'True-to-life representation with detail and accuracy'
  },
  {
    id: 'nature',
    label: 'Nature',
    image: require('@/assets/images/abs.jpg'),
    description: 'Organic elements and natural landscapes'
  },
  {
    id: 'anime',
    label: 'Anime',
    image: require('@/assets/images/anime.jpg'), 
    description: 'Japanese animation style with distinctive features'
  },
  {
    id: 'cartoon',
    label: 'Cartoon',
    image: require('@/assets/images/cartoon.webp'), 
    description: 'Stylized, simplified illustrations with bold outlines'
  }
];

// Default theme
export const DEFAULT_THEME: ThemeType = 'minimalism';

// Helper functions
export const getThemeById = (id: ThemeType): ThemeData | undefined => {
  return THEMES.find(theme => theme.id === id);
};

export const getAvailableThemeIds = (): ThemeType[] => {
  return THEMES.map(theme => theme.id);
};