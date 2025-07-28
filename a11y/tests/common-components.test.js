import React from 'react';
import { render, testA11y } from '../test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('Common Components Accessibility', () => {
  // Prueba de accesibilidad para botones
  test('buttons should be accessible', async () => {
    const { container } = render(
      <button type="button">Click me</button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Prueba de accesibilidad para enlaces
  test('links should be accessible', async () => {
    const { container } = render(
      <a href="/test">Test Link</a>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Prueba de accesibilidad para formularios
  test('forms should be accessible', async () => {
    const { container } = render(
      <form>
        <label htmlFor="username">Username:</label>
        <input id="username" type="text" />
        <button type="submit">Submit</button>
      </form>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Prueba de contraste de color
  test('should have sufficient color contrast', async () => {
    const { container } = render(
      <div style={{ color: '#000', backgroundColor: '#fff' }}>
        High contrast text
      </div>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Prueba de imágenes con texto alternativo
  test('images should have alt text', async () => {
    const { container } = render(
      <img src="test.jpg" alt="Descriptive text" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
