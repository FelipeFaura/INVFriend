# INVFriend - Plantilla de Tareas para IA

Esta es una plantilla para asignar tareas a la IA de manera clara, específica y controlada.

## 📋 Plantilla Estándar

Copiar y completar este template cuando se asigne una tarea a IA:

```markdown
# TAREA: [Nombre descriptivo de la tarea]

## 📝 Descripción

[Qué es lo que se necesita hacer exactamente]

## 📍 Ubicación

- Archivo(s): [Rutas exactas donde ir los cambios]
- Ejemplo: `backend/src/application/use-cases/CreateGroupUseCase.ts`

## 🏗️ Modelo/Referencia

[Interfaces, tipos, o modelos existentes que deben seguirse]

- Referencia a ARCHITECTURE.md si aplica
- Ejemplos de código similar existente

## 🎯 Requisitos Específicos

- [ ] Requisito 1
- [ ] Requisito 2
- [ ] Requisito 3

## 🚫 Scope / Límites (MUY IMPORTANTE)

**Lo que NO debe hacer:**

- ❌ [Cosa que no debe hacer 1]
- ❌ [Cosa que no debe hacer 2]
- ❌ No crear archivos adicionales no mencionados
- ❌ No cambiar código existente sin indicación

## ✅ Aceptación / Checklist

- [ ] Sigue convenciones de GUIDELINES.md
- [ ] Incluye tests (si aplica)
- [ ] Sin logs de debug
- [ ] Documentado con JSDoc
- [ ] Archivos creados siguen nombrado exacto

## 📚 Referencias

- Sección relevante de GUIDELINES.md: [link]
- Entidades relacionadas en ARCHITECTURE.md: [link]
- Archivo similar de ejemplo: [path]
```

---

## 📖 Ejemplos Reales

### Ejemplo 1: Implementar Entity

````markdown
# TAREA: Crear entidad Group

## 📝 Descripción

Crear la entidad Group que representa un grupo de Amigo Invisible.
Debe tener validaciones básicas y métodos de creación.

## 📍 Ubicación

- Archivo: `backend/src/domain/entities/Group.ts`

## 🏗️ Modelo/Referencia

Basarse en la estructura definida en ARCHITECTURE.md, sección "Modelos de Datos > Group":

```typescript
{
  id: string;                    // UID generado
  name: string;                  // Nombre del grupo
  description?: string;          // Descripción opcional
  adminId: string;               // UID del admin que creó el grupo
  members: string[];             // Array de UIDs de miembros
  budgetLimit: number;           // Límite de presupuesto en moneda
  raffleStatus: 'pending' | 'completed';
  raffleDate?: number;
  createdAt: number;
  updatedAt: number;
}
```
````

## 🎯 Requisitos Específicos

- [ ] Constructor privado + factory method static `create()`
- [ ] Validar que `name` no esté vacío
- [ ] Validar que `budgetLimit > 0`
- [ ] El admin debe ser agregado al array de members en creación
- [ ] `raffleStatus` por defecto debe ser 'pending'
- [ ] Timestamps generados con `Date.now()`
- [ ] Método `isValidForRaffle()`: verifica que tenga al menos 2 miembros

## 🚫 Scope / Límites

- ❌ No crear repositorios
- ❌ No crear controladores
- ❌ No hacer llamadas a Firebase
- ❌ No incluir lógica de notificaciones
- ❌ Solo es la entidad de dominio

## ✅ Aceptación / Checklist

- [ ] Sigue GUIDELINES.md sección "TypeScript > Tipos"
- [ ] Incluye JSDoc en métodos públicos
- [ ] Archivo es exactamente: `backend/src/domain/entities/Group.ts`
- [ ] Clase se llama exactamente `Group`
- [ ] Tests en: `backend/src/domain/entities/__tests__/Group.spec.ts`

## 📚 Referencias

- GUIDELINES.md: Sección "TypeScript > Nombres de Variables"
- ARCHITECTURE.md: Sección "🗄️ Modelos de Datos"

````

### Ejemplo 2: Implementar Use Case
```markdown
# TAREA: Implementar CreateGroupUseCase

## 📝 Descripción
Use case que crea un nuevo grupo de Amigo Invisible.
Valida datos, crea la entidad Group, persiste en BD y retorna el grupo creado.

## 📍 Ubicación
- Archivo: `backend/src/application/use-cases/CreateGroupUseCase.ts`
- DTO: `backend/src/application/dto/CreateGroupDTO.ts`

## 🏗️ Modelo/Referencia
```typescript
// DTO esperado
export interface CreateGroupDTO {
  name: string;
  description?: string;
  budgetLimit: number;
  adminId: string;
}

// Use Case debe retornar Group (de domain/entities)
````

Referencia: Similar a patrón en GUIDELINES.md, sección "Node.js/Express > Use Cases"

## 🎯 Requisitos Específicos

- [ ] Inyectar `IGroupRepository` en constructor
- [ ] Validar que `budgetLimit > 0`, sino lanzar `InvalidBudgetError`
- [ ] Validar que `name` no esté vacío, sino lanzar `ValidationError`
- [ ] Usar `Group.create()` para crear la entidad
- [ ] Guardar en repositorio usando `repository.create(group)`
- [ ] Retornar la entidad creada
- [ ] Capturar errores de repositorio y re-lanzarlos

## 🚫 Scope / Límites

- ❌ No crear notificaciones
- ❌ No agregar autenticación
- ❌ No crear controller o endpoint
- ❌ No hacer logging más allá de errores
- ❌ Solo lógica de creación

## ✅ Aceptación / Checklist

- [ ] Sigue patrón de GUIDELINES.md > Node.js/Express > Use Cases
- [ ] JSDoc documenta parámetros, retorno y excepciones
- [ ] Tests en `backend/src/application/use-cases/__tests__/CreateGroupUseCase.spec.ts`
- [ ] Tests incluyen casos: éxito, budget inválido, name vacío
- [ ] Cobertura >90%

## 📚 Referencias

- GUIDELINES.md: "Buenas Prácticas > Inyección de Dependencias"
- GUIDELINES.md: "Buenas Prácticas > Error Handling"
- ARCHITECTURE.md: "🎯 Use Cases (MVP)"

```

---

## 🎓 Guía para el que Asigna

1. **Sé específico:** Incluye rutas exactas, nombres exactos, ejemplos
2. **Define límites:** Qué SÍ y qué NO debe hacer
3. **Referencia código:** Apunta a ejemplos similares existentes
4. **Documenta contexto:** Por qué esta tarea, qué problema resuelve
5. **Checklist claro:** Qué significa "estar listo"

### ❌ Mala tarea:
```

"Implementar autenticación para que los usuarios puedan loguearse"

```

### ✅ Buena tarea:
```

TAREA: Crear FirebaseAuthAdapter

Ubicación exacta: backend/src/adapters/auth/FirebaseAuthAdapter.ts
Debe implementar interfaz IAuthPort (ver backend/src/ports/IAuthPort.ts)
Métodos requeridos: loginWithEmail(), loginWithGoogle(), logout(), getCurrentUser()
NO incluir: Controllers, endpoints, manejo de tokens
Sigue patrón en GUIDELINES.md > Inyección de Dependencias

```

---

## 📞 Comunicación AI ↔ Humano

Si la IA está en duda sobre una tarea, debe preguntar:

**IA pregunta:**
- "La tarea dice [X], pero también necesito [Y]. ¿Es parte del scope?"
- "¿Debo crear archivo [Z] o ya existe?"
- "La validación ¿se hace en Use Case o en Controller?"

**Respuesta rápida esperada:**
- "Sí, incluye [Y]"
- "No existe, créalo"
- "Siempre en Use Case"

---

**Última actualización:** Enero 2026
```
