import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  InputBase, 
  Badge, 
  Menu, 
  MenuItem, 
  Avatar, 
  Box, 
  Typography, 
  Divider, 
  ListItemIcon,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState([
    { id: 1, text: 'Nuevo pedido recibido', time: 'Hace 5 minutos', read: false },
    { id: 2, text: 'Stock bajo en Zapatos deportivos', time: 'Hace 2 horas', read: false },
    { id: 3, text: 'Actualización del sistema completada', time: 'Ayer', read: true },
  ]);
  const [messages] = useState([
    { id: 1, text: 'Mensaje de soporte', time: 'Hace 30 minutos', read: false },
    { id: 2, text: 'Confirmación de envío', time: 'Hace 2 días', read: true },
  ]);
  const [darkMode, setDarkMode] = useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    handleMenuClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Aquí iría la lógica para cambiar el tema
    console.log('Cambiando a modo', darkMode ? 'claro' : 'oscuro');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        color: 'inherit',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Search Bar */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.black, 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.black, 0.1),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
              marginLeft: theme.spacing(3),
              width: 'auto',
            },
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon color="action" />
          </Box>
          <InputBase
            placeholder="Buscar..."
            sx={{
              color: 'inherit',
              padding: theme.spacing(1, 1, 1, 0),
              // Vertical padding + font size from searchIcon
              paddingLeft: `calc(1em + ${theme.spacing(4)})`,
              transition: theme.transitions.create('width'),
              width: '100%',
              [theme.breakpoints.up('md')]: {
                width: '20ch',
                '&:focus': {
                  width: '30ch',
                },
              },
            }}
            inputProps={{ 'aria-label': 'buscar' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Dark/Light Mode Toggle */}
          <Tooltip title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
            <IconButton 
              onClick={toggleDarkMode}
              color="inherit"
              sx={{ mr: 1 }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          {/* Messages */}
          <Tooltip title="Mensajes">
            <IconButton 
              color="inherit"
              aria-label="mostrar mensajes"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadMessages} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notificaciones">
            <IconButton 
              color="inherit"
              aria-label="mostrar notificaciones"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Configuración de la cuenta">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls="account-menu"
                aria-haspopup="true"
              >
                <Avatar 
                  alt={user?.name || 'Usuario'} 
                  src={user?.avatar} 
                  sx={{ width: 36, height: 36 }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {user?.name || 'Usuario'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
      
      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{user?.name || 'Usuario'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.email || 'usuario@ejemplo.com'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Mi perfil
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
