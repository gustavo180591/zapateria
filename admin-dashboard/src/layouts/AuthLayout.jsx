import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Left side - Form */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '100%', md: '50%' },
          p: 3,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 450,
            mx: 'auto',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{
                height: 50,
                width: 'auto',
                mr: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Zapatería
            </Typography>
          </Box>

          {/* Auth Form */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              p: { xs: 3, sm: 4 },
              width: '100%',
            }}
          >
            <Outlet />
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Zapatería. Todos los derechos reservados.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Banner */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '50%',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            opacity: 0.9,
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: 'white',
            }}
          >
            Bienvenido al Panel de Administración
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: '80%',
            }}
          >
            Gestiona tu inventario, pedidos y clientes de manera eficiente con nuestra plataforma de administración.
          </Typography>
          
          {/* Features */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 3,
              mt: 4,
              width: '100%',
              maxWidth: 600,
            }}
          >
            {[
              {
                icon: '📊',
                title: 'Análisis en Tiempo Real',
                description: 'Métricas actualizadas al instante',
              },
              {
                icon: '📦',
                title: 'Gestión de Inventario',
                description: 'Control total de tu catálogo',
              },
              {
                icon: '🛒',
                title: 'Pedidos',
                description: 'Seguimiento en tiempo real',
              },
              {
                icon: '👥',
                title: 'Clientes',
                description: 'Gestiona la información de tus clientes',
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {feature.icon}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
