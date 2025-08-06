import React from 'react';
import { ThemeProvider } from './hooks/useTheme';
import CodeRunner from './pages/CodeRunner';

function App() {
  return (
    <ThemeProvider>
      <CodeRunner />
    </ThemeProvider>
  );
}

export default App;