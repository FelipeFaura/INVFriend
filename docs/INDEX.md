# 📚 INVFriend - Documentation Index

**Where to search?** Find what you need in this index.

---

## 🚀 Get Started Here

| If you want...            | Read...                                      | Time   |
| ------------------------- | -------------------------------------------- | ------ |
| **See current progress**  | [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md) | 5 min  |
| **Understand what it is** | [README.md](./README.md)                     | 10 min |
| **Complete setup**        | README.md + backend/.env.example             | 20 min |

---

## 🏗️ Technical Documentation

| Document                                                 | Purpose                                                              | For whom               | When to read       |
| -------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------- | ------------------ |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                     | **Complete technical design** - Hexagonal layers, data models, flows | Developers, Architects | Before coding      |
| [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) | **Visual quick reference** - Diagrams, flows, examples               | Developers             | During development |
| [GUIDELINES.md](./GUIDELINES.md)                         | **How to code here** - Conventions, standards, best practices        | Developers             | While coding       |
| [GUIDELINES_DETAILED.md](./GUIDELINES_DETAILED.md)       | **Code examples & patterns** - Complete implementation examples      | Developers             | When implementing  |

---

## ✍️ Development

| Document                                                                           | Purpose                                                        | For whom                   |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------- |
| [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)                                       | **Live progress dashboard** - Sprint status, metrics, timeline | Everyone                   |
| [SPRINT_PLANNING.md](./SPRINT_PLANNING.md)                                         | **Current sprint roadmap** - Active and upcoming sprints       | Product Owners, Architects |
| [SPRINTS_ARCHIVE.md](./SPRINTS_ARCHIVE.md)                                         | **Completed sprints history** - Detailed past sprint records   | Developers, Reviewers      |
| [TASKS_BACKEND/README.md](./TASKS_BACKEND/README.md)                               | **Backend task tracker** - Completed and pending tasks         | Backend Developers         |
| [TASKS_FRONTEND/README.md](./TASKS_FRONTEND/README.md)                             | **Frontend task tracker** - Angular tasks and status           | Frontend Developers        |
| [GUIDELINES.md](./GUIDELINES.md#-control-de-scope-para-ia) - Scope Control Section | **Assign tasks to AI** without going out of scope              | Product Owners, Architects |
| [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)                                             | **Template for clear tasks** - Real examples included          | Task assigners             |

---

## 📋 Quick Decision Matrices

### "I don't know where to start"

```
Is it your first day?
  ├─ YES → Read README.md
  └─ NO → Go to "I have a task"
```

### "I have a task to implement"

```
Is it clear and specific?
  ├─ YES → Go to GUIDELINES.md, follow the structure
  └─ NO → Use TASK_TEMPLATE.md to formalize it

Need to see the big picture?
  ├─ Check PROJECT_PROGRESS.md for current status
  └─ Check SPRINT_PLANNING.md for context and dependencies

Then:
  ├─ Read ARCHITECTURE.md relevant section
  ├─ Check GUIDELINES.md for conventions
  └─ Code, test, document
```

### "I want to start coding"

```
1. Read ARCHITECTURE.md
2. Read GUIDELINES.md
3. Follow git flow (branch, commit, PR)
4. Implement following GUIDELINES.md
```

### "I don't understand the architecture"

```
Follow this order:
  1. Read ARCHITECTURE.md section "📐 Hexagonal Architecture"
  2. Look at diagrams in ARCHITECTURE_QUICK_REF.md
  3. Read feature example in ARCHITECTURE_QUICK_REF.md "🚀 Example"
  4. Ask if not clear
```

### "I need to assign a task to AI"

```
1. Check PROJECT_PROGRESS.md to see current sprint status
2. Check SPRINT_PLANNING.md to understand task context
3. Read GUIDELINES.md section "🎯 Scope Control for AI"
4. Use TASK_TEMPLATE.md as template
5. Include: WHAT, WHERE, MODEL, LIMITS
6. Be specific and concrete
```

---

## 🗺️ Folder Structure

```
INVFriend/
├── 📄 README.md                    ← Start here
├── 🏗️ ARCHITECTURE.md              ← Technical design
├── 🏗️ ARCHITECTURE_QUICK_REF.md    ← Visual reference
├── 📋 GUIDELINES.md                ← How to code
├── 📝 TASK_TEMPLATE.md             ← Task template
├── 📚 INDEX.md                     ← This file
│
├── frontend/                       ← Angular app
│   ├── src/app/
│   │   ├── adapters/              ← Components, HTTP services
│   │   ├── domain/                ← Models, errors
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
│   ├── .env.example               ← Environment variables
│   └── [...]
│
└── shared/                         ← Shared code
    └── src/
        ├── models/
        ├── constants/
        └── utils/
```

---

## 🎯 By Role

### **Frontend Developer (Angular)**

1. Read [README.md](./README.md) - setup
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - understand models
3. Read [GUIDELINES.md](./GUIDELINES.md) - Angular conventions
4. Implement components/services in `frontend/src/app/`

### **Backend Developer (Node/Express)**

1. Read [README.md](./README.md) - setup
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - understand layers
3. Read [GUIDELINES.md](./GUIDELINES.md) - Node conventions
4. Implement controllers/use cases in `backend/src/`

### **Product Owner / Designer**

1. Read [README.md](./README.md) - what it does
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - what's possible
3. Use [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) - assign clear tasks

### **External Contributor**

1. Read [README.md](./README.md) - what it is
2. Read [GUIDELINES.md](./GUIDELINES.md) - standards
3. Follow conventions
4. Open PR

### **QA / Tester**

1. Read [README.md](./README.md) - how to run
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - main flows
3. Test the 6 flows in section "🔄 Main Flows"

---

## 📖 Recommended Reading by Time

### ⚡ 20 minutes (Minimum)

- [README.md](./README.md) (10 min)
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) (10 min)

### 🔥 45 minutes (Recommended)

- [README.md](./README.md) (10 min)
- [ARCHITECTURE.md](./ARCHITECTURE.md) (25 min)
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) (10 min)

### 📚 1.5 hours (Complete)

- [README.md](./README.md) (10 min)
- [ARCHITECTURE.md](./ARCHITECTURE.md) (25 min)
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) (15 min)
- [GUIDELINES.md](./GUIDELINES.md) (30 min)

### 🎓 2+ hours (Deep Dive)

- All of the above
- [GUIDELINES_DETAILED.md](./GUIDELINES_DETAILED.md) (40 min)
- [SPRINT_PLANNING.md](./SPRINT_PLANNING.md) (15 min)

---

## 🔍 Find Answers

### "How is the backend structured?"

→ [ARCHITECTURE.md](./ARCHITECTURE.md#-estructura-del-monorepo) - Section "📁 Monorepo Structure"

### "What is the naming convention?"

→ [GUIDELINES.md](./GUIDELINES.md#-estándares-de-nombrado)

### "How do I create a Use Case?"

→ [GUIDELINES.md](./GUIDELINES.md#nodejs-express) + [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md#-ejemplo-agregar-nueva-feature)

### "How do I do tests?"

→ [GUIDELINES.md](./GUIDELINES.md#-testing)

### "How do I assign tasks to AI?"

→ [GUIDELINES.md](./GUIDELINES.md#-control-de-scope-para-ia) + [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)

### "How do I install the project?"

→ [README.md](./README.md#-instalación-local)

### "What are the main flows?"

→ [ARCHITECTURE.md](./ARCHITECTURE.md#-flujos-principales) or [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md#-flujos-principales)

### "What is hexagonal architecture?"

→ [ARCHITECTURE.md](./ARCHITECTURE.md#-arquitectura-hexagonal) + [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md#-capas-hexagonales)

### "How do I contribute?"

→ Read [GUIDELINES.md](./GUIDELINES.md) and follow conventions

### "How do I handle errors?"

→ [GUIDELINES.md](./GUIDELINES.md#-buenas-prácticas) - Section "Error Handling"

---

## 🚨 Critical Documents (Do Not Skip)

**These are MANDATORY before coding:**

1. ✅ [README.md](./README.md) - Description and setup
2. ✅ [ARCHITECTURE.md](./ARCHITECTURE.md) - Structure
3. ✅ [GUIDELINES.md](./GUIDELINES.md) - How to code

**These are CRITICAL if you assign tasks:**

1. ✅ [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md) - Current status
2. ✅ [SPRINT_PLANNING.md](./SPRINT_PLANNING.md) - Project roadmap
3. ✅ [GUIDELINES.md](./GUIDELINES.md#-control-de-scope-para-ia) - Scope control
4. ✅ [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) - Task template

---

## 📞 Quick Help

### If you're stuck:

1. Search in this INDEX
2. Read the recommended document
3. If you still have questions, open a **Discussion** on GitHub

### If you want to improve documentation:

Open a PR with changes. Please:

- Keep the structure of this INDEX
- Update cross-references
- Use the same notation and format

---

## 🔗 Direct Links

**Configuration Files:**

- [firebase.json](./firebase.json) - Firebase config
- [package.json](./package.json) - Project scripts
- [backend/.env.example](./backend/.env.example) - Environment variables
- [.gitignore](./.gitignore) - Ignored files

**License:**

- [LICENSE](./LICENSE) - MIT License

---

## 📊 Documentation Statistics

| Document                  | Lines | Reading | Covers                    |
| ------------------------- | ----- | ------- | ------------------------- |
| README.md                 | ~180  | 10 min  | Description, setup        |
| ARCHITECTURE.md           | ~350  | 25 min  | Complete technical design |
| GUIDELINES.md             | ~500  | 30 min  | Conventions, practices    |
| ARCHITECTURE_QUICK_REF.md | ~400  | 20 min  | Visual reference          |
| TASK_TEMPLATE.md          | ~250  | 10 min  | Task template             |
| SPRINT_PLANNING.md        | ~800  | 40 min  | Project roadmap, 32 tasks |

**Total: ~2,880 lines of documentation**

---

## ✅ New Developer Checklist

- [ ] I've read README.md
- [ ] I've read ARCHITECTURE.md
- [ ] I've read GUIDELINES.md
- [ ] I understand the folder structure
- [ ] I understand the 4 hexagonal layers
- [ ] I know where models, use cases, adapters are
- [ ] I've seen an example in ARCHITECTURE_QUICK_REF.md
- [ ] I'm ready for my first task ✨

---

## 🎓 Recommended Reading Order

```
1. This file (INDEX.md)                 ← You are here
   │
   ├─ 2. README.md                      ← What is INVFriend (10 min)
   │   │
   │   ├─ 3. ARCHITECTURE.md            ← How it works (25 min)
   │   │   │
   │   │   └─ 4. ARCHITECTURE_QUICK_REF.md ← Reference (15 min)
   │   │
   │   ├─ 5. GUIDELINES.md              ← How to code (30 min)
   │   │
   │   └─ 6. Based on your role:
   │       ├─ Backend Dev → GUIDELINES.md (Node section)
   │       ├─ Frontend Dev → GUIDELINES.md (Angular section)
   │       ├─ PO/Designer → TASK_TEMPLATE.md
   │       └─ Manager → GUIDELINES "scope control"
   │
   └─ Ready! Begin your first task
```

---

**Version:** 1.0.0  
**Last updated:** January 2026  
**Maintainer:** INVFriend Team

---

## 🎉 Welcome to INVFriend!

You have all the information you need.

**Where do you start?**

- **If it's your first day:** [README.md](./README.md)
- **If you have a task:** [GUIDELINES.md](./GUIDELINES.md) + [ARCHITECTURE.md](./ARCHITECTURE.md)
- **If you need to assign:** [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)

Let's go! 🚀
