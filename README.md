# INVFriend — Amigo Invisible (MVP)

## Descripción

- `INVFriend` es una aplicación sencilla para organizar sorteos de "amigo invisible": crear grupos, invitar participantes mediante enlace, permitir que cada participante añada sus deseos y ejecutar un sorteo que asigna a cada persona su amigo invisible.
- Objetivo: lanzar un MVP gratuito y fácil de mantener usando tecnologías con capa gratuita (Stack A: Angular + Firebase).

## Características principales

- Crear grupo con nombre y fecha del evento.
- Generar enlace de invitación (token) para unirse sin obligar a crear cuenta.
- Añadir/editar lista de deseos por participante.
- Ejecutar sorteo en servidor (evita trampas) respetando exclusiones.
- Ver asignación y deseos (solo accesible para cada participante).
- Administración básica: eliminar participante, reabrir antes del sorteo, borrar datos al finalizar.

## Arquitectura

- Enfoque: Arquitectura hexagonal (pragmática) dentro de Cloud Functions.
  - Puertos/Adaptadores: HTTP handlers (Cloud Functions) y repositorios Firestore.
  - Capa de dominio: entidades (`Group`, `Participant`) y utilidades puras (`drawUtils`).
  - Use-cases: `createGroup`, `joinGroup`, `addWishes`, `runDraw`.
  - Infra: implementaciones de repositorios que usan Firestore.

Ventajas: testabilidad, desacoplo de Firestore/HTTP, facilidad para cambiar persistencia.

## Tecnologías recomendadas (Stack A)

- Frontend: Angular + Angular Material
- Hosting + Backend: Firebase Hosting + Cloud Functions (Node/TypeScript)
- Base de datos: Firestore (NoSQL)
- Emuladores: Firebase Emulator Suite para desarrollo local
- CI/CD: GitHub + GitHub Actions (deploy a Firebase)
- Testing: Jest para unitarios, Cypress para E2E

## Modelo de datos (resumen)

- `groups/{groupId}`
  - `name`: string
  - `createdAt`: timestamp
  - `ownerId`: string
  - `eventDate`: timestamp
  - `status`: "open" | "drawn"
  - `exclusions`: array de pares opcionales
  - `inviteToken`: string
- `groups/{groupId}/participants/{participantId}`
  - `name`: string
  - `joinedAt`: timestamp
  - `wishes`: array[string]
  - `email`: string (opcional)
- `groups/{groupId}/assignments/{participantId}`
  - `assignedTo`: participantId
  - `assignedAt`: timestamp

## Funciones / Endpoints (Cloud Functions)

- `createGroup(data)` → crea grupo y devuelve `groupId` + `inviteToken`.
- `joinGroup({groupId, token, name})` → añade participante validando token.
- `addWishes({groupId, participantId, wishes})` → actualiza deseos.
- `runDraw({groupId, ownerId})` → ejecuta sorteo atómico y persiste asignaciones.
- `getAssignment({groupId, participantId})` → devuelve asignado si está permitido.
- `removeParticipant({groupId, participantId})` → solo organizador.

## Nota sobre el algoritmo de sorteo

- Se debe evitar la auto-asignación y respetar exclusiones.
- Implementación recomendada: intentar `shuffle` + validación; si no encuentra solución tras N intentos, usar algoritmo de emparejamiento/derangement determinista (backtracking limitado o algoritmo de Graham-Schmidt para derangements).
- Persistir asignaciones dentro de una transacción o en la Cloud Function de forma atómica y marcar `status: "drawn"`.

## Seguridad y privacidad (mínimos)

- No exponer `assignments` antes de `status == "drawn"`.
- `runDraw` solo ejecutable por `ownerId` verificado.
- Invite tokens con expiración y validación.
- Minimizar PII: almacenar nombre y deseos; correo solo opt-in.
- Proveer borrado de datos tras evento si el organizador lo solicita.

## Instalación y desarrollo local

Prerrequisitos: Node >= 16, npm, Angular CLI (opcional), Firebase CLI

Pasos rápidos:

```bash
git clone <repo>
cd <repo>
npm install
# frontend dev (si existe carpeta frontend)
ng serve
# iniciar emuladores (Firestore + Functions + Hosting)
firebase emulators:start --only firestore,functions,hosting
```

## Despliegue (producción)

```bash
# build frontend
npm run build -- --prod
# deploy hosting y funciones
firebase deploy --only hosting,functions
```

## Buenas prácticas para el repositorio

- Mantener la lógica de negocio en `functions/src/domain` y `functions/src/usecases`.
- Tests unitarios para `drawUtils` y use-cases; mocks para repositorios.
- Usar Firebase Emulator Suite en CI para pruebas de reglas básicas de seguridad.

## Contribuir

- Abrir issue o PR con descripción clara.
- Ejecutar tests y lint antes de enviar PR.

## Licencia

- MIT (sugerido).

## Contacto

- Mantén issues y discusiones en GitHub.

---

Este README proporciona la guía inicial para el MVP. Si quieres, puedo crear el esqueleto de `functions/src/` y un ejemplo de `runDraw` con test usando Jest; dime si procede.
