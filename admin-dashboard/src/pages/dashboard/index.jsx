import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  CircularProgress,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  AttachMoney as RevenueIcon,
  Inventory as ProductsIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowForward as ArrowForwardIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Register ChartJS components
ChartJS.register(...registerables);

// Mock data - In a real app, this would come from an API
const summaryData = {
  totalSales: {
    value: '$24,780',
    change: 12.5,
    isIncrease: true,
  },
  totalOrders: {
    value: '1,245',
    change: -2.3,
    isIncrease: false,
  },
  totalCustomers: {
    value: '1,845',
    change: 8.1,
    isIncrease: true,
  },
  totalProducts: {
    value: '1,024',
    change: 4.2,
    isIncrease: true,
  },
};

const recentOrders = [
  {
    id: '#ORD-0001',
    customer: 'Juan Pérez',
    product: 'Zapatos deportivos',
    date: new Date(2023, 5, 15, 10, 30),
    amount: 89.99,
    status: 'completed',
    avatar: '/avatars/1.jpg',
  },
  {
    id: '#ORD-0002',
    customer: 'María García',
    product: 'Botas de cuero',
    date: new Date(2023, 5, 14, 14, 45),
    amount: 129.99,
    status: 'processing',
    avatar: '/avatars/2.jpg',
  },
  {
    id: '#ORD-0003',
    customer: 'Carlos López',
    product: 'Sandalias',
    date: new Date(2023, 5, 14, 9, 15),
    amount: 45.99,
    status: 'shipped',
    avatar: '/avatars/3.jpg',
  },
  {
    id: '#ORD-0004',
    customer: 'Ana Martínez',
    product: 'Zapatillas casuales',
    date: new Date(2023, 5, 13, 16, 20),
    amount: 65.50,
    status: 'pending',
    avatar: '/avatars/4.jpg',
  },
  {
    id: '#ORD-0005',
    customer: 'David Rodríguez',
    product: 'Zapatos formales',
    date: new Date(2023, 5, 12, 11, 10),
    amount: 99.99,
    status: 'cancelled',
    avatar: '/avatars/5.jpg',
  },
];

// Chart data
const salesData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Ventas 2023',
      data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
      fill: false,
      backgroundColor: 'rgba(25, 118, 210, 0.8)',
      borderColor: 'rgba(25, 118, 210, 1)',
      tension: 0.4,
    },
    {
      label: 'Ventas 2022',
      data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86],
      fill: false,
      backgroundColor: 'rgba(156, 39, 176, 0.8)',
      borderColor: 'rgba(156, 39, 176, 1)',
      tension: 0.4,
    },
  ],
};

const categoryData = {
  labels: ['Zapatillas', 'Botas', 'Sandalias', 'Zapatos formales', 'Zapatos casuales'],
  datasets: [
    {
      data: [300, 150, 100, 200, 250],
      backgroundColor: [
        'rgba(25, 118, 210, 0.8)',
        'rgba(156, 39, 176, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(233, 30, 99, 0.8)',
      ],
      borderColor: [
        'rgba(25, 118, 210, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(233, 30, 99, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const statusData = {
  labels: ['Completados', 'En proceso', 'Enviados', 'Pendientes', 'Cancelados'],
  datasets: [
    {
      data: [65, 15, 10, 5, 5],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(33, 150, 243, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(158, 158, 158, 0.8)',
        'rgba(244, 67, 54, 0.8)',
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(158, 158, 158, 1)',
        'rgba(244, 67, 54, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      padding: 12,
      cornerRadius: 4,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      },
      ticks: {
        callback: function(value) {
          return '$' + value;
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      padding: 12,
      cornerRadius: 4,
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

// Status chip component
const StatusChip = ({ status }) => {
  const statusConfig = {
    completed: {
      label: 'Completado',
      color: 'success',
      icon: <CheckCircleIcon fontSize="small" />,
    },
    processing: {
      label: 'En proceso',
      color: 'info',
      icon: <PendingIcon fontSize="small" />,
    },
    shipped: {
      label: 'Enviado',
      color: 'warning',
      icon: <ShippingIcon fontSize="small" />,
    },
    pending: {
      label: 'Pendiente',
      color: 'default',
      icon: <PendingIcon fontSize="small" />,
    },
    cancelled: {
      label: 'Cancelado',
      color: 'error',
      icon: <CancelIcon fontSize="small" />,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Chip
      size="small"
      label={config.label}
      color={config.color}
      icon={config.icon}
      sx={{ minWidth: 100 }}
    />
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, change, isIncrease, icon: Icon, color = 'primary' }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
              {value}
            </Typography>
            <Box display="flex" alignItems="center">
              {isIncrease ? (
                <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: isIncrease ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              >
                {change}% {isIncrease ? 'más' : 'menos'} que el mes pasado
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon fontSize="large" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Order Row Actions Menu
const OrderRowActions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Marcar como completado</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ShippingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Marcar como enviado</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cancelar pedido</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // In a real app, you would fetch this data from an API
  // const { data, isLoading, error } = useQuery('dashboardData', fetchDashboardData);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Panel de Control
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Bienvenido de nuevo, Admin. Aquí tienes un resumen de tu negocio.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<TrendingUpIcon />}
          sx={{ textTransform: 'none', borderRadius: 2, px: 3, py: 1 }}
        >
          Generar informe
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Ventas Totales"
            value={summaryData.totalSales.value}
            change={summaryData.totalSales.change}
            isIncrease={summaryData.totalSales.isIncrease}
            icon={RevenueIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Pedidos"
            value={summaryData.totalOrders.value}
            change={summaryData.totalOrders.change}
            isIncrease={summaryData.totalOrders.isIncrease}
            icon={OrdersIcon}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Clientes"
            value={summaryData.totalCustomers.value}
            change={summaryData.totalCustomers.change}
            isIncrease={summaryData.totalCustomers.isIncrease}
            icon={CustomersIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Productos"
            value={summaryData.totalProducts.value}
            change={summaryData.totalProducts.change}
            isIncrease={summaryData.totalProducts.isIncrease}
            icon={ProductsIcon}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardHeader
              title="Ventas Anuales"
              subheader="Comparación entre 2022 y 2023"
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Ver detalles
                </Button>
              }
            />
            <Divider />
            <Box sx={{ p: 3, height: 350 }}>
              <Line data={salesData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>

        {/* Status Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardHeader 
              title="Estado de Pedidos" 
              subheader="Distribución por estado"
            />
            <Divider />
            <Box sx={{ p: 3, height: 350 }}>
              <Pie data={statusData} options={pieOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders & Categories */}
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardHeader
              title="Pedidos Recientes"
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Ver todos
                </Button>
              }
            />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pedido</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            src={order.avatar} 
                            alt={order.customer}
                            sx={{ width: 32, height: 32, mr: 1.5 }}
                          />
                          <Typography variant="body2">
                            {order.customer}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {order.product}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(order.date, 'dd MMM yyyy', { locale: es })}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {format(order.date, 'HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          ${order.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>
                      <TableCell align="right">
                        <OrderRowActions />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Categories Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
            <CardHeader 
              title="Ventas por Categoría" 
              subheader="Distribución de ventas por categoría"
            />
            <Divider />
            <Box sx={{ p: 3, height: 300 }}>
              <Pie data={categoryData} options={pieOptions} />
            </Box>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardHeader 
              title="Actividad Reciente" 
              subheader="Últimas actividades en el sistema"
            />
            <Divider />
            <Box sx={{ p: 2 }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Nuevo pedido recibido
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Hace {item * 2}h
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    El pedido #ORD-00{item * 100} ha sido realizado por un cliente.
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      size="small" 
                      label="Ver detalles" 
                      color="primary" 
                      variant="outlined"
                      clickable
                    />
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(), 'dd MMM yyyy', { locale: es })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Box textAlign="center" mt={1}>
                <Button size="small" color="primary">
                  Ver toda la actividad
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
