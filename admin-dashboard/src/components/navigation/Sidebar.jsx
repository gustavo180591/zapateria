import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Collapse,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Category as ProductsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  LocalOffer as DiscountsIcon,
  AccountCircle as UsersIcon,
  Store as StoreIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const Sidebar = ({ open, mobileOpen, handleDrawerClose, handleDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState({});

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Productos',
      icon: <ProductsIcon />,
      path: '/products',
      subItems: [
        { text: 'Todos los productos', path: '/products' },
        { text: 'Categorías', path: '/products/categories' },
        { text: 'Inventario', path: '/products/inventory' },
      ],
    },
    {
      text: 'Pedidos',
      icon: <OrdersIcon />,
      path: '/orders',
      subItems: [
        { text: 'Todos los pedidos', path: '/orders' },
        { text: 'Nuevo pedido', path: '/orders/new' },
      ],
    },
    {
      text: 'Clientes',
      icon: <CustomersIcon />,
      path: '/customers',
    },
    {
      text: 'Reportes',
      icon: <ReportsIcon />,
      path: '/reports',
    },
    {
      text: 'Descuentos',
      icon: <DiscountsIcon />,
      path: '/discounts',
    },
    {
      text: 'Usuarios',
      icon: <UsersIcon />,
      path: '/users',
      adminOnly: true,
    },
    {
      text: 'Tiendas',
      icon: <StoreIcon />,
      path: '/stores',
      adminOnly: true,
    },
  ];

  const handleClick = (text) => {
    setOpenSubMenu((prevOpen) => ({
      ...prevOpen,
      [text]: !prevOpen[text],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box>
      {/* Logo and Close Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
        }}
      >
        <Box
          component={RouterLink}
          to="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              height: 40,
              width: 'auto',
              marginRight: 1,
            }}
          />
          <Typography variant="h6" noWrap component="div">
            Zapatería Admin
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      
      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <div key={item.text}>
            <ListItem 
              disablePadding 
              sx={{ display: 'block' }}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                onClick={() => {
                  if (item.subItems) {
                    handleClick(item.text);
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    color: isActive(item.path) ? 'primary' : 'inherit',
                    fontWeight: isActive(item.path) ? 'medium' : 'regular',
                  }}
                  sx={{ opacity: open ? 1 : 0 }}
                />
                {item.subItems && (
                  openSubMenu[item.text] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            
            {/* Submenu Items */}
            {item.subItems && (
              <Collapse in={openSubMenu[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      component={RouterLink}
                      to={subItem.path}
                      selected={isActive(subItem.path)}
                      sx={{
                        pl: 4,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.action.selected,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        },
                      }}
                    >
                      <ListItemText 
                        primary={subItem.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: isActive(subItem.path) ? 'primary' : 'inherit',
                          fontWeight: isActive(subItem.path) ? 'medium' : 'regular',
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
      
      <Divider />
      
      {/* Settings */}
      <List>
        <ListItemButton
          component={RouterLink}
          to="/settings"
          selected={isActive('/settings')}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: isActive('/settings') ? theme.palette.primary.main : 'inherit',
            }}
          >
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Configuración"
            primaryTypographyProps={{
              color: isActive('/settings') ? 'primary' : 'inherit',
              fontWeight: isActive('/settings') ? 'medium' : 'regular',
            }}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 'none',
            backgroundColor: theme.palette.background.paper,
            ...(!open && {
              width: theme.spacing(7),
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
