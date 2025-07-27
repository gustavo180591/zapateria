import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

// Imágenes de ejemplo (reemplazar con tus propias imágenes)
const featuredProducts = [
  {
    id: 1,
    name: 'Zapatillas Deportivas',
    price: 8999,
    image: 'https://via.placeholder.com/300x200?text=Zapatillas+Deportivas',
  },
  {
    id: 2,
    name: 'Zapatos Formales',
    price: 7599,
    image: 'https://via.placeholder.com/300x200?text=Zapatos+Formales',
  },
  {
    id: 3,
    name: 'Botas',
    price: 10999,
    image: 'https://via.placeholder.com/300x200?text=Botas',
  },
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 15,
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
        }}
        style={{
          backgroundImage: 'url(https://via.placeholder.com/1920x600?text=Zapatería+Otoño+2023)',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Bienvenido a Zapatería
          </Typography>
          <Typography variant="h5" paragraph>
            Descubre nuestra nueva colección de otoño 2023
          </Typography>
          <Button
            component={RouterLink}
            to="/catalog"
            variant="contained"
            size="large"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ mt: 3 }}
          >
            Ver Colección
          </Button>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
          Productos Destacados
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" paragraph>
          Descubre nuestros productos más populares
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
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
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${product.price.toLocaleString('es-AR')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    size="small"
                    color="primary"
                    component={RouterLink}
                    to={`/product/${product.id}`}
                    fullWidth
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    startIcon={<ShoppingCartIcon />}
                    fullWidth
                  >
                    Añadir al Carrito
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={RouterLink}
            to="/catalog"
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
          >
            Ver Todos los Productos
          </Button>
        </Box>
      </Container>

      {/* Features */}
      <Box bgcolor="background.paper" py={8}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                Calidad Garantizada
              </Typography>
              <Typography variant="body1" paragraph>
                En Zapatería nos enorgullece ofrecer productos de la más alta calidad, fabricados con materiales duraderos y cómodos.
              </Typography>
              <Typography variant="body1" paragraph>
                Cada par de zapatos es cuidadosamente seleccionado para asegurar la máxima satisfacción de nuestros clientes.
              </Typography>
              <Button
                component={RouterLink}
                to="/about"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Conocé más
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src="https://via.placeholder.com/600x400?text=Calidad+Garantizada"
                alt="Calidad Garantizada"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Newsletter */}
      <Box bgcolor="primary.main" color="white" py={8}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Suscríbete a nuestro Newsletter
          </Typography>
          <Typography variant="body1" paragraph>
            Recibí ofertas exclusivas y novedades directamente en tu correo electrónico.
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
              maxWidth: 600,
              mx: 'auto',
              mt: 4,
            }}
          >
            <input
              type="email"
              placeholder="Tu correo electrónico"
              style={{
                flexGrow: 1,
                padding: '12px 16px',
                borderRadius: '4px',
                border: 'none',
                fontSize: '1rem',
              }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ whiteSpace: 'nowrap' }}
            >
              Suscribirse
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
