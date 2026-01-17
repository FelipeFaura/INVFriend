# Plantilla de documentación de entrega

Usa esta plantilla para documentar cambios importantes. Guarda el archivo en `docs/` con nombre `sprintN-area-breve.md`.

## Título

Breve título del cambio.

## Resumen

Un párrafo con la intención y alcance del cambio.

## Archivos modificados / ubicación

- Lista de rutas de archivos y carpetas modificadas (ej: `functions/src/usecases/runDraw.ts`).

## Contrato / API (si aplica)

- Endpoint: `POST /runDraw`
- Request: ejemplo JSON
- Response: ejemplo JSON
- Errores: códigos y condiciones

## Modelo de datos (Firestore)

- Colecciones/documents afectados y campos nuevos/actualizados.

## Seguridad

- Reglas de Firestore afectadas y notas de autorización.

## Pruebas

- Tests añadidos/actualizados (unit/integration/e2e).
- Comandos para ejecutar tests.

## Pasos para reproducir localmente

```bash
# iniciar emuladores
firebase emulators:start --only firestore,functions,hosting
# ejecutar tests unitarios
npm run test
```

## Notas de despliegue

- Variables de entorno requeridas.
- Cambios en workflows CI/CD.

## Checklist (obligatorio)

- [ ] Linter pasado
- [ ] Tests unitarios pasan
- [ ] Tests de integración/E2E relevantes pasan
- [ ] `docs/api.md` actualizado si aplica
- [ ] PR incluye link a este documento
