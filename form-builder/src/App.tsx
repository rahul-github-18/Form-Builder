import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import formReducer from './store/formSlice';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';

const theme = createTheme();

const store = configureStore({
  reducer: {
    forms: formReducer,
  },
});

function Navigation() {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => navigate('/create')}>Create</Button>
        <Button color="inherit" onClick={() => navigate('/preview')}>Preview</Button>
        <Button color="inherit" onClick={() => navigate('/myforms')}>My Forms</Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Navigation />
          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/create" element={<CreateForm />} />
              <Route path="/preview" element={<PreviewForm />} />
              <Route path="/myforms" element={<MyForms />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
