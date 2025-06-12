import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Breakpoints for responsive design
export const breakpoints = {
  small: 320,
  medium: 768,
  large: 1024,
  extraLarge: 1200,
};

// Device type detection
export const isSmallDevice = width <= breakpoints.small;
export const isMediumDevice = width > breakpoints.small && width <= breakpoints.medium;
export const isLargeDevice = width > breakpoints.medium && width <= breakpoints.large;
export const isExtraLargeDevice = width > breakpoints.large;

// Responsive values based on screen size
export const getResponsiveValue = (small: number, medium?: number, large?: number, extraLarge?: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium || small;
  if (isLargeDevice) return large || medium || small;
  return extraLarge || large || medium || small;
};

// Font sizes
export const fontSize = {
  xs: getResponsiveValue(10, 11, 12, 13),
  sm: getResponsiveValue(12, 13, 14, 15),
  base: getResponsiveValue(14, 15, 16, 17),
  lg: getResponsiveValue(16, 17, 18, 19),
  xl: getResponsiveValue(18, 19, 20, 21),
  '2xl': getResponsiveValue(20, 22, 24, 26),
  '3xl': getResponsiveValue(24, 26, 28, 30),
  '4xl': getResponsiveValue(28, 32, 36, 40),
};

// Spacing
export const spacing = {
  xs: getResponsiveValue(4, 6, 8, 10),
  sm: getResponsiveValue(8, 10, 12, 14),
  md: getResponsiveValue(12, 14, 16, 18),
  lg: getResponsiveValue(16, 18, 20, 22),
  xl: getResponsiveValue(20, 22, 24, 26),
  '2xl': getResponsiveValue(24, 28, 32, 36),
  '3xl': getResponsiveValue(32, 36, 40, 44),
};

// Icon sizes
export const iconSize = {
  xs: getResponsiveValue(12, 14, 16, 18),
  sm: getResponsiveValue(16, 18, 20, 22),
  md: getResponsiveValue(20, 22, 24, 26),
  lg: getResponsiveValue(24, 26, 28, 30),
  xl: getResponsiveValue(28, 30, 32, 34),
};

export const screenWidth = width;
export const screenHeight = height;
