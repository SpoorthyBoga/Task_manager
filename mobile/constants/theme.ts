export const THEME = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#09090B', 
  text: '#09090B',
  textMuted: '#71717A',
  accent: '#000000',
  red: '#EF4444',
  green: '#10B981',
  amber: '#F59E0B',
  amberSoft: '#FEF3C7',
  brandYellow: '#FEF3C7',
  
  // Pastel accents for cards
  cardBg1: '#FFFFFF',
  cardBg2: '#FEF3C7', 
  cardBg3: '#E0E7FF', 
};

export const STATUS_CONFIG = {
  'Done':        { color: THEME.green, icon: 'checkmark-circle' },
  'In Progress': { color: THEME.amber, icon: 'time' },
  'Not Started': { color: THEME.textMuted, icon: 'ellipse-outline' },
};