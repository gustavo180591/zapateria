# Sistema de Zapatería Online (Shoe-Order)

## Descripción General

Shoe-Order es un sistema completo para la gestión de una zapatería basada en pedidos. Esta plataforma integra todas las funcionalidades necesarias para la venta, personalización, seguimiento y administración de pedidos de calzado, ofreciendo una experiencia fluida tanto para clientes como para administradores.

## Características Principales

### Para Clientes
- **Catálogo de Productos**: Exploración de zapatos por categoría, estilo, marca, talla y precio.
- **Personalización de Calzado**: Herramienta interactiva para personalizar colores, materiales y detalles.
- **Gestión de Cuenta**: Registro, historial de pedidos y preferencias de usuario.
- **Carrito de Compras**: Almacenamiento temporal de selecciones para finalizar compra.
- **Proceso de Pago Seguro**: Múltiples métodos de pago y procesamiento seguro.
- **Seguimiento de Pedidos**: Sistema en tiempo real para monitorear el estado de fabricación y envío.
- **Reseñas y Valoraciones**: Posibilidad de calificar productos y compartir experiencias.

### Para Administradores
- **Panel de Control**: Estadísticas en tiempo real de ventas, pedidos y actividad del sitio.
- **Gestión de Productos**: Herramientas para añadir, modificar y eliminar productos del catálogo.
- **Gestión de Inventario**: Control de stock, alertas de niveles bajos y gestión de proveedores.
- **Procesamiento de Pedidos**: Flujo de trabajo para procesar, fabricar y enviar pedidos.
- **Gestión de Clientes**: Base de datos de usuarios con historial de compras y preferencias.
- **Informes y Análisis**: Reportes detallados de ventas, tendencias y rendimiento.
- **Gestión de Marketing**: Herramientas para campañas, descuentos y programas de fidelización.

## Arquitectura Técnica

### Frontend
- **Tecnologías**: React.js, Redux, HTML5, CSS3, JavaScript ES6+
- **Diseño Responsivo**: Adaptación a dispositivos móviles, tablets y escritorio
- **Optimización de Rendimiento**: Lazy loading, code splitting y caching avanzado
- **Accesibilidad**: Cumplimiento con estándares WCAG 2.1

### Backend
- **Framework**: Node.js con Express.js
- **API RESTful**: Endpoints documentados con Swagger
- **Autenticación**: JWT con renovación de tokens y OAuth 2.0
- **Validación**: Middleware para validación de entradas y sanitización

### Base de Datos
- **Principal**: PostgreSQL para datos relacionales (usuarios, productos, pedidos)
- **Caché**: Redis para almacenamiento en memoria y sesiones
- **Indexación**: Elasticsearch para búsqueda avanzada de productos

### Seguridad
- **Cifrado**: SSL/TLS para todas las comunicaciones
- **Protección de Datos**: Cumplimiento con GDPR y normativas locales
- **Prevención**: Protección contra XSS, CSRF, inyección SQL y ataques DDoS
- **Auditoría**: Registro detallado de acciones y cambios en el sistema

### Infraestructura
- **Hosting**: Despliegue en AWS con servicios EC2, S3, RDS y CloudFront
- **Contenedores**: Docker para empaquetado y orquestación con Kubernetes
- **CI/CD**: Integración continua con GitHub Actions
- **Monitoreo**: Implementación de ELK Stack para logs y New Relic para rendimiento

## Módulos Detallados

### 1. Sistema de Usuarios
- Registro con verificación por email
- Autenticación con múltiples métodos (email/password, Google, Facebook)
- Gestión de perfiles con preferencias de talla, estilo y notificaciones
- Sistema de recuperación de contraseñas y bloqueo por intentos fallidos

### 2. Catálogo de Productos
- Estructura jerárquica de categorías y subcategorías
- Sistema de filtrado avanzado por múltiples atributos
- Visualización de productos con zoom y rotación 360°
- Generación dinámica de URLs amigables para SEO

### 3. Motor de Personalización
- Interfaz interactiva para modificar partes del calzado
- Visualización en tiempo real de cambios
- Cálculo dinámico de precios según personalizaciones
- Guardado de diseños para uso posterior

### 4. Sistema de Pedidos
- Validación de disponibilidad en tiempo real
- Cálculo preciso de tiempos de fabricación y entrega
- Notificaciones de cambios de estado por email/SMS
- Integración con sistemas de logística y seguimiento

### 5. Pasarela de Pagos
- Soporte para tarjetas de crédito/débito
- Integración con MercadoPago, PayPal, y transferencias bancarias
- Tokenización de datos sensibles para mayor seguridad
- Facturación electrónica automatizada

### 6. Sistema de Inventario
- Control en tiempo real de materiales y productos terminados
- Predicción de demanda basada en históricos y tendencias
- Alertas automatizadas para reposición
- Integración con proveedores para pedidos automáticos

### 7. CRM y Marketing
- Segmentación de clientes por comportamiento y preferencias
- Campañas personalizadas por email y notificaciones push
- Programa de fidelización con puntos y descuentos
- Análisis de efectividad de campañas y ROI

### 8. Analítica y Reportes
- Dashboard con KPIs clave del negocio
- Informes exportables en múltiples formatos
- Análisis de comportamiento de usuarios y embudos de conversión
- Predicciones de ventas y tendencias

## Flujos de Trabajo

### Proceso de Compra
1. El cliente navega por el catálogo o crea un diseño personalizado
2. Añade productos al carrito y ajusta cantidades/tallas
3. Procede al checkout ingresando dirección de envío
4. Selecciona método de pago y confirma la orden
5. Recibe confirmación por email con detalles y número de seguimiento

### Fabricación y Envío
1. El sistema notifica al taller sobre nuevos pedidos
2. Se asignan los pedidos a artesanos según tipo y prioridad
3. El estado del pedido se actualiza en cada fase de producción
4. Control de calidad verifica el producto terminado
5. Se empaca y envía con integración automática con transportistas
6. Cliente recibe notificaciones de cambios de estado

### Devoluciones
1. Cliente solicita devolución desde su perfil
2. Se genera etiqueta de devolución pre-pagada
3. El sistema actualiza inventario al recibir el producto
4. Proceso automatizado de reembolso según política

## Instalación y Configuración

### Requisitos Previos
- Node.js (v14+)
- PostgreSQL (v12+)
- Redis (v6+)
- Docker y Docker Compose
- AWS CLI (para despliegue en producción)

### Instalación Local
```bash
# Clonar repositorio
git clone https://github.com/gustavo180591/zapateria.git
cd zapateria

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con configuraciones locales

# Iniciar servicios con Docker
docker-compose up -d

# Ejecutar migraciones
npm run migrate

# Cargar datos iniciales
npm run seed

# Iniciar aplicación en modo desarrollo
npm run dev
