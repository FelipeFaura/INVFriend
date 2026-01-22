# INVFriend 🎁

**INVFriend** is a web and mobile application to organize Secret Santa raffles in a simple and secure way. Users can create groups, perform automatic raffles, and share their gift wishes with their assigned secret santa.

## 🚀 Features

- ✅ Create and manage Secret Santa groups
- ✅ Authentication with email/password and Google Login
- ✅ Automatic and fair raffle for groups
- ✅ Wishes management (text and URLs)
- ✅ Privacy guaranteed: you only see your secret santa
- ✅ Notifications when the raffle is performed
- ✅ Responsive design for web and mobile

## 🛠️ Technology Stack

- **Frontend:** Angular 18+
- **Backend:** Node.js + Express
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Authentication
- **Hosting:** Firebase Hosting (frontend) + Cloud Functions (backend)
- **Architecture:** Hexagonal

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn as package manager
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase account (free)
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-user/INVFriend.git
cd INVFriend
```

### 2. Configure Firebase

```bash
firebase login
firebase init
```

Select the options:

- Database: Firebase Realtime Database
- Hosting: Firebase Hosting
- Functions: Cloud Functions (backend)
- Authentication: yes

### 3. Install dependencies

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

### 4. Environment variables

Create the necessary configuration files:

**`frontend/.env`:**

```
ANGULAR_APP_FIREBASE_API_KEY=your_api_key
ANGULAR_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
ANGULAR_APP_FIREBASE_DATABASE_URL=your_database_url
ANGULAR_APP_FIREBASE_PROJECT_ID=your_project_id
```

**`backend/.env`:**

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
NODE_ENV=development
```

### 5. Run locally

**Terminal 1 - Frontend:**

```bash
cd frontend
ng serve
```

Access `http://localhost:4200`

**Terminal 2 - Backend:**

```bash
cd backend
npm run dev
```

The server will be at `http://localhost:3000`

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture, data models, and technical specifications
- [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) - Quick reference and visual guide
- [GUIDELINES.md](./GUIDELINES.md) - Development guides and code conventions

## 🤝 Contributing

This is a personal project developed with AI support. See [GUIDELINES.md](./GUIDELINES.md) for code conventions and task scope.

## 📄 License

MIT License - See LICENSE file for more details

## 💬 Questions or Suggestions

Open an issue in the repository to report bugs or suggest improvements.

---

**MVP Version:** 1.0.0
**Last update:** January 2026
