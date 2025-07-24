# 👟 Sistema de Gestión para Zapatería a Pedido

> **Documentación Oficial** - Este documento es la fuente de verdad del proyecto. Todo el equipo debe seguir estrictamente las pautas aquí establecidas.

## 📋 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Requisitos Previos](#-requisitos-previos)
- [Configuración Inicial](#-configuración-inicial)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Convenciones de Código](#-convenciones-de-código)
- [Guía de Desarrollo](#-guía-de-desarrollo)
- [Base de Datos](#-base-de-datos)
- [API](#-api)
- [Despliegue](#-despliegue)
- [Testing](#-testing)
- [Contribución](#-contribución)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## 🌟 Visión General

Sistema integral para la gestión de pedidos personalizados de calzado, diseñado para optimizar el flujo de trabajo desde la solicitud hasta la entrega final.

### 🎯 Objetivos Principales

1. Automatizar el proceso de pedidos personalizados
2. Mejorar la comunicación con los clientes
3. Optimizar la gestión de inventario y producción
4. Proporcionar métricas en tiempo real
5. Garantizar escalabilidad y mantenibilidad

---

## 🖥️ Requisitos Previos

- Node.js 18+ (Recomendado: LTS)
- PostgreSQL 14+
- npm 9+ o yarn 1.22+
- Git 2.25+
- Editor de código (VS Code recomendado)
- Cuenta en Cloudinary (para almacenamiento de imágenes)

### 🛠️ Instalación de Dependencias

```bash
# Instalar Node.js (usando nvm - recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install --lts
nvm use --lts

# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Verificar instalaciones
node --version
npm --version
git --version
psql --version
```

---

## ⚙️ Configuración Inicial

1. **Clonar el repositorio**

```bash
git clone https://github.com/gustavo180591/zapateria.git
cd zapateria
```

2. **Instalar dependencias**

```bash
# Instalar dependencias globales
npm install -g @sveltejs/kit @prisma/cli

# Instalar dependencias del proyecto
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/zapateria?schema=public"

# JWT
JWT_SECRET="tu_super_secreto_jwt"
JWT_EXPIRES_IN="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email (Ejemplo con SendGrid)
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY=""
EMAIL_FROM="no-reply@tuzapateria.com"

# WhatsApp (Opcional)
WHATSAPP_ENABLED=false
WHATSAPP_API_KEY=""
WHATSAPP_PHONE_NUMBER_ID=""
```

4. **Configurar base de datos**

```bash
# Crear base de datos (PostgreSQL)
sudo -u postgres createdb zapateria

# Ejecutar migraciones
npx prisma migrate dev --name init

# Poblar datos iniciales (opcional)
npm run db:seed
```

5. **Iniciar servidores**

```bash
# Modo desarrollo (frontend + backend)
npm run dev

# O por separado:
# Backend
npm run dev:server

# Frontend
npm run dev:client
```

---

## 📁 Estructura del Proyecto

```
zapateria/
├── .github/              # Configuraciones de GitHub (CI, workflows)
│   └── workflows/
│       └── ci-cd.yml
│
├── backend/              # API REST con Express
│   ├── config/          # Configuraciones
│   ├── controllers/     # Lógica de negocio
│   ├── middlewares/     # Middlewares de Express
│   ├── models/          # Modelos de base de datos
│   ├── routes/          # Rutas de la API
│   ├── services/        # Servicios y lógica de negocio
│   ├── utils/           # Utilidades
│   └── app.js           # Punto de entrada
│
├── frontend/            # Aplicación SvelteKit
│   ├── src/
│   │   ├── lib/        # Código compartido
│   │   ├── routes/     # Rutas de la aplicación
│   │   ├── stores/     # Stores de Svelte
│   │   └── app.html    # Plantilla HTML base
│   └── svelte.config.js
│
├── prisma/              # Esquema de base de datos
│   ├── migrations/      # Migraciones
│   ├── schema.prisma   # Esquema principal
│   └── seed.ts         # Datos iniciales
│
├── public/              # Archivos estáticos
│   ├── images/         # Imágenes globales
│   └── favicon.ico     # Favicon
│
├── scripts/             # Scripts de utilidad
│   ├── db/             # Scripts de base de datos
│   └── deploy/         # Scripts de despliegue
│
├── tests/               # Pruebas automatizadas
│   ├── unit/           # Pruebas unitarias
│   ├── integration/    # Pruebas de integración
│   └── e2e/            # Pruebas de extremo a extremo
│
├── .editorconfig        # Configuración de estilos de código
├── .eslintrc.js         # Configuración de ESLint
├── .gitignore          # Archivos ignorados por Git
├── .prettierrc         # Configuración de Prettier
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

---

## 📝 Convenciones de Código

### Estructura de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(ámbito): descripción breve

Cuerpo opcional con más detalles

Pie de página opcional con referencias a issues
```

Ejemplos:
```
feat(auth): agregar autenticación con Google
fix(api): corregir error 500 en endpoint de pedidos
docs(readme): actualizar instrucciones de instalación
```

### Nombrado

- **Variables y funciones**: `camelCase`
- **Clases y Tipos**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Archivos**: `kebab-case`
- **Componentes**: `PascalCase` (ej: `UserProfile.svelte`)

### Estilo de Código

- Usar punto y coma al final de las sentencias
- Comillas simples para strings (`'texto'`)
- 2 espacios para indentación
- Máximo 80 caracteres por línea
- Comentar el código en inglés

### Estructura de Componentes (Svelte)

```svelte
<script>
  // 1. Imports
  import { onMount } from 'svelte';
  
  // 2. Props
  export let name = 'Invitado';
  
  // 3. Variables reactivas
  let count = 0;
  
  // 4. Funciones
  function increment() {
    count += 1;
  }
  
  // 5. Ciclo de vida
  onMount(() => {
    console.log('Componente montado');
  });
</script>

<!-- 6. HTML -->
<div class="greeting">
  <h1>Hola, {name}!</h1>
  <button on:click={increment}>
    Clickeado {count} {count === 1 ? 'vez' : 'veces'}
  </button>
</div>

<!-- 7. Estilos -->
<style>
  .greeting {
    padding: 1rem;
    text-align: center;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
</style>
```

---

## 🛠️ Guía de Desarrollo

### Flujo de Trabajo Git

1. **Sincronizar con el repositorio remoto**

```bash
git fetch origin
git checkout main
git pull origin main
```

2. **Crear una rama para la nueva característica**

```bash
git checkout -b feature/nombre-de-la-caracteristica
```

3. **Hacer commits siguiendo las convenciones**

```bash
git add .
git commit -m "feat(pedidos): agregar formulario de pedido"
```

4. **Subir cambios al repositorio remoto**

```bash
git push -u origin feature/nombre-de-la-caracteristica
```

5. **Crear un Pull Request (PR)**
   - Ir a GitHub y crear un PR desde tu rama a `main`
   - Asignar revisores
   - Corregir los comentarios si es necesario
   - Mergear cuando sea aprobado

### Scripts de NPM

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "nodemon backend/app.js",
    "dev:client": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .js,.svelte --fix",
    "format": "prettier --write .",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "node prisma/seed.js",
    "db:studio": "prisma studio"
  }
}
```

---

## 🗃️ Base de Datos

### Esquema Principal

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        String    @id @default(uuid())
  email     String    @unique
  nombre    String
  apellido  String
  password  String
  rol       Rol       @default(CLIENTE)
  telefono  String?
  direccion String?
  pedidos   Pedido[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Pedido {
  id          String     @id @default(uuid())
  cliente     Usuario    @relation(fields: [clienteId], references: [id])
  clienteId   String
  productos   Json       // Array de productos con cantidades
  estado      EstadoPedido @default(RECIBIDO)
  total       Float
  senia       Float?     // Seña opcional
  fechaEntrega DateTime?
  notas       String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Rol {
  ADMIN
  VENDEDOR
  TALLER
  CLIENTE
}

enum EstadoPedido {
  RECIBIDO
  EN_PROCESO
  LISTO_PARA_ENTREGA
  ENTREGADO
  CANCELADO
}
```

### Migraciones

Para crear una nueva migración después de cambiar el esquema:

```bash
npx prisma migrate dev --name descripcion_cambios
```

### Prisma Studio

Para explorar y editar la base de datos visualmente:

```bash
npx prisma studio
```

---

## 🌐 API

### Autenticación

Todas las rutas (excepto login/registro) requieren autenticación mediante JWT.

```http
GET /api/pedidos
Authorization: Bearer tu_token_jwt_aquí
```

### Endpoints Principales

#### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener información del usuario actual

#### Pedidos

- `GET /api/pedidos` - Listar todos los pedidos (con filtros)
- `POST /api/pedidos` - Crear nuevo pedido
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `PUT /api/pedidos/:id` - Actualizar pedido
- `DELETE /api/pedidos/:id` - Eliminar pedido (solo admin)
- `PUT /api/pedidos/:id/estado` - Actualizar estado del pedido

#### Usuarios

- `GET /api/usuarios` - Listar usuarios (solo admin)
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario (solo admin)

### Documentación Swagger

La documentación interactiva de la API está disponible en:

```
http://localhost:3000/api-docs
```

---

## 🚀 Despliegue

### Requisitos para Producción

- Servidor con Node.js 18+
- Base de datos PostgreSQL
- Servidor SMTP para correos
- Cuenta en Cloudinary
- Dominio con certificado SSL

### Pasos para Despliegue

1. **Configurar servidor**
   - Instalar Node.js, Nginx, PostgreSQL
   - Configurar firewall (abrir puertos 80, 443, 22)
   - Configurar dominio y SSL (Let's Encrypt)

2. **Configurar variables de entorno**
   - Crear archivo `.env` en el servidor
   - Configurar con valores de producción
   - No incluir nunca el archivo `.env` en el repositorio

3. **Instalar dependencias**

```bash
# Instalar solo dependencias de producción
npm install --production

# Construir la aplicación
npm run build
```

4. **Usar PM2 para mantener la aplicación en ejecución**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "zapateria" -- start

# Configurar inicio automático
pm2 startup
pm2 save
```

5. **Configurar Nginx como proxy inverso**

```nginx
server {
    listen 80;
    server_name tuzapateria.com www.tuzapateria.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tuzapateria.com www.tuzapateria.com;

    ssl_certificate /etc/letsencrypt/live/tuzapateria.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tuzapateria.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuración de seguridad adicional
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

---

## 🧪 Testing

### Estrategia de Pruebas

- **Unitarias**: Pruebas de funciones puras
- **Integración**: Pruebas de API y servicios
- **E2E**: Pruebas de flujos completos
- **UI**: Pruebas de componentes y páginas

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Pruebas en modo watch
npm run test:watch

# Generar cobertura de código
npm run test:coverage
```

### Estándares de Cobertura

- Mínimo 80% de cobertura de código
- 100% de cobertura para lógica crítica
- Pruebas para todos los casos de error

---

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Código de Conducta

Por favor, lee nuestro [Código de Conducta](CODE_OF_CONDUCT.md) antes de contribuir.

---

## 📅 Roadmap

### Fase 1: MVP (Mes 1-2)
- [ ] Sistema de autenticación
- [ ] CRUD de clientes
- [ ] Gestión de pedidos básica
- [ ] Panel de administración

### Fase 2: Mejoras (Mes 3-4)
- [ ] Sistema de notificaciones
- [ ] Integración con pasarelas de pago
- [ ] Panel de métricas
- [ ] Mobile app para taller

### Fase 3: Escalabilidad (Mes 5-6)
- [ ] Soporte multi-tienda
- [ ] API pública
- [ ] Marketplace de proveedores
- [ ] Sistema de fidelización

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## ✉️ Contacto

Gustavo Faccendini - [@gustavo180591](https://twitter.com/gustavo180591) - gustavo.faccendini@gmail.com

Enlace del proyecto: [https://github.com/gustavo180591/zapateria](https://github.com/gustavo180591/zapateria)

---

## 🙏 Agradecimientos

- [Svelte](https://svelte.dev/) - El marco de trabajo web radicalmente diferente
- [Prisma](https://www.prisma.io/) - ORM moderno para Node.js y TypeScript
- [Tailwind CSS](https://tailwindcss.com/) - Un framework CSS utilitario
- [Vite](https://vitejs.dev/) - Herramienta de construcción de próxima generación

> Plataforma web para gestionar pedidos personalizados de calzado, desde la solicitud del cliente hasta la entrega final. Diseñada para zapaterías artesanales o fabricantes que trabajan bajo demanda.

---

## 🧩 Características principales

- 📝 Formulario de pedido personalizado
- 🖼️ Subida de imágenes de referencia
- 📦 Gestión de pedidos por estado (recibido, en producción, entregado, etc.)
- 🔔 Notificaciones por email y/o WhatsApp
- 💳 Control de pagos (total o seña)
- 👤 Panel del cliente con historial y seguimiento
- 📈 Panel del administrador con estadísticas y filtros
- 🌐 Responsive y adaptable para uso en PC o celular

---

## 🚀 Stack Tecnológico

| Capa        | Tecnología                              |
|-------------|------------------------------------------|
| Frontend    | [SvelteKit](https://kit.svelte.dev/)     |
| Backend     | [Node.js](https://nodejs.org/) + Express |
| Base de datos | [PostgreSQL](https://www.postgresql.org/) |
| ORM         | [Prisma](https://www.prisma.io/)         |
| Storage     | [Cloudinary](https://cloudinary.com/) o Firebase Storage |
| Notificaciones | EmailJS, WhatsApp Business API, o Twilio |

---

## 🛠 Instalación y desarrollo

1. **Clonar el repositorio**

```bash
git clone https://github.com/gustavo180591/zapateria.git
cd zapateria
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar entorno**

Crear un archivo `.env` con las siguientes variables:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/zapateria
CLOUDINARY_API_KEY=...
CLOUDINARY_SECRET=...
EMAILJS_KEY=...
JWT_SECRET=...
```

4. **Migrar base de datos**

```bash
npx prisma migrate dev --name init
```

5. **Iniciar el servidor**

```bash
npm run dev
```

---

## 📁 Estructura del proyecto

```
zapateria/
├── frontend/            # SvelteKit app
├── backend/             # API REST con Express
├── prisma/              # Esquema de base de datos
├── public/              # Archivos estáticos
├── scripts/             # Utilidades y seeds
└── README.md
```

---

## 📚 Roadmap (MVP)

- [ ] Formulario de pedidos personalizado
- [ ] Gestión de estados de pedidos
- [ ] Control de pagos
- [ ] Notificaciones automáticas
- [ ] Panel de cliente y administrador
- [ ] Dashboard de métricas
- [ ] Fidelización de clientes
- [ ] Multiusuario (para crecer como SaaS)

---

## 🧠 Pensado para escalar

Este sistema está diseñado con arquitectura limpia y componentes desacoplados para permitir:

- Multitienda (más de una zapatería en la plataforma)
- Localización por provincias o ciudades
- Adaptable a otros rubros similares (ropa a medida, muebles, etc.)

---

## 📝 Licencia

MIT – Libre para uso y adaptación. Si lo mejorás, ¡compartilo!

---

## 🤝 Agradecimientos

Desarrollado con ❤️ por Gustavo Faccendini  
[gustavo.faccendini@gmail.com](mailto:gustavo.faccendini@gmail.com)
