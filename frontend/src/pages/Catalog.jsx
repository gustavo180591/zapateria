import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ShoppingCart as ShoppingCartIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';

// Datos de ejemplo (reemplazar con llamadas a la API real)
const products = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Zapato ${i + 1}`,
  price: Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000,
  category: ['Hombre', 'Mujer', 'Niños', 'Deportes', 'Formales'][Math.floor(Math.random() * 5)],
  rating: Math.floor(Math.random() * 3) + 3, // 3-5 estrellas
  image: `https://via.placeholder.com/300x200?text=Zapato+${i + 1}`,
  inStock: Math.random() > 0.2, // 80% de probabilidad de estar en stock
  isNew: Math.random() > 0.7, // 30% de probabilidad de ser nuevo
  discount: Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 10 : 0, // 30% de probabilidad de tener descuento
}));

const categories = ['Hombre', 'Mujer', 'Niños', 'Deportes', 'Formales'];
const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Vans', 'Converse'];
const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const Catalog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Aplicar filtros
  const filteredProducts = products.filter((product) => {
    // Filtro por término de búsqueda
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categorías
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.includes(product.category);
    
    // Filtro por rango de precios
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    // Filtro por marcas (simulado)
    const matchesBrands = selectedBrands.length === 0 || 
      selectedBrands.some(brand => product.name.toLowerCase().includes(brand.toLowerCase()));
    
    // Filtro por tallas (simulado)
    const matchesSizes = selectedSizes.length === 0;
    
    return matchesSearch && matchesCategories && matchesPrice && matchesBrands && matchesSizes;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Manejar cambios en los filtros
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
    setCurrentPage(1);
  };

  // Filtros para móviles
  const renderMobileFilters = () => (
    <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
      <Button
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={() => setMobileFiltersOpen(true)}
        fullWidth
      >
        Filtros
      </Button>

      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filtros</Typography>
            <Button onClick={() => setMobileFiltersOpen(false)}>Aplicar</Button>
          </Box>
          {renderFilters()}
        </Box>
      </Drawer>
    </Box>
  );

  // Filtros para escritorio
  const renderDesktopFilters = () => (
    <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
      {renderFilters()}
    </Box>
  );

  // Componente de filtros reutilizable
  const renderFilters = () => (
    <Box>
      {/* Categorías */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Categorías
        </Typography>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  size="small"
                />
              }
              label={`${category} (${products.filter(p => p.category === category).length})`}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Marcas */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Marcas
        </Typography>
        <FormGroup>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  size="small"
                />
              }
              label={brand}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Precio */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Rango de Precio
        </Typography>
        <Box sx={{ px: 2, mt: 4 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={30000}
            valueLabelFormat={(value) => `$${value.toLocaleString('es-AR')}`}
            sx={{
              '& .MuiSlider-valueLabel': {
                backgroundColor: 'primary.main',
                borderRadius: 1,
                p: 1,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[0].toLocaleString('es-AR')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[1].toLocaleString('es-AR')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tallas */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Tallas
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sizes.map((size) => (
            <Chip
              key={size}
              label={size}
              onClick={() => handleSizeChange(size)}
              variant={selectedSizes.includes(size) ? 'filled' : 'outlined'}
              color={selectedSizes.includes(size) ? 'primary' : 'default'}
              sx={{ minWidth: 40, cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Catálogo de Productos
      </Typography>

      {/* Barra de búsqueda y ordenación */}
      <Box sx={{ mb: 4 }}>
        <Box 
          component="form" 
          onSubmit={handleSearch}
          sx={{ display: 'flex', gap: 2, mb: 3 }}
        >
          <TextField
            fullWidth
            placeholder="Buscar productos..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Buscar
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {filteredProducts.length} productos encontrados
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Ordenar por:</Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="sort-by-label">Ordenar por</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Ordenar por"
              >
                <MenuItem value="relevance">Relevancia</MenuItem>
                <MenuItem value="price-asc">Precio: menor a mayor</MenuItem>
                <MenuItem value="price-desc">Precio: mayor a menor</MenuItem>
                <MenuItem value="rating">Mejor valorados</MenuItem>
                <MenuItem value="newest">Más recientes</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filtros */}
        <Grid item xs={12} md={3}>
          {isMobile ? renderMobileFilters() : renderDesktopFilters()}
        </Grid>

        {/* Productos */}
        <Grid item xs={12} md={9}>
          {currentProducts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {currentProducts.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3,
                        },
                        position: 'relative',
                      }}
                    >
                      {/* Etiquetas */}
                      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1, display: 'flex', gap: 1 }}>
                        {product.isNew && (
                          <Chip 
                            label="Nuevo" 
                            color="primary" 
                            size="small" 
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                        {product.discount > 0 && (
                          <Chip 
                            label={`-${product.discount}%`} 
                            color="secondary" 
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                        {!product.inStock && (
                          <Chip 
                            label="Sin stock" 
                            color="default" 
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="subtitle1" component="h3" noWrap>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {[...Array(5)].map((_, i) => (
                            <Box 
                              key={i} 
                              component="span" 
                              sx={{ color: i < product.rating ? '#ffc107' : '#e0e0e0' }}
                            >
                              ★
                            </Box>
                          ))}
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({Math.floor(Math.random() * 100)})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${(product.price * (1 - product.discount / 100)).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                          </Typography>
                          {product.discount > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              ${product.price.toLocaleString('es-AR')}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body2" color={product.inStock ? 'success.main' : 'error'}>
                          {product.inStock ? 'En stock' : 'Sin stock'}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          color="primary"
                          component={RouterLink}
                          to={`/product/${product.id}`}
                          fullWidth
                          variant="outlined"
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          fullWidth
                          startIcon={<ShoppingCartIcon />}
                          disabled={!product.inStock}
                        >
                          Añadir
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Paginación */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No se encontraron productos
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                No hay productos que coincidan con tus criterios de búsqueda.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setSelectedSizes([]);
                  setPriceRange([0, 30000]);
                  setSortBy('relevance');
                  setCurrentPage(1);
                }}
              >
                Limpiar filtros
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Catalog;
