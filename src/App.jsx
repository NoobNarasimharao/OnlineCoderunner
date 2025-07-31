import React from 'react';
import { ThemeProvider } from './hooks/useTheme';
import Routes from './Routes';

function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}

export default App;