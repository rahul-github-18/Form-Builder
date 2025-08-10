import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  AppBar, Toolbar, Button, Container, Typography, Box, Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import formReducer from './store/formSlice';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';

const theme = createTheme({
  palette: {
    primary: { main: '#6C63FF' }, // purple-blue
    secondary: { main: '#FF6584' }, // pink accent
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
});

const store = configureStore({
  reducer: { forms: formReducer },
});

function Navigation() {
  const navigate = useNavigate();
  const navButtons = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Create', icon: <AddCircleOutlineIcon />, path: '/create' },
    { label: 'Preview', icon: <VisibilityIcon />, path: '/preview' },
    { label: 'My Forms', icon: <AssignmentIcon />, path: '/myforms' },
  ];

  return (
    <motion.div initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #6C63FF 0%, #3B82F6 100%)',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Form Builder
          </Typography>
          {navButtons.map((btn) => (
            <Button
              key={btn.label}
              color="inherit"
              startIcon={btn.icon}
              onClick={() => navigate(btn.path)}
              sx={{
                mx: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {btn.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

function BodyNavigation() {
  const navigate = useNavigate();
  return (
    <Stack direction="row" spacing={3}>
      <Button
        variant="contained"
        onClick={() => navigate('/create')}
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          borderRadius: 2,
          background: 'linear-gradient(90deg, #6C63FF, #42a5f5)',
          boxShadow: '0 4px 14px rgba(108,99,255,0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 20px rgba(108,99,255,0.5)',
          },
        }}
      >
        Create Form
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<VisibilityIcon />}
        onClick={() => navigate('/preview')}
        sx={{
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          borderRadius: 2,
          borderWidth: 2,
          transition: 'all 0.3s ease',
          '&:hover': { borderWidth: 2, transform: 'scale(1.05)' },
        }}
      >
        Preview Form
      </Button>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<AssignmentIcon />}
        onClick={() => navigate('/myforms')}
        sx={{
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          borderRadius: 2,
          boxShadow: '0 4px 14px rgba(255,101,132,0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 20px rgba(255,101,132,0.5)',
          },
        }}
      >
        My Forms
      </Button>
    </Stack>
  );
}

function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BodyNavigation />
      </Box>
    </motion.div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Navigation />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Container
              sx={{
                mt: 4,
                p: 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
                minHeight: '80vh',
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreateForm />} />
                <Route path="/preview" element={<PreviewForm />} />
                <Route path="/myforms" element={<MyForms />} />
              </Routes>
            </Container>
          </motion.div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
