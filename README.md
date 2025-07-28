Sistema de Zapatería (Shoe-Order)
Descripción General
Shoe-Order es una plataforma integral para la gestión de una zapatería basada en pedidos, que permite la venta, personalización y administración de calzado. El sistema está construido con una arquitectura moderna y escalable, diseñada para ofrecer una experiencia fluida tanto a clientes como a administradores.
Estructura del Proyecto
El proyecto sigue una arquitectura modular y está organizado de la siguiente manera:
zapateria-online/
├── frontend/                # Aplicación cliente en React
├── backend/                 # API RESTful en Node.js/Express
├── mobile-app/              # Aplicación móvil en React Native
├── admin-dashboard/         # Panel de administración
├── database/                # Scripts y esquemas de base de datos
├── docs/                    # Documentación técnica y de usuario
├── infrastructure/          # Configuración de despliegue e infraestructura
├── tests/                   # Pruebas automatizadas
└── scripts/                 # Scripts de automatización

​
Componentes Principales
Frontend (/frontend)
Interfaz de usuario web desarrollada en React.js con las siguientes características:
Catálogo de Productos (/src/pages/Catalog.jsx): Visualización y filtrado avanzado de productos
Detalle de Producto (/src/pages/Product.jsx): Visualización detallada con imágenes de alta resolución y opciones de personalización
Herramienta de Personalización (/src/components/customization/ShoeDesigner.jsx): Editor interactivo para personalizar calzado
Carrito de Compras (/src/components/checkout/Cart.jsx): Gestión de artículos seleccionados
Proceso de Checkout (/src/pages/Checkout.jsx): Flujo de compra seguro y optimizado
Seguimiento de Pedidos (/src/pages/OrderTracking.jsx): Interfaz para monitorear el estado de fabricación y envío
El frontend utiliza Context API para la gestión de estado global (/src/context), servicios para comunicación con la API (/src/services) y componentes reutilizables (/src/components).
Backend (/backend)
Servidor API construido con Node.js y Express que gestiona la lógica de negocio:
API RESTful (/src/api/routes): Endpoints para todos los recursos del sistema
Controladores (/src/api/controllers): Manejo de solicitudes y respuestas HTTP
Servicios (/src/services): Lógica de negocio encapsulada
Modelos (/src/models): Definición de entidades y esquemas de datos
Middlewares (/src/api/middlewares): Funciones intermedias para autenticación, validación y manejo de errores
La estructura del backend sigue principios SOLID y está diseñada para escalar horizontalmente.
Aplicación Móvil (/mobile-app)
Versión nativa para dispositivos móviles desarrollada con React Native:
Experiencia optimizada para pantallas pequeñas
Funcionalidades principales disponibles en versión móvil
Notificaciones push para actualizaciones de pedidos
Panel de Administración (/admin-dashboard)
Interfaz dedicada para gestión interna:
Dashboard (/src/pages/Dashboard.jsx): Visualización de KPIs y métricas clave
Gestión de Pedidos (/src/pages/Orders.jsx): Administración del ciclo de vida completo de pedidos
Gestión de Productos (/src/pages/Products.jsx): CRUD de productos e inventario
Gestión de Clientes (/src/pages/Customers.jsx): Administración de usuarios y preferencias
Informes (/src/pages/Reports.jsx): Generación de reportes personalizables
Base de Datos (/database)
Scripts y esquemas para la persistencia de datos:
Esquemas (/schemas): Definición de tablas y relaciones
Migraciones (/migrations): Control de versiones de la estructura de datos
Seeds (/seeds): Datos iniciales para desarrollo y pruebas
Flujos Principales
Proceso de Compra
Exploración del Catálogo:
El cliente navega por categorías y filtros implementados en frontend/src/pages/Catalog.jsx
La búsqueda se procesa mediante backend/src/api/controllers/products.controller.js
Personalización:
El cliente puede personalizar el calzado usando frontend/src/components/customization/ShoeDesigner.jsx
Las opciones y precios se gestionan en backend/src/services/product.service.js
Gestión del Carrito:
Los productos se agregan al carrito mediante frontend/src/context/CartContext.js
El estado se sincroniza con backend/src/api/controllers/cart.controller.js
Checkout:
El proceso de pago se gestiona en frontend/src/pages/Checkout.jsx
La validación y procesamiento ocurren en backend/src/services/payment.service.js
Confirmación y Seguimiento:
La orden se confirma a través de backend/src/api/controllers/orders.controller.js
El cliente puede seguir su pedido mediante frontend/src/pages/OrderTracking.jsx
Proceso de Administración
Recepción de Pedidos:
Los nuevos pedidos aparecen en admin-dashboard/src/pages/Orders.jsx
Se procesan mediante backend/src/services/order.service.js
Gestión de Inventario:
El stock se actualiza automáticamente en admin-dashboard/src/pages/Inventory.jsx
La lógica se implementa en backend/src/services/inventory.service.js
Procesamiento de Pedidos:
El estado de fabricación se actualiza en admin-dashboard/src/pages/Orders.jsx
Las notificaciones se envían mediante backend/src/services/notification.service.js
Tecnologías Utilizadas
Frontend
React.js con Hooks y Context API
Redux para gestión de estado complejo
Styled-components para estilos
Axios para comunicación HTTP
React Router para navegación
Backend
Node.js con Express
PostgreSQL como base de datos principal
Redis para caché y sesiones
JWT para autenticación
Joi para validación de datos
Infraestructura
Docker y Docker Compose para contenedores
AWS (EC2, S3, RDS) para hosting
GitHub Actions para CI/CD
Nginx como proxy inverso
ELK Stack para logging centralizado
Instalación y Configuración
Requisitos Previos
Node.js v14.x o superior
PostgreSQL v12.x o superior
Redis v6.x o superior
Docker y Docker Compose
Git
Configuración de Desarrollo
# Clonar repositorio
git clone <https://github.com/company/zapateria-online.git>
cd zapateria-online

# Configurar variables de entorno
cp .env.example .env
# Editar .env según sea necesario

# Instalar dependencias
npm run install:all

# Iniciar servicios con Docker
docker-compose up -d

# Ejecutar migraciones
npm run migrate

# Cargar datos de prueba
npm run seed

# Iniciar todos los servicios en modo desarrollo
npm run dev

​
Estructura de Variables de Entorno (.env)
# Configuración General
NODE_ENV=development
PORT=3000

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zapateria
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h

# Pasarelas de Pago
STRIPE_API_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_id
PAYPAL_SECRET=your_paypal_secret

# AWS (Producción)
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
S3_BUCKET=zapateria-assets

​
Despliegue en Producción
El despliegue en producción se realiza a través de los scripts ubicados en /infrastructure:
# Configurar AWS CLI
aws configure

# Desplegar infraestructura
cd infrastructure
./deploy.sh production

​
El proceso de despliegue está automatizado mediante GitHub Actions, definido en .github/workflows/deploy.yml.
Pruebas
El proyecto incluye diferentes niveles de pruebas:
# Ejecutar todas las pruebas
npm test

# Pruebas unitarias
npm run test:unit

# Pruebas de integración
npm run test:integration

# Pruebas e2e
npm run test:e2e

​
Los tests se encuentran organizados en el directorio /tests siguiendo la misma estructura modular del proyecto.
Desarrollo y Contribución
Flujo de Trabajo Git
Crear una rama desde develop con el formato: feature/nombre-funcionalidad
Desarrollar y hacer commits siguiendo la convención de Conventional Commits
Abrir un Pull Request a develop
Después de revisión y aprobación, hacer merge
Estándares de Código
ESLint y Prettier configurados en .eslintrc y .prettierrc
Hooks de pre-commit para asegurar calidad de código
Documentación JSDoc requerida para funciones públicas
Mantenimiento
Logs y Monitoreo
Logs centralizados con ELK Stack
Monitoreo de rendimiento con New Relic
Alertas configuradas para eventos críticos
Backups
Los backups de la base de datos se realizan automáticamente:
Backups diarios incrementales
Backups semanales completos
Retención de 30 días
Los scripts de backup se encuentran en /scripts/backup.sh.
Soporte y Contacto
Soporte Técnico: support@shoe-order.com
Problemas: Abrir un issue en GitHub
Mejoras: Enviar pull request siguiendo las directrices de contribución
Licencia
Este proyecto está licenciado bajo MIT License - ver archivo LICENSE para detalles.
Desarrollado con ❤️ por el equipo Shoe-Order
Versión: 1.0.0
Última actualización: Julio 2025