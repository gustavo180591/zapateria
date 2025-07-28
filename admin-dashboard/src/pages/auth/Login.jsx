import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the 'from' location if it exists, otherwise default to '/dashboard'
  const from = location.state?.from?.pathname || '/dashboard';

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Ingresa un correo electrónico válido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .required('La contraseña es requerida'),
  });

  // Form submission handler
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      
      try {
        await login({
          email: values.email,
          password: values.password,
        });
        
        // Redirect to the previous location or to the dashboard
        navigate(from, { replace: true });
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
      } finally {
        setLoading(false);
      }
    },
  });

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Login with ${provider}`);
    // For now, just show an alert
    alert(`Iniciar sesión con ${provider} se implementará próximamente`);
  };

  return (
    <Box>
      <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Iniciar sesión
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Social Login Buttons */}
      <Box sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleSocialLogin('Google')}
          startIcon={<GoogleIcon />}
          sx={{
            mb: 1.5,
            textTransform: 'none',
            py: 1.5,
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'text.secondary',
              backgroundColor: 'action.hover',
            },
          }}
        >
          Continuar con Google
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleSocialLogin('Facebook')}
            startIcon={<FacebookIcon color="primary" />}
            sx={{
              textTransform: 'none',
              py: 1.5,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'text.secondary',
                backgroundColor: 'action.hover',
              },
            }}
          >
            Facebook
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleSocialLogin('Twitter')}
            startIcon={<TwitterIcon color="info" />}
            sx={{
              textTransform: 'none',
              py: 1.5,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'text.secondary',
                backgroundColor: 'action.hover',
              },
            }}
          >
            Twitter
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="textSecondary" sx={{ px: 2 }}>
            O
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
      </Box>
      
      {/* Login Form */}
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                style={{
                  width: 16,
                  height: 16,
                  marginRight: 8,
                }}
              />
              <Typography variant="body2" color="textSecondary">
                Recordarme
              </Typography>
            </Box>
            
            <Link
              component={RouterLink}
              to="/auth/forgot-password"
              variant="body2"
              color="primary"
              underline="hover"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Box>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={loading || !formik.isValid}
          sx={{
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          ¿No tienes una cuenta?{' '}
          <Link
            component={RouterLink}
            to="/auth/register"
            color="primary"
            underline="hover"
            sx={{ fontWeight: 500 }}
          >
            Regístrate
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
