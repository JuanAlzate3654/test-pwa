import '@mui/material/styles';

import { alpha, type Components, createTheme, type PaletteColorOptions, type Theme } from '@mui/material/styles';
import type { CSSProperties } from 'react';

declare module '@mui/material/styles' {
    interface Palette {
        table: {
            selectedRow: Palette['primary'];
            borderRow: Palette['primary'];
        };
        border: Palette['primary'];
    }
    interface PaletteOptions {
        table?: {
            selectedRow?: PaletteColorOptions;
            borderRow?: PaletteColorOptions;
        };
        border?: PaletteColorOptions;
    }

    interface TypographyVariants {
        font1: CSSProperties['fontFamily'];
    }
    interface TypographyVariantsOptions {
        font1?: CSSProperties['fontFamily'];
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        font1: true;
    }
}

const defaultComponents: Components<Theme> = {
    MuiSelect: {
        defaultProps: {},
    },
    MuiInput: {
        defaultProps: { size: 'small' },
    },
    MuiList: {
        defaultProps: { dense: true },
    },
    MuiTable: {
        defaultProps: { size: 'small' },
    },
    MuiTextField: {
        defaultProps: { variant: 'outlined' },
    },
    MuiButton: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { textTransform: 'none' } },
    },
    MuiDivider: {
        defaultProps: { sx: { paddingTop: 0.5, paddingBottom: 0.5 } },
    },

    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundImage: 'none',
                backgroundColor: theme.palette.background.paper,
            }),
        },
    },
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[12],
            }),
        },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[8],
            }),
        },
    },
    MuiBackdrop: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(0,0,0,.35)',
                backdropFilter: 'blur(2px)',
            },
        },
    },
}

const baseTypography = {
    fontFamily: [
        'Helvetica Neue',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    font1: 'Helvetica Neue',
}

const tokens = {
    dark: {
        palette: {
            mode: 'dark' as const,
            primary: { main: '#5046DB', light: '#8146DB' },
            secondary: { main: '#B246DB' },
            background: { default: '#0b0f14', paper: '#131922' },
            divider: alpha('#ffffff', 0.12),
            border: { main: alpha('#ffffff', 0.12), labelColor: "#4a4e55" },
            table: {
                selectedRow: { main: '#f5bc1265' },
                borderRow: { main: alpha('#ffffff', 0.12) },
            },
        },
    },
    light: {
        palette: {
            mode: 'light' as const,
            primary: { main: '#f5bc12', light: 'rgba(245,188,18,0.55)' },
            secondary: { main: '#ffca2d' },
            background: { default: '#faf9f4', paper: '#fcfae1' },
            labelColor: "#c2c0ad",
            divider: '#f3f3f3',
            border: { main: '#565554', labelColor: "#c2c0ad" },
            table: {
                selectedRow: { main: '#f3f2f1' },
                borderRow: { main: '#f3f3f3' },
            },
        },
    },
}

export type ThemeMode = 'light' | 'dark'

export const createAppTheme = (mode: ThemeMode) =>
    createTheme({
        shape: { borderRadius: 8 },
        components: defaultComponents,
        typography: {
            ...baseTypography,
            fontSize: 12,
        },
        palette: tokens[mode].palette,
    })

export const lightTheme = createAppTheme('light')
export const darkTheme = createAppTheme('dark')