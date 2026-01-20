# 📚 INVFriend - Índice de Documentación

**¿Dónde buscar?** Encontrá lo que necesitás en este índice.

---

## 🚀 Comenzar Aquí

| Si quieres...       | Lee...                           | Tiempo |
| ------------------- | -------------------------------- | ------ |
| **Entender qué es** | [README.md](./README.md)         | 10 min |
| **Setup completo**  | README.md + backend/.env.example | 20 min |

---

## 🏗️ Documentación Técnica

| Documento                                                | Propósito                                                                 | Para quién                   | Cuándo leer        |
| -------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------- | ------------------ |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                     | **Diseño técnico completo** - Capas hexagonales, modelos de datos, flujos | Desarrolladores, Arquitectos | Antes de programar |
| [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) | **Hoja de referencia visual** - Diagramas, flujos, ejemplo                | Desarrolladores              | Durante desarrollo |
| [GUIDELINES.md](./GUIDELINES.md)                         | **Cómo programar aquí** - Convenciones, estándares, buenas prácticas      | Desarrolladores              | Mientras codeas    |

---

## ✍️ Desarrollo

| Documento                                                                             | Propósito                                                    | Para quién                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------- |
| [GUIDELINES.md](./GUIDELINES.md#-control-de-scope-para-ia) - Sección Control de Scope | **Asignar tareas a IA** sin que se salga del scope           | Product Owners, Arquitectos |
| [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)                                                | **Plantilla para tareas claras** - Ejemplos reales incluidos | Quién asigna tareas         |

---

## 📋 Matrices de Decisión Rápida

### "No sé por dónde empezar"

```
¿Es tu primer día?
  ├─ SÍ → Lee README.md
  └─ NO → Ve a "Tengo una tarea"
```

### "Tengo una tarea para implementar"

```
¿Es clara y específica?
  ├─ SÍ → Ve a GUIDELINES.md, sigue la estructura
  └─ NO → Usa TASK_TEMPLATE.md para formalizarla

Después:
  ├─ Leer ARCHITECTURE.md sección relevante
  ├─ Chequear GUIDELINES.md para convenciones
  └─ Codear, testear, documentar
```

### "Quiero empezar a codear"

```
1. Lee ARCHITECTURE.md
2. Lee GUIDELINES.md
3. Sigue flujo de git (branch, commit, PR)
4. Implementa siguiendo GUIDELINES.md
```

### "No entiendo la arquitectura"

```
Sigue este orden:
  1. Lee ARCHITECTURE.md sección "📐 Arquitectura Hexagonal"
  2. Mira diagramas en ARCHITECTURE_QUICK_REF.md
  3. Lee ejemplo de feature en ARCHITECTURE_QUICK_REF.md "🚀 Ejemplo"
  4. Pregunta si no queda claro
```

### "Necesito asignar una tarea a IA"

```
1. Lee GUIDELINES.md sección "🎯 Control de Scope para IA"
2. Usa TASK_TEMPLATE.md como plantilla
3. Incluye: QUÉ, DÓNDE, MODELO, LÍMITES
4. Sé específico y concreto
```

---

## 🗺️ Estructura de Carpetas

```
INVFriend/
├── 📄 README.md                    ← Empezar aquí
├── 🏗️ ARCHITECTURE.md              ← Diseño técnico
├── 🏗️ ARCHITECTURE_QUICK_REF.md    ← Referencia visual
├── 📋 GUIDELINES.md                ← Cómo codear
├── 📝 TASK_TEMPLATE.md             ← Plantilla de tareas
├── 📚 INDEX.md                     ← Este archivo
│
├── frontend/                       ← Angular app
│   ├── src/app/
│   │   ├── adapters/              ← Componentes, servicios HTTP
│   │   ├── domain/                ← Modelos, errores
│   │   ├── application/           ← Use cases, services
│   │   ├── ports/                 ← Interfaces
│   │   └── shared/                ← Utilities
│   └── [...]
│
├── backend/                        ← Node/Express API
│   ├── src/
│   │   ├── adapters/              ← Controllers, auth, repos
│   │   ├── domain/                ← Entities, errors
│   │   ├── application/           ← Use cases, services
│   │   ├── ports/                 ← Interfaces
│   │   └── shared/                ← Utilities
│   ├── .env.example               ← Variables de entorno
│   └── [...]
│
└── shared/                         ← Código compartido
    └── src/
        ├── models/
        ├── constants/
        └── utils/
```

---

## 🎯 Por Rol

### **Desarrollador Frontend (Angular)**

1. Lee [README.md](./README.md) - setup
2. Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - entiende modelos
3. Lee [GUIDELINES.md](./GUIDELINES.md) - convenciones Angular
4. Implementa componentes/servicios en `frontend/src/app/`

### **Desarrollador Backend (Node/Express)**

1. Lee [README.md](./README.md) - setup
2. Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - entiende capas
3. Lee [GUIDELINES.md](./GUIDELINES.md) - convenciones Node
4. Implementa controllers/use cases en `backend/src/`

### **Product Owner / Diseñador**

1. Lee [README.md](./README.md) - qué hace
2. Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - qué es posible
3. Usa [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) - asigna tareas claras

### **Contribuidor Externo**

1. Lee [README.md](./README.md) - qué es
2. Lee [GUIDELINES.md](./GUIDELINES.md) - estándares
3. Sigue convenciones
4. Abre PR

### **QA / Tester**

1. Lee [README.md](./README.md) - cómo ejecutar
2. Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - flujos principales
3. Prueba los 6 flujos en sección "🔄 Flujos Principales"

---

## 📖 Lecturas Recomendadas por Tiempo

### ⚡ 20 minutos (Mínimo)

- [README.md](./README.md) (10 min)
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) (10 min)

### 🔥 45 minutos (Recomendado)

- [README.md](./README.md) (10 min)
- [ARCHITECTURE.md](./ARCHITECTURE.md) (25 min)
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) (10 min)

### 📚 1.5 horas (Completo)

- [README.md](./README.md) (10 min)
- [ARCHITECTURE.md](./ARCHITECTURE.md) (25 min)
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) (15 min)
- [GUIDELINES.md](./GUIDELINES.md) (30 min)

---

## 🔍 Buscar Respuestas

### "¿Cómo se estructura el backend?"

→ [ARCHITECTURE.md](./ARCHITECTURE.md#-estructura-del-monorepo) - Sección "📁 Estructura del Monorepo"

### "¿Cuál es la convención de nombres?"

→ [GUIDELINES.md](./GUIDELINES.md#-estándares-de-nombrado)

### "¿Cómo creo un Use Case?"

→ [GUIDELINES.md](./GUIDELINES.md#nodejs-express) + [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md#-ejemplo-agregar-nueva-feature)

### "¿Cómo hago tests?"

→ [GUIDELINES.md](./GUIDELINES.md#-testing)

### "¿Cómo asigno tareas a IA?"

→ [GUIDELINES.md](./GUIDELINES.md#-control-de-scope-para-ia) + [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)

### "¿Cómo instalo el proyecto?"

→ [README.md](./README.md#-instalación-local)

### "¿Cuáles son los flujos principales?"

→ [ARCHITECTURE.md](./ARCHITECTURE.md#-flujos-principales) o [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md#-flujos-principales)

### "¿Qué es la arquitectura hexagonal?"

→ [ARCHITECTURE.md](./ARCHITECTURE.md#-arquitectura-hexagonal) + [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md#-capas-hexagonales)

### "¿Cómo contribuyo?"

→ Lee [GUIDELINES.md](./GUIDELINES.md) y sigue convenciones

### "¿Cómo manejo errores?"

→ [GUIDELINES.md](./GUIDELINES.md#-buenas-prácticas) - Sección "Error Handling"

---

## 🚨 Documentos Críticos (No Omitir)

**Estos son OBLIGATORIOS antes de programar:**

1. ✅ [README.md](./README.md) - Descripción y setup
2. ✅ [ARCHITECTURE.md](./ARCHITECTURE.md) - Estructura
3. ✅ [GUIDELINES.md](./GUIDELINES.md) - Cómo codear

**Estos son CRÍTICOS si asignas tareas:**

1. ✅ [GUIDELINES.md](./GUIDELINES.md#-control-de-scope-para-ia) - Control de scope
2. ✅ [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) - Plantilla de tareas

---

## 📞 Ayuda Rápida

### Si estás atrapado:

1. Busca en este INDEX
2. Lee el documento recomendado
3. Si aún tienes dudas, abre una **Discussión** en GitHub

### Si quieres mejorar la documentación:

Abre un PR con cambios. Por favor:

- Mantén la estructura de este INDEX
- Actualiza referencias cruzadas
- Usa la misma notación y formato

---

## 🔗 Links Directos

**Archivos de Configuración:**

- [firebase.json](./firebase.json) - Config Firebase
- [package.json](./package.json) - Scripts del proyecto
- [backend/.env.example](./backend/.env.example) - Variables de entorno
- [.gitignore](./.gitignore) - Archivos ignorados

**Licencia:**

- [LICENSE](./LICENSE) - MIT License

---

## 📊 Estadísticas de Documentación

| Documento                 | Líneas | Lectura | Cubre                   |
| ------------------------- | ------ | ------- | ----------------------- |
| README.md                 | ~180   | 10 min  | Descripción, setup      |
| ARCHITECTURE.md           | ~350   | 25 min  | Diseño técnico completo |
| GUIDELINES.md             | ~500   | 30 min  | Convenciones, prácticas |
| ARCHITECTURE_QUICK_REF.md | ~400   | 20 min  | Referencia visual       |
| TASK_TEMPLATE.md          | ~250   | 10 min  | Plantilla de tareas     |

**Total: ~1,680 líneas de documentación**

---

## ✅ Checklist para Nuevo Desarrollador

- [ ] He leído README.md
- [ ] He leído ARCHITECTURE.md
- [ ] He leído GUIDELINES.md
- [ ] Entiendo la estructura de carpetas
- [ ] Entiendo las 4 capas hexagonales
- [ ] Sé dónde están los modelos, use cases, adapters
- [ ] He visto un ejemplo en ARCHITECTURE_QUICK_REF.md
- [ ] Estoy listo para mi primera tarea ✨

---

## 🎓 Orden Recomendado de Lectura

```
1. Este archivo (INDEX.md)              ← Estás aquí
   │
   ├─ 2. README.md                      ← Qué es INVFriend (10 min)
   │   │
   │   ├─ 3. ARCHITECTURE.md            ← Cómo funciona (25 min)
   │   │   │
   │   │   └─ 4. ARCHITECTURE_QUICK_REF.md ← Referencia (15 min)
   │   │
   │   ├─ 5. GUIDELINES.md              ← Cómo codear (30 min)
   │   │
   │   └─ 6. Según tu rol:
   │       ├─ Dev Backend → GUIDELINES.md (Node section)
   │       ├─ Dev Frontend → GUIDELINES.md (Angular section)
   │       ├─ PO/Designer → TASK_TEMPLATE.md
   │       └─ Manager → GUIDELINES "scope control"
   │
   └─ ¡Listo! Comienza tu primera tarea
```

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026  
**Mantenedor:** INVFriend Team

---

## 🎉 ¡Bienvenido a INVFriend!

Tienes toda la información que necesitas.

**¿Por dónde empiezas?**

- **Si es tu primer día:** [README.md](./README.md)
- **Si tienes una tarea:** [GUIDELINES.md](./GUIDELINES.md) + [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Si necesitas asignar:** [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)

¡Adelante! 🚀
