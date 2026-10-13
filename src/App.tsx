import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Editor from '@monaco-editor/react';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [health, setHealth] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simple health check against the backend API
    fetch('/api/health')
      .then((res) => res.text())
      .then((text) => {
        setHealth(text);
        setLoading(false);
      })
      .catch(() => {
        setHealth('unavailable');
        setLoading(false);
      });
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply Tailwind dark class to <html>
    const html = document.documentElement;
    if (!darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OENEXA AI Engineer
          </Typography>
          <IconButton color="inherit" onClick={toggleDarkMode} aria-label="toggle dark mode">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1">Backend health: {loading ? <CircularProgress size={14} /> : health}</Typography>
      </Box>

      <Box sx={{ p: 2, height: '70vh' }}>
        <Editor
          height="100%"
          defaultLanguage="java"
          defaultValue="// Start coding with AI assistance..."
          theme={darkMode ? 'vs-dark' : 'light'}
        />
      </Box>
    </Box>
  );
};

export default App;
