import { createTheme } from '@mui/material/styles';

const palette = {
  mode: 'light',
  primary: {
    main: '#FFB6C1',
    contrastText: '#3A2A36',
  },
  secondary: {
    main: '#B5EAD7',
    contrastText: '#3A2A36',
  },
  warning: {
    main: '#FFDAC1',
    contrastText: '#3A2A36',
  },
  error: {
    main: '#FF8FA3',
    contrastText: '#3A2A36',
  },
  success: {
    main: '#A8E6CF',
    contrastText: '#3A2A36',
  },
  background: {
    default: '#FFF8F0',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#3A2A36',
    secondary: '#5A4B55',
  },
};

const theme = createTheme({
  palette,
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Nunito", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
  },
});

export default theme;
