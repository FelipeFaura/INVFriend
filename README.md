# INVFriend 🎁

**INVFriend** es una aplicación web y móvil para organizar sorteos de Amigo Invisible de forma sencilla y segura. Los usuarios pueden crear grupos, realizar sorteos automáticos y compartir sus deseos de regalo con su amigo invisible asignado.

## 🚀 Características

- ✅ Crear y gestionar grupos de Amigo Invisible
- ✅ Autenticación con email/contraseña y Google Login
- ✅ Sorteo automático e equitativo para grupos
- ✅ Gestión de deseos (texto e URLs)
- ✅ Privacidad garantizada: solo ves a tu amigo invisible
- ✅ Notificaciones cuando se realiza el sorteo
- ✅ Responsive design para web y móvil

## 🛠️ Stack Tecnológico

- **Frontend:** Angular 18+
- **Backend:** Node.js + Express
- **Base de Datos:** Firebase Realtime Database
- **Autenticación:** Firebase Authentication
- **Hosting:** Firebase Hosting (frontend) + Cloud Functions (backend)
- **Arquitectura:** Hexagonal

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn como gestor de paquetes
- Firebase CLI (`npm install -g firebase-tools`)
- Una cuenta en Firebase (gratuita)
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/INVFriend.git
cd INVFriend
```

### 2. Configurar Firebase

```bash
firebase login
firebase init
```

Selecciona las opciones:

- Database: Firebase Realtime Database
- Hosting: Firebase Hosting
- Functions: Cloud Functions (backend)
- Authentication: sí

### 3. Instalar dependencias

**Frontend (Angular):**

```bash
cd frontend
npm install
```

**Backend (Node):**

```bash
cd ../backend
npm install
```

### 4. Variables de entorno

Crea los archivos de configuración necesarios:

**`frontend/.env`:**

```
ANGULAR_APP_FIREBASE_API_KEY=tu_api_key
ANGULAR_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
ANGULAR_APP_FIREBASE_DATABASE_URL=tu_database_url
ANGULAR_APP_FIREBASE_PROJECT_ID=tu_project_id
```

**`backend/.env`:**

```
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_PRIVATE_KEY=tu_private_key
FIREBASE_CLIENT_EMAIL=tu_client_email
NODE_ENV=development
```

### 5. Ejecutar localmente

**Terminal 1 - Frontend:**

```bash
cd frontend
ng serve
```

Accede a `http://localhost:4200`

**Terminal 2 - Backend:**

```bash
cd backend
npm run dev
```

El servidor estará en `http://localhost:3000`

## 📖 Documentación

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura, modelos de datos y especificaciones técnicas
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) - Referencia rápida y visual
- [GUIDELINES.md](./GUIDELINES.md) - Guías de desarrollo y convenciones de código

## 🤝 Contribuir

Este es un proyecto personal desarrollado con apoyo de IA. Consulta [GUIDELINES.md](./GUIDELINES.md) para convenciones de código y scope de tareas.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 💬 Preguntas o Sugerencias

Abre un issue en el repositorio para reportar bugs o sugerir mejoras.

---

**Versión MVP:** 1.0.0
**Última actualización:** Enero 2026
