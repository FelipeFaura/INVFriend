# TAREA: Implementar Servicio de Autenticación Backend (Firebase)

**ID:** TASK-001  
**Prioridad:** CRÍTICA (Bloqueador para otras features)  
**Estimación:** 4-6 horas  
**Responsable:** IA (GitHub Copilot)

---

## 🌐 Code Language

**MANDATORY: ALL code must be in ENGLISH**

- ✅ Variable names, functions, classes, interfaces: **ENGLISH**
- ✅ Comments and JSDoc: **ENGLISH**
- ✅ Error messages and logs: **ENGLISH**
- ✅ File names: **ENGLISH**
- ❌ NO Spanish in code whatsoever
- ℹ️ External documentation (tasks, architecture) can be mixed

Examples:

- ✅ `class AuthValidator`, `validateEmail()`, `Invalid email format`
- ❌ `class ValidadorAuth`, `validarEmail()`, `Formato de email inválido`

---

## 📝 Descripción

Implementar el sistema completo de autenticación backend que gestione login/registro con email+password y Google OAuth. El sistema debe:

- Autenticar usuarios con Firebase Authentication
- Persistir perfil de usuario en Firestore (`users/{uid}`)
- Generar tokens JWT stateless
- Validar tokens en endpoints posteriores
- Proporcionar interfaz limpia para que el frontend consuma

**Alcance:** Backend solo. Frontend consumirá estos endpoints en tareas posteriores.

---

## 📍 Ubicación

Archivos a crear/modificar:

- `backend/src/domain/entities/User.ts` (NEW)
- `backend/src/domain/errors/AuthErrors.ts` (NEW)
- `backend/src/shared/types/AuthTypes.ts` (NEW)
- `backend/src/ports/IAuthPort.ts` (NEW)
- `backend/src/adapters/auth/FirebaseAuthAdapter.ts` (NEW)
- `backend/src/adapters/auth/__tests__/FirebaseAuthAdapter.spec.ts` (NEW)
- `backend/src/adapters/http/middleware/authMiddleware.ts` (NEW)
- `backend/src/adapters/http/controllers/AuthController.ts` (NEW - con endpoints)
- `backend/src/adapters/http/controllers/__tests__/AuthController.spec.ts` (NEW - con tests)

---

## 🏗️ Modelo/Referencia

### Entidad User (Domain)

```typescript
// backend/src/domain/entities/User.ts
export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly photoUrl: string | null,
    readonly createdAt: number,
    readonly updatedAt: number,
  ) {}

  /**
   * Factory method para crear un nuevo usuario
   */
  static create(
    id: string,
    email: string,
    name: string,
    photoUrl?: string | null,
  ): User {
    const now = Date.now();
    return new User(id, email, name, photoUrl || null, now, now);
  }

  /**
   * Method to update an existing user
   */
  update(name?: string, photoUrl?: string | null): User {
    return new User(
      this.id,
      this.email,
      name || this.name,
      photoUrl !== undefined ? photoUrl : this.photoUrl,
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Convert entity to serializable object
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      photoUrl: this.photoUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
```

### Excepciones de Dominio

```typescript
// backend/src/domain/errors/AuthErrors.ts

export class AuthError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = "Email o contraseña inválidos") {
    super(message, "INVALID_CREDENTIALS");
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(email: string) {
    super(`Usuario con email ${email} ya existe`, "USER_ALREADY_EXISTS");
  }
}

export class UserNotFoundError extends AuthError {
  constructor(email?: string) {
    super(
      `User not found${email ? ` with email ${email}` : ""}`,
      "USER_NOT_FOUND",
    );
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message = "Token is invalid or expired") {
    super(message, "INVALID_TOKEN");
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}
```

### DTOs and Types

```typescript
// backend/src/shared/types/AuthTypes.ts

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface GoogleLoginDTO {
  googleToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    photoUrl: string | null;
    createdAt: number;
    updatedAt: number;
  };
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; // seconds
}

export interface DecodedToken {
  uid: string;
  email: string;
  iat: number;
  exp: number;
}
```

### Port (Interface)

```typescript
// backend/src/ports/IAuthPort.ts
import { User } from "../domain/entities/User";
import { AuthResponse } from "../shared/types/AuthTypes";

export interface IAuthPort {
  /**
   * Registers a new user with email and password
   * @throws UserAlreadyExistsError if email already exists
   * @throws ValidationError if data is invalid
   */
  registerWithEmail(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse>;

  /**
   * Authenticates user with email and password
   * @throws InvalidCredentialsError if email/password are incorrect
   * @throws ValidationError if data is invalid
   */
  loginWithEmail(email: string, password: string): Promise<AuthResponse>;

  /**
   * Authenticates user with Google token
   * @throws InvalidTokenError if token is invalid
   */
  loginWithGoogle(googleToken: string): Promise<AuthResponse>;

  /**
   * Gets current user from token
   * @throws InvalidTokenError if token is invalid
   */
  getCurrentUser(token: string): Promise<User>;

  /**
   * Verifies if a token is valid
   */
  verifyToken(token: string): Promise<boolean>;

  /**
   * Logs out user (optional, no server-side persistence)
   */
  logout(userId: string): Promise<void>;

  /**
   * Refreshes access token
   * @throws InvalidTokenError if refreshToken is invalid
   */
  refreshToken(refreshToken: string): Promise<AuthResponse>;
}
```

---

## 🎯 Requisitos Específicos

### Validaciones

- [ ] **Email:**
  - Formato válido (usar regex o librería de validación)
  - Único en Firebase Auth y Firestore
  - Case-insensitive para búsquedas

- [ ] **Password:**
  - Mínimo 8 caracteres
  - Al menos 1 mayúscula
  - Al menos 1 número
  - Hasheado por Firebase Auth (nunca guardar en texto plano)

- [ ] **Name:**
  - Mínimo 2 caracteres
  - Máximo 100 caracteres
  - Trim de espacios

- [ ] **Google Token:**
  - Validar con Google API / Firebase
  - Si usuario no existe en Firebase, crearlo
  - Si existe, obtener sus datos

### Persistencia de Usuario

- [ ] Cuando login/register exitoso:
  - Crear documento en Firestore: `users/{uid}`
  - Guardar: `{ id, email, name, photoUrl, createdAt, updatedAt }`
  - Si ya existe usuario, actualizar `updatedAt`

- [ ] Permitir lectura de perfil desde `users/{uid}`

### Generación de Tokens

- [ ] **AccessToken:**
  - JWT firmado por Firebase Admin SDK
  - Payload: `{ uid, email, iat, exp }`
  - Expiración: 1 hora (3600 segundos)
  - Retornar en AuthResponse

- [ ] **RefreshToken (opcional):**
  - Generar por Firebase (si aplica)
  - Retornar en AuthResponse si disponible

### Middleware de Autenticación

- [ ] Crear `authMiddleware.ts`:
  - Extrae token de header `Authorization: Bearer <token>`
  - Valida con Firebase Admin SDK
  - Añade `req.user` con datos del usuario
  - Retorna 401 si token inválido/expirado

### Adapter - FirebaseAuthAdapter

Implementar interfaz `IAuthPort` con:

- [ ] Usar Firebase Admin SDK (`firebase-admin`)
- [ ] Métodos: `registerWithEmail`, `loginWithEmail`, `loginWithGoogle`, `getCurrentUser`, `verifyToken`, `logout`, `refreshToken`
- [ ] Todas las validaciones especificadas
- [ ] Manejo de errores con excepciones de dominio
- [ ] Persistencia en Firestore `users/{uid}`
- [ ] NO guardar passwords, solo Firebase Auth
- [ ] Logging de errores (no de datos sensibles)

### Controller - AuthController

Endpoints (referencia para tests y API spec):

```
POST /auth/register
  Body: { email, password, name }
  Response: 201 + { user, accessToken, refreshToken?, expiresIn? }
  Errors: 400 (validation), 409 (user exists)

POST /auth/login
  Body: { email, password }
  Response: 200 + { user, accessToken, refreshToken?, expiresIn? }
  Errors: 400 (validation), 401 (invalid credentials), 404 (user not found)

POST /auth/google-login
  Body: { googleToken }
  Response: 200 + { user, accessToken, refreshToken?, expiresIn? }
  Errors: 400 (validation), 401 (invalid token)

POST /auth/logout
  Body: {}
  Headers: Authorization: Bearer <token>
  Response: 200 + { success: true }
  Errors: 401 (unauthorized)

GET /auth/me
  Headers: Authorization: Bearer <token>
  Response: 200 + { user }
  Errors: 401 (unauthorized)
```

---

## 🚫 Scope / Límites

**Lo que NO debe hacer:**

- ❌ Crear endpoints en Express (solo la interfaz y adapter, endpoints solo en tests como referencia)
- ❌ Implementar 2FA (two-factor authentication)
- ❌ Generar códigos de verificación por email
- ❌ Implementar "olvide mi contraseña"
- ❌ Cambiar contraseña
- ❌ Modificar ARCHITECTURE.md
- ❌ Agregar dependencias npm que no estén listadas abajo
- ❌ Hacer llamadas a APIs externas (excepto Google OAuth vía Firebase)
- ❌ Persistir tokens en servidor (stateless)
- ❌ Crear sesiones o cookies

**Lo que SÍ debe hacer:**

- ✅ Solo las 7 funciones del puerto IAuthPort
- ✅ Persistencia mínima en Firestore (perfil usuario)
- ✅ Validaciones estrictas
- ✅ Tests unitarios completos
- ✅ Error handling con excepciones de dominio

---

## ✅ Aceptación / Checklist

- [ ] **Archivos creados exactamente como se especifica:**
  - `backend/src/domain/entities/User.ts`
  - `backend/src/domain/errors/AuthErrors.ts`
  - `backend/src/shared/types/AuthTypes.ts`
  - `backend/src/ports/IAuthPort.ts`
  - `backend/src/adapters/auth/FirebaseAuthAdapter.ts`
  - `backend/src/adapters/auth/__tests__/FirebaseAuthAdapter.spec.ts`
  - `backend/src/adapters/http/middleware/authMiddleware.ts`
  - `backend/src/adapters/http/controllers/AuthController.ts`
  - `backend/src/adapters/http/controllers/__tests__/AuthController.spec.ts`

- [ ] **Sigue convenciones de GUIDELINES.md:**
  - Naming correcto (PascalCase clases, camelCase métodos)
  - JSDoc en todos los métodos públicos
  - No hay logs de debug
  - Tipado fuerte (sin `any`)
  - Imports organizados
  - **🌐 ALL IN ENGLISH:** Variables, methods, comments, error messages
  - No Spanish anywhere in code

- [ ] **Tests:**
  - `FirebaseAuthAdapter.spec.ts` con cobertura >90%
  - Casos: register exitoso, login exitoso, google login, validaciones, errores
  - `AuthController.spec.ts` con tests de endpoints

- [ ] **Compilación:**
  - `npm run build` en `backend/` sin errores
  - Sin warnings de TypeScript

- [ ] **Funcionalidad:**
  - Email + Password: register, login, validaciones
  - Google OAuth: login, crear usuario si no existe
  - Tokens: generación, validación, expiración
  - Persistencia: perfil guardado en Firestore
  - Middleware: valida tokens correctamente
  - Errores: lanzados con código y mensaje correcto

---

## 📚 Referencias

- **ARCHITECTURE.md:** Sección "🔌 Puertos y Adaptadores" + "🗄️ Modelos de Datos > User"
- **GUIDELINES.md:**
  - Sección "TypeScript > Nombres de Variables"
  - Sección "Buenas Prácticas > Error Handling"
  - Sección "Buenas Prácticas > Inyección de Dependencias"
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup
- **Firebase Auth:** https://firebase.google.com/docs/auth
- **Firestore:** https://firebase.google.com/docs/firestore

---

## 🔧 Dependencias

Asegurar que estén en `backend/package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "firebase-admin": "^12.0.0",
    "typescript": "^5.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0"
  }
}
```

**NO agregar** nuevas dependencias sin aprobación explícita.

---

## 📖 Notas Importantes

1. **Firebase Admin SDK**: Debe estar configurado en `backend/src/config/` (crear si no existe)
2. **Variables de entorno**: `.env` debe tener `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, etc.
3. **Firestore Rules**: No las modifiques. Solo garantiza que la app pueda escribir en `users/{uid}`
4. **Seguridad**: Nunca loguear passwords, tokens, o datos sensibles
5. **Tokens**: Firebase Admin SDK genera automáticamente JWTs seguros
6. **🌐 LANGUAGE REQUIREMENT: ALL CODE IN ENGLISH**
   - Class/method/variable names: English only
   - JSDoc comments: English only
   - Error messages and logs: English only
   - Examples:
     - ✅ `class AuthValidator`, `private validateEmail()`, `throw new InvalidCredentialsError('Invalid email format')`
     - ❌ `class ValidadorAuth`, `validar_correo()`, `throw new Error('Formato de correo inválido')`
   - DO NOT use: Spanish, accents, tildes, ñ, or Spanish comments

---

## 🚀 Siguiente Paso

Una vez aprobada esta tarea, el siguiente será:

- **TASK-002:** Crear componente Angular LoginComponent que consuma estos endpoints
- **TASK-003:** Crear Guard de rutas protegidas en frontend

---

**Versión de Tarea:** 1.0  
**Fecha Creación:** 21 de Enero, 2026  
**Estado:** READY FOR APPROVAL
