import { colors as colorsImport, darkColors as darkColorsImport } from './colors';
import { typography as typographyImport } from './typography';
import { spacing as spacingImport } from './spacing';

export const colors = colorsImport;
export const darkColors = darkColorsImport;
export const typography = typographyImport;
export const spacing = spacingImport;

export const theme = {
  colors: colorsImport,
  typography: typographyImport,
  spacing: spacingImport,
};

export type Theme = typeof theme;
