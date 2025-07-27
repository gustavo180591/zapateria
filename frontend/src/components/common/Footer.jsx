import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Empresa', links: ['Sobre Nosotros', 'Trabaja con Nosotros', 'Sostenibilidad'] },
    { title: 'Ayuda', links: ['Preguntas Frecuentes', 'Envíos', 'Devoluciones', 'Guía de Tallas'] },
    { title: 'Legal', links: ['Términos y Condiciones', 'Política de Privacidad', 'Aviso Legal', 'Cookies'] },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <TwitterIcon />, url: 'https://twitter.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
  ];

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', mt: 'auto' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Logo y descripción */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              ZAPATERÍA
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Tu tienda de zapatos de confianza. Ofrecemos la mejor calidad y estilo para todos los gustos y ocasiones.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Enlaces rápidos */}
          {footerLinks.map((column) => (
            <Grid item xs={12} sm={4} md={2} key={column.title}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {column.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      component={RouterLink}
                      to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      color="text.secondary"
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        py: 0.5,
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contacto */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contacto
            </Typography>
            <Box component="address" sx={{ fontStyle: 'normal' }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Calle Falsa 123<br />
                Buenos Aires, Argentina<br />
                CP 1001
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Email: info@zapateria.com<br />
                Tel: +54 11 1234-5678
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Zapatería. Todos los derechos reservados.
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Pagos seguros con:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              <span>💳</span>
              <span>📱</span>
              <span>🏦</span>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
