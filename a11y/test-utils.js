import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

// Tema por defecto para los tests
const defaultTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000',
  },
  fonts: {
    primary: 'Arial, sans-serif',
    secondary: '"Helvetica Neue", Arial, sans-serif',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
};

// Función de renderizado personalizado
const render = (ui, { theme = defaultTheme, ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <Router>
        {children}
      </Router>
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

// Función para probar accesibilidad
const testA11y = async (ui, options = {}) => {
  const { container, ...rest } = render(ui, options);
  const results = await axe(container, {
    rules: {
      // Deshabilitar reglas específicas si es necesario
      'region': { enabled: false },
      'landmark-one-main': { enabled: false },
      'page-has-heading-one': { enabled: false },
      'link-name': { enabled: false },
    },
  });
  
  expect(results).toHaveNoViolations();
  
  return {
    container,
    ...rest,
    results,
  };
};

// Re-exportar todo desde @testing-library/react
export * from '@testing-library/react';

// Sobrescribir el método render
export { render, testA11y };

// Exportar axe para usos personalizados
export { axe, toHaveNoViolations };
