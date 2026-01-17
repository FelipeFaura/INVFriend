# ContextoParaIA

## Propósito

Documento técnico destinado a otras IAs y agentes automatizados que participen en el desarrollo del proyecto `INVFriend`.
Contiene la información mínima y las convenciones necesarias para implementar, probar y desplegar el MVP usando el Stack A (Angular + Firebase) con arquitectura hexagonal.

## Resumen del proyecto

- Nombre: INVFriend — Amigo Invisible (MVP)
- Objetivo: permitir crear grupos, invitar participantes por enlace, permitir que cada participante añada deseos y ejecutar un sorteo seguro que asigne a cada participante su amigo invisible.
- Requisitos clave: gratuito (usar capas gratuitas), sencillo, seguro (no exponer asignaciones), respetar exclusiones.

## Stack técnico (resumen)

- Frontend: Angular + Angular Material (TypeScript)
- Backend: Firebase Cloud Functions (Node.js + TypeScript)
- DB: Firestore (NoSQL)
- Hosting: Firebase Hosting
- Emuladores: Firebase Emulator Suite (Firestore, Functions, Hosting)
- CI/CD: GitHub Actions → deploy a Firebase
- Testing: Jest (unit), Cypress (E2E)

## Arquitectura recomendada

- Patrón: Arquitectura Hexagonal (pragmática) dentro de `functions/`.
- Mapeo de carpetas (functions/src):
  - `controllers/` — adaptadores HTTP (Cloud Functions handlers).
  - `usecases/` — casos de uso / application services (`createGroup`, `runDraw`, etc.).
  - `domain/` — entidades y lógica pura (`Group`, `Participant`, `drawUtils`).
  - `adapters/` — implementaciones de puertos (repositorio Firestore, email sender opcional).
  - `ports/` — interfaces (ej. `IGroupRepository`).
  - `tests/` — pruebas unitarias (usar Jest) y mocks de puertos.

## Modelo de datos (Firestore)

- Collection: `groups/{groupId}`
  - `name`: string
  - `createdAt`: timestamp
  - `ownerId`: string
  - `eventDate`: timestamp | null
  - `status`: string enum `open` | `drawn` | `closed`
  - `inviteToken`: string (hash)
  - `exclusions`: array<{a: participantId, b: participantId}>
- Subcollection: `groups/{groupId}/participants/{participantId}`
  - `name`: string
  - `joinedAt`: timestamp
  - `wishes`: string[]
  - `email`: string | null
  - `canEdit`: boolean (opcional)
- Subcollection/Collection: `groups/{groupId}/assignments/{participantId}`
  - `assignedTo`: participantId
  - `assignedAt`: timestamp

## API / Contractos de Cloud Functions

Nota: Exponer como HTTP functions (POST/GET) o Callable functions según preferencia. Preferible HTTP POST para control total.

- `POST /createGroup`
  - Body: { name: string, ownerId?: string, eventDate?: string, exclusions?: [{a,b}], options?: {} }
  - Response: { groupId: string, inviteToken: string }
  - Errors: 400 (bad input), 500 (server)

- `POST /joinGroup`
  - Body: { groupId: string, inviteToken: string, name: string, email?: string }
  - Response: { participantId: string }
  - Validation: token match and group status == open

- `POST /addWishes`
  - Body: { groupId, participantId, wishes: string[] }
  - Response: 200 OK

- `POST /runDraw`
  - Body: { groupId, ownerId }
  - Operation: verificar permisos, cargar participantes, ejecutar algoritmo de derangement respetando `exclusions`, persistir asignaciones atómicamente y actualizar `groups/{groupId}.status = "drawn"`.
  - Response: 200 OK (sin devolver asignaciones en la respuesta). Las asignaciones sólo se leen vía `getAssignment` por participante.
  - Errors: 403 (no autorizado), 409 (insufficient participants / impossible constraints), 500

- `GET /getAssignment?groupId=&participantId=`
  - Response: { assignedTo: participantId, wishes: string[] } — solo si `groups/{groupId}.status == "drawn"` y `participantId` corresponde.

## Notas de API

- Nunca devolver la lista completa de `assignments` en una sola petición pública.
- Registrar auditoría mínima (`audit/{groupId}/events`) para acciones críticas.

````markdown
# ContextoParaIA — Documento de verdad (INVFriend)

## 1. Propósito

Este documento es la fuente única de verdad para el proyecto `INVFriend` (MVP). Contiene el alcance, arquitectura, modelo de datos, contratos de API, algoritmo de sorteo, requisitos de seguridad, pasos de implementación y la hoja de ruta por sprints.

Está pensado para desarrolladores humanos y agentes automatizados que participen en el desarrollo, pruebas y despliegue.

## 2. Resumen ejecutivo

- Nombre: INVFriend — Amigo Invisible (MVP)
- Objetivo: permitir crear grupos, invitar participantes por enlace, permitir que cada participante añada deseos y ejecutar un sorteo seguro que asigne a cada participante su amigo invisible.
- Restricciones clave: debe ser gratuito (usar capas gratuitas), sencillo, privado y seguro (no exponer asignaciones), tolerante a reintentos.

## 3. Requisitos funcionales mínimos (MVP)

1. Crear grupo con nombre, fecha opcional y exclusiones.
2. Generar enlace de invitación (`inviteToken`) para unirse sin cuenta.
3. Unirse a un grupo mediante enlace/token, indicando nombre y opcionalmente correo.
4. Añadir/editar deseos por participante.
5. Ejecutar sorteo desde servidor (solo `ownerId`) que respete exclusiones y evite auto-asignaciones.
6. Persistir asignaciones y permitir que cada participante vea únicamente su asignación y deseos del asignado.
7. Reabrir o eliminar participantes antes de sorteo; borrar datos tras evento (opt-in).

## 4. Stack técnico recomendado

- Frontend: Angular + Angular Material
- Backend: Firebase Cloud Functions (Node.js + TypeScript)
- DB: Firestore (NoSQL)
- Hosting: Firebase Hosting
- Emuladores: Firebase Emulator Suite
- CI/CD: GitHub Actions → Firebase deploy
- Tests: Jest (unit), Cypress (E2E)

Motivación: usar tecnologías con capa gratuita y rápido despliegue.

## 5. Arquitectura (alto nivel)

- Enfoque: Arquitectura hexagonal (puertos y adaptadores) dentro de `functions/`.
- Carpetas principales en `functions/src`:
  - `controllers/` — adaptadores HTTP (Cloud Functions handlers).
  - `usecases/` — casos de uso / application services (`createGroup`, `joinGroup`, `addWishes`, `runDraw`).
  - `domain/` — entidades y lógica pura (`Group`, `Participant`, `drawUtils`).
  - `adapters/` — implementaciones de puertos (repositorio Firestore, email sender opcional).
  - `ports/` — interfaces (ej. `IGroupRepository`).
  - `tests/` — pruebas unitarias y de integración (Jest, emulador).

Separar lógica de negocio de adaptadores facilita pruebas y cambios futuros.

## 6. Modelo de datos (Firestore)

- Document: `groups/{groupId}`
  - `name`: string
  - `createdAt`: timestamp
  - `ownerId`: string
  - `eventDate`: timestamp | null
  - `status`: string enum `open` | `drawn` | `closed`
  - `inviteToken`: string (hash / opaque token)
  - `exclusions`: array<{a: participantId, b: participantId}> (opcional)

- Subcollection: `groups/{groupId}/participants/{participantId}`
  - `name`: string
  - `joinedAt`: timestamp
  - `wishes`: string[]
  - `email`: string | null
  - `canEdit`: boolean (opcional)

- Subcollection: `groups/{groupId}/assignments/{participantId}`
  - `assignedTo`: participantId
  - `assignedAt`: timestamp

- Colección auxiliar (auditoría): `audit/{groupId}/events` — registrar eventos críticos.

Notas de modelado:

- `inviteToken` debe ser firmado/firmable con `INVITE_TOKEN_SECRET` y opcionalmente con expiración.
- No almacenar asignaciones en el documento `group` para evitar exposición accidental.

## 7. API — Contratos de Cloud Functions

Preferible exponer HTTP POST/GET para control total y facilidad de testing en emulador.

- `POST /createGroup`
  - Body: { name: string, ownerId?: string, eventDate?: string|null, exclusions?: [{a:string,b:string}], options?: {} }
  - Response: { groupId: string, inviteToken: string }
  - Errors: 400, 500

- `POST /joinGroup`
  - Body: { groupId: string, inviteToken: string, name: string, email?: string }
  - Response: { participantId: string }
  - Validación: token válido; `groups/{groupId}.status == "open"`.

- `POST /addWishes`
  - Body: { groupId: string, participantId: string, wishes: string[] }
  - Response: 200 OK
  - Validación: solo si `status == "open"` o `participant.canEdit`.

- `POST /runDraw`
  - Body: { groupId: string, ownerId: string }
  - Operation: verificar permisos, cargar participantes, ejecutar `drawUtils`, persistir asignaciones atómicamente y actualizar `groups/{groupId}.status = "drawn"`.
  - Response: 200 OK (no devolver asignaciones)
  - Errors: 403 (no autorizado), 409 (constraints impossible), 500

- `GET /getAssignment?groupId=&participantId=`
  - Response: { assignedTo: participantId, wishes: string[] } — solo si `groups/{groupId}.status == "drawn"` y la petición es hecha por `participantId` o con claims equivalentes.

Reglas importantes:

- Nunca exponer todas las `assignments` en una sola petición pública.
- Registrar cada ejecución de `runDraw` en `audit/` con metadata (who, when, participants count, result).

## 8. Algoritmo de sorteo (derangement)

Requisitos formales:

- Prohibir asignaciones A→A.
- Respetar exclusiones (pares indicados que no pueden emparejarse).

Estrategia recomendada (robusta y simple):

1. Obtener lista `P` (IDs) de participantes activos.
2. Crear copia `D = shuffle(P)` y validar que para todo i: P[i] != D[i] y (P[i], D[i]) no está en `exclusions`.
3. Repetir shuffle hasta `MAX_ATTEMPTS` (por ejemplo 1000).
4. Si no se encuentra solución, ejecutar backtracking/DFS con poda por exclusiones y límite de nodos explorados.
5. Si se encuentra solución, persistir las asignaciones dentro de una transacción o mediante operaciones atómicas que garanticen que `status` pasa `open`→`drawn` solo tras persistir todas las asignaciones.
6. Si no existe solución, devolver 409 con mensaje explícito.

Pseudocódigo (alto nivel):

$$
	ext{attempts} \leftarrow 0
\\
	ext{while attempts} < MAX\_ATTEMPTS:\\
\quad D \leftarrow shuffle(P)\\
\quad \text{if valid(P,D,exclusions): return D}\\
\quad attempts += 1
\\
	ext{return backtrackingSolve(P, exclusions)}
$$

Pruebas obligatorias para `drawUtils`:

- Grupo mínimo (3)
- Grupo grande (20-50)
- Casos imposibles por exclusiones
- Determinismo en parámetros fijos (semilla opcional para tests)

## 9. Atomicidad y concurrencia

- `runDraw` debe garantizar que solo una ejecución puede transformar `groups/{groupId}.status` de `open` a `drawn`:
  - Usar Firestore Transaction/conditional update: leer `status`, si `open` persistir asignaciones y actualizar a `drawn` atomically.
  - Alternativa: usar un documento lock `groups/{groupId}/locks/draw` con write-once.
- Validar que durante persistencia no ocurran writes concurrentes a participantes que puedan invalidar la asignación (ej. borrados). Si detectado, abortar y devolver 409 o reintentar.

## 10. Seguridad (reglas y prácticas)

- Reglas Firestore (resumen):
  - `assignments/*` solo leíble por su `participantId` cuando `groups/{groupId}.status == "drawn"`.
  - Escrituras a `groups/*` y `participants/*` permitidas solo cuando `status == "open"` y con token/claim correcto.
  - `runDraw` solo ejecutable por `ownerId` — reforzar en backend (functions) y, si se usan Callable Functions, validar `context.auth.uid`.
- Minimizar PII: almacenar solo nombre y deseos; email opcional y opt-in.
- En backend, no confiar en datos del cliente para decisiones críticas (ej. who can run draw).

## 11. Variables de entorno y configuración

- `FIREBASE_PROJECT` — id del proyecto (placeholder en dev).
- `INVITE_TOKEN_SECRET` — secreto para firmar/verificar invite tokens.
- `MAX_DRAW_ATTEMPTS` — entero (por defecto 1000).
- `MAIL_API_KEY` — opcional para notificaciones por email.
- `FIREBASE_CONFIG` / `GOOGLE_APPLICATION_CREDENTIALS` — para deploy/CI.

## 12. Desarrollo local — comandos prácticos

Prerrequisitos: Node 16+, npm, Firebase CLI, Angular CLI (si hay frontend).

Instalación de dependencias:

```bash
npm install
```

Iniciar emuladores (desde la raíz donde esté `firebase.json`):

```bash
firebase emulators:start --only firestore,functions,hosting
```

Ejecutar tests unitarios:

```bash
npm run test
```

Ejecutar E2E (Cypress):

```bash
npm run e2e
```

Deploy (hosting + functions):

```bash
firebase deploy --only hosting,functions
```

## 13. Estrategia de testing

- Unit tests: `domain/` y `usecases/` (Jest). Cobertura obligatoria para `drawUtils`.
- Integration tests: emulador Firestore + Functions para endpoints críticos (`createGroup`, `joinGroup`, `runDraw`, `getAssignment`).
- E2E: Cypress sobre la UI mínima (crear grupo, unirse, añadir deseos, ejecutar sorteo y ver asignación).
- Tests de reglas: usar `@firebase/rules-unit-testing` con emulador.

## 14. CI/CD y despliegue

- GitHub Actions pipeline (sugerencia):
  1. checkout
  2. setup Node
  3. install
  4. run lint
  5. run unit tests
  6. run integration tests (emulator)
  7. build frontend
  8. deploy (usar `FIREBASE_TOKEN` secreto)

## 15. Hoja de ruta (Sprints) — pasos prácticos

Sprint corto, incremental y orientado a entregar valor mínimo en cada paso. Cada sprint incluye criterios de aceptación (AC).

1. Sprint 1 — Análisis y preparación (AC: `ContextoParaIA.md` actualizado, decisiones listadas, rama `sprints/plan` creada)
2. Sprint 2 — Esqueleto Functions (AC: `functions/` con `package.json`, `tsconfig.json`, ESLint, scripts `build/test` y carpetas vacías)
3. Sprint 3 — Modelos y repositorios (AC: `domain/` con `Group` y `Participant`, `ports/IGroupRepository`, y tests unitarios básicos)
4. Sprint 4 — Endpoints CRUD básicos (AC: `createGroup`, `joinGroup`, `addWishes`, `getAssignment` funcionando en emulator)
5. Sprint 5 — Algoritmo de sorteo (AC: `drawUtils` con tests que cubren 3 casos mínimos y casos imposibles)
6. Sprint 6 — RunDraw y persistencia atómica (AC: `runDraw` implementado con transacción y pruebas de integración)
7. Sprint 7 — Seguridad y reglas Firestore (AC: `firestore.rules` + tests que verifican accesos a `assignments`)
8. Sprint 8 — Frontend mínimo Angular (AC: UI para crear grupo, unirse, editar deseos y ver asignación; E2E básico)
9. Sprint 9 — CI/CD y documentación (AC: GitHub Actions que construye, testea y despliega con secretos; `docs/api.md` publicado)

Cada Sprint debe ser pequeño (1-2 semanas) y verificable en emulador/local.

## 16. Checklist de decisiones y preguntas abiertas

- ¿Usaremos HTTP functions o Callable Functions para todos los endpoints? (recomendado: HTTP POST para facilidad de emulador)
- ¿Requerimos autenticación completa (`firebase auth`) o permitimos join anónimo vía token? (recomendado: token + optional auth)
- ¿Se desea envío de emails (requiere `MAIL_API_KEY`) o basta con enlaces compartibles?
- ¿Cuántos intentos/tiempo para `MAX_DRAW_ATTEMPTS` en producción?

Marcar estas decisiones en la rama `sprints/plan` antes de implementar.

## 17. Ubicación de archivos importantes

- `README.md` — guía de alto nivel
- `ContextoParaIA.md` — (este archivo) documento de verdad
- `functions/src/` — código de Cloud Functions (controllers, usecases, domain, adapters, ports)
- `firestore.rules` — reglas de seguridad
- `docs/api.md` — ejemplos de solicitudes/respuestas

## 18. Guía rápida para contribuir

- Crear rama `feature/<desc>` o `sprint/<n>-<desc>` desde `main` o `sprints/plan`.
- Añadir tests para cualquier cambio en `domain/` o `drawUtils`.
- Ejecutar linter y tests antes de PR.

## 19. Documentación obligatoria por entrega

Cada vez que se implemente una parte importante de la aplicación o de la arquitectura (por ejemplo: nuevo endpoint, cambio en `drawUtils`, nuevas reglas de seguridad, cambios en el modelo de datos, o integración CI/CD), el responsable del cambio debe añadir o actualizar un fichero Markdown en la carpeta `docs/` siguiendo la plantilla provista en `docs/DOC_TEMPLATE.md`.

Requisitos mínimos para la documentación de una entrega:

- **Título y resumen**: breve descripción del cambio y propósito.
- **Arquitectura / ubicación**: rutas de archivos modificados y capas afectadas (`controllers`, `usecases`, `domain`, `adapters`).
- **Contrato/API**: formato de request/response, códigos de error, ejemplos JSON.
- **Modelo de datos**: cambios en documentos/colecciones de Firestore (campos y tipos).
- **Seguridad**: reglas de Firestore afectadas y consideraciones de autorización.
- **Pruebas**: qué tests se añadieron o actualizaron (unit, integration, e2e) y cómo correrlos.
- **Pasos para reproducir**: comandos para arrancar emuladores y reproducir la funcionalidad.
- **Notas de despliegue**: variables de entorno nuevas o cambios en CI/CD.
- **Checklist**: confirmar que linter y tests pasan, que la documentación fue añadida y que `docs/api.md` se actualizó si procede.

Ubicación y convenciones:

- Carpeta: `docs/` en la raíz del repositorio.
- Nombres: `docs/<sprint>-<area>-<breve>.md` (ej. `docs/sprint2-functions-esqueleto.md`).
- Plantilla: `docs/DOC_TEMPLATE.md` (obligatoria para cambios importantes).
- En cada Pull Request: incluir referencia al fichero de documentación y al issue/sprint asociado.

Responsabilidad automática para agentes IA:

- Cualquier agente que implemente cambios en el repositorio debe crear/actualizar la documentación según esta sección antes de finalizar la rama o abrir el PR.

---

Fin del documento.
````
