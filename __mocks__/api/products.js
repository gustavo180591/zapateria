// Simulate API response delay
const simulateDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Generate a unique ID for new products
let lastId = 10;
const generateId = () => ++lastId;

// In-memory database
const productsDb = [
  {
    id: 1,
    sku: 'ZP-001',
    name: 'Zapato Casual Hombre',
    description: 'Zapato casual para hombre en cuero sintético, cómodo y resistente para uso diario. Ideal para el uso en la oficina o salidas informales.',
    price: 599.99,
    originalPrice: 799.99,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'hombre',
    subcategory: 'casual',
    brand: 'Zapatería Elegante',
    colors: ['marrón', 'negro', 'azul marino'],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 45,
    rating: 4.5,
    reviews: 128,
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    tags: ['nuevo', 'oferta', 'tendencia', 'cuero'],
    specifications: {
      material: 'Cuero sintético',
      sole: 'Caucho',
      closure: 'Cordones',
      origin: 'México',
      care: 'Limpiar con paño húmedo',
      season: 'Todo el año',
      weight: '450g por pieza',
      warranty: '3 meses'
    },
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-07-20T14:25:00Z'
  },
  {
    id: 2,
    sku: 'ZP-002',
    name: 'Tacones Elegantes',
    description: 'Tacones altos para mujer con diseño elegante y cómodo para todo el día. Perfectos para eventos formales o salidas nocturnas.',
    price: 899.99,
    originalPrice: 1099.99,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55a2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55a2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'mujer',
    subcategory: 'tacones',
    brand: 'Moda Femenina',
    colors: ['rojo', 'negro', 'nude', 'blanco'],
    sizes: [35, 36, 37, 38, 39],
    stock: 28,
    rating: 4.7,
    reviews: 92,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    tags: ['elegante', 'fiesta', 'tacón alto', 'vestir'],
    specifications: {
      material: 'Piel sintética',
      heelHeight: '10 cm',
      platform: '2 cm',
      closure: 'Tira en tobillo',
      origin: 'España',
      care: 'No lavar en lavadora',
      season: 'Otoño/Invierno',
      weight: '320g por pieza',
      warranty: '2 meses'
    },
    createdAt: '2024-11-10T09:15:00Z',
    updatedAt: '2025-07-15T11:20:00Z'
  },
  {
    id: 3,
    sku: 'ZP-003',
    name: 'Zapatillas Deportivas',
    description: 'Zapatillas deportivas ultraligeras con tecnología de amortiguación para máximo rendimiento en carrera.',
    price: 1299.99,
    originalPrice: 1499.99,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'deportes',
    subcategory: 'running',
    brand: 'SportMax',
    colors: ['negro', 'azul', 'rojo'],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    stock: 32,
    rating: 4.8,
    reviews: 215,
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    tags: ['running', 'deporte', 'tecnología', 'nuevo'],
    specifications: {
      material: 'Malla transpirable',
      sole: 'EVA de alta densidad',
      closure: 'Cordones',
      origin: 'Estados Unidos',
      care: 'Lavar a mano con agua fría',
      season: 'Todo el año',
      weight: '280g por pieza',
      warranty: '6 meses',
      technology: 'Amortiguación AirMax'
    },
    createdAt: '2025-05-12T08:20:00Z',
    updatedAt: '2025-07-18T16:45:00Z'
  },
  {
    id: 4,
    sku: 'ZP-004',
    name: 'Botas de Cuero',
    description: 'Botas de cuero genuino para hombre con forro de lana para mayor calidez en invierno.',
    price: 1599.99,
    originalPrice: 1799.99,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1549291981-56d443d5e2a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'hombre',
    subcategory: 'botas',
    brand: 'LeatherCraft',
    colors: ['marrón', 'negro'],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 18,
    rating: 4.6,
    reviews: 87,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    tags: ['invierno', 'cuero', 'abrigado', 'estilo'],
    specifications: {
      material: 'Cuero genuino',
      lining: 'Lana',
      sole: 'Caucho antideslizante',
      origin: 'Italia',
      care: 'Limpiar con crema para cuero',
      season: 'Invierno',
      weight: '850g por par',
      warranty: '12 meses',
      waterproof: 'Sí'
    },
    createdAt: '2024-10-05T11:30:00Z',
    updatedAt: '2025-07-10T09:15:00Z'
  },
  {
    id: 5,
    sku: 'ZP-005',
    name: 'Sandalias Playa',
    description: 'Sandalias cómodas y ligeras ideales para la playa o piscina. Resistentes al agua y de secado rápido.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571859856639-4cbb0e063beb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'unisex',
    subcategory: 'sandalias',
    brand: 'BeachLife',
    colors: ['azul', 'negro', 'rojo', 'amarillo'],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    stock: 64,
    rating: 4.3,
    reviews: 156,
    isNew: true,
    isFeatured: false,
    isOnSale: true,
    inStock: true,
    tags: ['playa', 'verano', 'agua', 'ligero'],
    specifications: {
      material: 'EVA moldeado',
      sole: 'Antideslizante',
      closure: 'Ajustable',
      origin: 'Brasil',
      care: 'Enjuagar con agua dulce',
      season: 'Verano',
      weight: '180g por par',
      warranty: '3 meses',
      waterproof: 'Sí',
      quickDry: true
    },
    createdAt: '2025-03-20T14:10:00Z',
    updatedAt: '2025-07-22T10:30:00Z'
  },
  {
    id: 6,
    sku: 'ZP-006',
    name: 'Mocasines de Cuero',
    description: 'Mocasines elegantes para hombre en cuero italiano, ideales para ocasiones formales o de negocios.',
    price: 1299.99,
    originalPrice: 1499.99,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1597008641621-4c8d62e071a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'hombre',
    subcategory: 'mocasines',
    brand: 'ItalianStyle',
    colors: ['negro', 'marrón', 'azul marino'],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 24,
    rating: 4.7,
    reviews: 93,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    tags: ['formal', 'cuero', 'elegante', 'negocios'],
    specifications: {
      material: 'Cuero italiano',
      sole: 'Cuero',
      closure: 'Sin cordones',
      origin: 'Italia',
      care: 'Limpiar con crema para cuero',
      season: 'Todo el año',
      weight: '320g por pieza',
      warranty: '6 meses'
    },
    createdAt: '2025-02-18T10:15:00Z',
    updatedAt: '2025-07-15T14:30:00Z'
  },
  {
    id: 7,
    sku: 'ZP-007',
    name: 'Zapatillas Urbanas',
    description: 'Zapatillas urbanas con estilo moderno y cómodo para el día a día en la ciudad.',
    price: 799.99,
    originalPrice: 899.99,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'unisex',
    subcategory: 'urbano',
    brand: 'UrbanWalk',
    colors: ['negro', 'blanco', 'gris', 'azul'],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44],
    stock: 52,
    rating: 4.4,
    reviews: 178,
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    tags: ['urbano', 'moda', 'cómodo', 'casual'],
    specifications: {
      material: 'Tela y sintético',
      sole: 'Caucho',
      closure: 'Cordones',
      origin: 'México',
      care: 'Limpieza en seco',
      season: 'Todo el año',
      weight: '350g por pieza',
      warranty: '3 meses'
    },
    createdAt: '2025-06-10T09:20:00Z',
    updatedAt: '2025-07-20T11:45:00Z'
  },
  {
    id: 8,
    sku: 'ZP-008',
    name: 'Botines de Cuero',
    description: 'Botines de cuero para mujer con tacón bajo, ideales para combinar con todo tipo de looks.',
    price: 1099.99,
    originalPrice: 1299.99,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55a2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'mujer',
    subcategory: 'botines',
    brand: 'FashionStep',
    colors: ['negro', 'marrón', 'vino'],
    sizes: [35, 36, 37, 38, 39],
    stock: 19,
    rating: 4.6,
    reviews: 87,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    tags: ['invierno', 'cuero', 'elegante', 'tacón bajo'],
    specifications: {
      material: 'Cuero sintético',
      heelHeight: '4 cm',
      sole: 'Goma',
      origin: 'España',
      care: 'Limpiar con paño húmedo',
      season: 'Otoño/Invierno',
      weight: '420g por pieza',
      warranty: '4 meses'
    },
    createdAt: '2024-09-15T11:30:00Z',
    updatedAt: '2025-07-12T16:20:00Z'
  },
  {
    id: 9,
    sku: 'ZP-009',
    name: 'Zapatos de Vestir',
    description: 'Zapatos formales de vestir para hombre en cuero italiano de alta calidad.',
    price: 1499.99,
    originalPrice: 1699.99,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'hombre',
    subcategory: 'vestir',
    brand: 'Elegance',
    colors: ['negro', 'marrón'],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    stock: 15,
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    inStock: true,
    tags: ['formal', 'boda', 'trabajo', 'cuero italiano'],
    specifications: {
      material: 'Cuero italiano premium',
      sole: 'Cuero',
      closure: 'Cordones',
      origin: 'Italia',
      care: 'Limpiar con crema para cuero',
      season: 'Todo el año',
      weight: '480g por pieza',
      warranty: '12 meses'
    },
    createdAt: '2024-08-20T10:45:00Z',
    updatedAt: '2025-07-10T14:15:00Z'
  },
  {
    id: 10,
    sku: 'ZP-010',
    name: 'Sandalias con Plataforma',
    description: 'Sandalias con plataforma para mujer, cómodas y a la moda para el verano.',
    price: 599.99,
    originalPrice: 749.99,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1571859856639-4cbb0e063beb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'mujer',
    subcategory: 'sandalias',
    brand: 'SummerStyle',
    colors: ['blanco', 'negro', 'dorado', 'plateado'],
    sizes: [35, 36, 37, 38, 39],
    stock: 42,
    rating: 4.2,
    reviews: 136,
    isNew: true,
    isFeatured: false,
    isOnSale: true,
    inStock: true,
    tags: ['verano', 'plataforma', 'moda', 'playa'],
    specifications: {
      material: 'Sintético',
      platform: '5 cm',
      heelHeight: '8 cm',
      closure: 'Tiras ajustables',
      origin: 'Brasil',
      care: 'Limpiar con paño húmedo',
      season: 'Verano',
      weight: '380g por par',
      warranty: '3 meses'
    },
    createdAt: '2025-04-15T13:20:00Z',
    updatedAt: '2025-07-18T10:30:00Z'
  }
];

// API Methods
const productApi = {
  // Get all products with optional filters
  async getAll(filters = {}) {
    await simulateDelay();
    
    let result = [...productsDb];
    
    // Apply filters
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    
    if (filters.subcategory) {
      result = result.filter(p => p.subcategory === filters.subcategory);
    }
    
    if (filters.isOnSale) {
      result = result.filter(p => p.isOnSale);
    }
    
    if (filters.isNew) {
      result = result.filter(p => p.isNew);
    }
    
    if (filters.isFeatured) {
      result = result.filter(p => p.isFeatured);
    }
    
    if (filters.minPrice) {
      result = result.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sort results
    if (filters.sortBy) {
      const [field, order] = filters.sortBy.split('_');
      result.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: result.slice(startIndex, endIndex),
      pagination: {
        total: result.length,
        page,
        totalPages: Math.ceil(result.length / limit),
        limit
      }
    };
  },
  
  // Get product by ID
  async getById(id) {
    await simulateDelay();
    const product = productsDb.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  },
  
  // Get related products
  async getRelated(productId, limit = 4) {
    await simulateDelay();
    const product = await this.getById(productId);
    return productsDb
      .filter(p => 
        p.id !== product.id && 
        (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, limit);
  },
  
  // Create new product
  async create(productData) {
    await simulateDelay();
    
    const newProduct = {
      id: generateId(),
      sku: `ZP-${String(generateId()).padStart(3, '0')}`,
      ...productData,
      isNew: true,
      inStock: productData.stock > 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    productsDb.push(newProduct);
    return newProduct;
  },
  
  // Update product
  async update(id, updates) {
    await simulateDelay();
    
    const index = productsDb.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    const updatedProduct = {
      ...productsDb[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      inStock: updates.stock !== undefined ? updates.stock > 0 : productsDb[index].inStock
    };
    
    productsDb[index] = updatedProduct;
    return updatedProduct;
  },
  
  // Delete product
  async delete(id) {
    await simulateDelay();
    
    const index = productsDb.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    return productsDb.splice(index, 1)[0];
  },
  
  // Get featured products
  async getFeatured(limit = 6) {
    await simulateDelay();
    return productsDb
      .filter(p => p.isFeatured)
      .slice(0, limit);
  },
  
  // Get new arrivals
  async getNewArrivals(limit = 6) {
    await simulateDelay();
    return [...productsDb]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },
  
  // Get products on sale
  async getOnSale(limit = 6) {
    await simulateDelay();
    return productsDb
      .filter(p => p.isOnSale)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, limit);
  },
  
  // Get categories
  async getCategories() {
    await simulateDelay(100, 300);
    const categories = [...new Set(productsDb.map(p => p.category))];
    return categories.map(category => ({
      name: category,
      count: productsDb.filter(p => p.category === category).length,
      subcategories: [...new Set(
        productsDb
          .filter(p => p.category === category)
          .map(p => p.subcategory)
      )]
    }));
  },
  
  // Get brands
  async getBrands() {
    await simulateDelay(100, 300);
    const brands = [...new Set(productsDb.map(p => p.brand))];
    return brands.map(brand => ({
      name: brand,
      count: productsDb.filter(p => p.brand === brand).length
    }));
  },
  
  // Search products
  async search(query, limit = 10) {
    await simulateDelay();
    const searchTerm = query.toLowerCase();
    
    return productsDb
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .slice(0, limit);
  }
};

export default productApi;
