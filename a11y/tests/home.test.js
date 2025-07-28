import React from 'react';
import { render, screen, testA11y } from '../../test-utils';
import { axe } from 'jest-axe';

// Mock de componentes que podrían estar en la página de inicio
const HomePage = () => (
  <main>
    <h1>Bienvenido a Zapatería Online</h1>
    
    <nav aria-label="Navegación principal">
      <ul>
        <li><a href="/hombres">Hombres</a></li>
        <li><a href="/mujeres">Mujeres</a></li>
        <li><a href="/ninos">Niños</a></li>
        <li><a href="/ofertas">Ofertas</a></li>
      </ul>
    </nav>

    <section aria-labelledby="destacados">
      <h2 id="destacados">Productos Destacados</h2>
      <div className="product-grid">
        {[1, 2, 3].map((item) => (
          <article key={item} className="product-card">
            <img 
              src={`/product-${item}.jpg`} 
              alt={`Zapato destacado ${item}`} 
              width="300"
              height="200"
            />
            <h3>Zapato de moda {item}</h3>
            <p>Precio: ${(1000 * item).toLocaleString()}</p>
            <button>Agregar al carrito</button>
          </article>
        ))}
      </div>
    </section>

    <section aria-labelledby="novedades">
      <h2 id="novedades">Novedades</h2>
      <div className="newsletter">
        <p>Suscríbete para recibir las últimas novedades</p>
        <form>
          <label htmlFor="email">Correo electrónico:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="tu@email.com"
            required 
          />
          <button type="submit">Suscribirse</button>
        </form>
      </div>
    </section>
  </main>
);

describe('Home Page Accessibility', () => {
  test('should be accessible', async () => {
    const { container } = render(<HomePage />);
    
    // Verificar que los elementos principales estén presentes
    expect(screen.getByRole('heading', { name: /bienvenido a zapatería online/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /productos destacados/i })).toBeInTheDocument();
    
    // Verificar accesibilidad con axe
    const results = await axe(container, {
      rules: {
        'region': { enabled: false },
        'landmark-one-main': { enabled: false },
        'page-has-heading-one': { enabled: false },
      },
    });
    
    expect(results).toHaveNoViolations();
  });

  test('navigation should be accessible', async () => {
    render(<HomePage />);
    
    // Verificar que la navegación tenga los enlaces correctos
    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(4);
    expect(navLinks[0]).toHaveTextContent('Hombres');
    expect(navLinks[1]).toHaveTextContent('Mujeres');
    expect(navLinks[2]).toHaveTextContent('Niños');
    expect(navLinks[3]).toHaveTextContent('Ofertas');
  });

  test('product cards should be accessible', async () => {
    render(<HomePage />);
    
    // Verificar que las tarjetas de producto sean accesibles
    const productImages = screen.getAllByRole('img');
    expect(productImages).toHaveLength(3);
    
    productImages.forEach((img, index) => {
      expect(img).toHaveAttribute('alt');
      expect(img.alt).toContain('Zapato destacado');
    });
    
    const buttons = screen.getAllByRole('button', { name: /agregar al carrito/i });
    expect(buttons).toHaveLength(3);
  });

  test('newsletter form should be accessible', async () => {
    render(<HomePage />);
    
    // Verificar que el formulario de newsletter sea accesible
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    
    const submitButton = screen.getByRole('button', { name: /suscribirse/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});