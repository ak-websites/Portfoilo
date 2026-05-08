````md
# 🏗️ Dynamic Admin-Controlled Portfolio

A high-performance, full-stack CMS-driven portfolio built and maintained by Aashutosh Kuikel (`@aKmsdfhjb`) within the **ak-websites** organization.

This project was architected for **Nayan Kuikel** as a fully self-contained Content Management System (CMS), allowing the end-user to manage every aspect of their professional presence — from hero text to project galleries — directly through a secure dashboard without touching a single line of code.

---

## 🌐 Live Demo

🔗 https://nayan-rho.vercel.app

---

# ✨ Key Features

## 🔐 Live Admin Dashboard

The core of this project is a robust administrative interface that gives non-technical users complete control over their digital identity.

### ✅ Real-Time Content Editing
Instantly update:
- Hero Sections
- About Me
- Projects
- Skills
- Education
- Experience

### 🖼️ Asset Management
Integrated Firebase Storage support for:
- Project thumbnails
- Gallery uploads
- Image management

### 📩 Message Management
A centralized communication hub to:
- Read messages
- Organize inquiries
- Delete RSVPs and contact submissions

### 👥 Role-Based Access Control (RBAC)
Secure authentication system allowing:
- Admin provisioning
- Collaborator access
- Permission revocation

---

# 🎨 Advanced Theming & Design System

Designed to be visually versatile with a sophisticated theme engine that goes far beyond simple color switching.

## 🎭 6 Unique Architectural Themes
Choose from:
- Architectural
- Concrete
- Luxury
- Nordic
- Precision
- Blueprint

Each theme includes:
- Custom typography
- Distinct border radii
- Unique background patterns
- Motion-specific animations

## 🌗 18 Visual Modes
Every theme supports:
- Light Mode
- Dark Mode
- Earth/Brown Mode

Resulting in a total of:

> **18 unique visual combinations**

## 🔄 Global Synchronization
Theme and mode selections are synchronized using Firestore, allowing the entire site appearance to update for all visitors in real-time.

---

# 🚀 Technical Excellence

Built with modern web standards, smooth motion design, and optimized performance.

## ✨ Fluid Motion Design
Powered by **Framer Motion** featuring:
- Scroll-triggered reveals
- Parallax animated blobs
- Theme-specific entrance animations

## ⚡ Cutting-Edge Stack
Optimized using:
- React 19
- Vite 7
- TypeScript

Delivering:
- Lightning-fast load times
- Excellent developer experience
- Smooth UI interactions

## 🔒 Security & Reliability
Includes:
- URL sanitization helpers
- Protected admin routes
- Zod-based schema validation
- Secure Firebase authentication flow

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 7 |
| Styling | TailwindCSS 4, Custom CSS Variables |
| Backend | Firebase (Firestore, Auth, Storage) |
| State Management | Zustand |
| Forms & Validation | React Hook Form + Zod |
| Routing | React Router DOM v7 |
| Animations | Framer Motion |
| Icons | Lucide React |

---

# 🚀 Getting Started

## 1️⃣ Installation

Clone the repository and install dependencies.

```bash
git clone https://github.com/ak-websites/Portfoilo.git

cd Portfoilo

npm install
````

---

## 2️⃣ Firebase Configuration

Create a Firebase project and configure:

`src/lib/firebase.ts`

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 3️⃣ Firestore Rules & Setup

### 🔐 Authentication

Enable:

* Email/Password Authentication

Inside Firebase Console.

### 🗄️ Firestore

Initialize collections:

* content
* projects
* experience
* education
* messages
* users

### 👑 Initial Admin Setup

After registering through `/login`, manually set:

```json
role: "admin"
```

Inside the corresponding Firestore user document.

This unlocks the admin dashboard.

---

## 4️⃣ Local Development

Run the development server with HMR:

```bash
npm run dev
```

---

# 📁 Project Structure

```bash
src/
├── components/
│   ├── admin/                 # Dashboard panels and CMS editors
│   ├── sections/              # Public UI sections
│   └── social/                # Floating social sidebar animations
│
├── lib/
│   ├── firebase.ts            # Firebase initialization
│   ├── socialPlatforms.tsx    # Dynamic social platform mapping
│   └── themePresentation.ts   # Theme motion + style logic
│
├── pages/
│   ├── Home.tsx               # Public portfolio
│   ├── Admin.tsx              # Protected dashboard
│   └── Login.tsx              # Admin authentication
│
├── store/
│   ├── useAuth.ts             # Auth + RBAC state
│   ├── useContent.ts          # Firestore sync logic
│   └── useTheme.ts            # Theme + visual mode state
│
└── utils/
    ├── cn.ts                  # Tailwind class merging helper
    └── security.ts            # Sanitization + protection helpers
```

---

# 👤 Developer & Maintainer

## Aashutosh Kuikel

Architect and lead maintainer of this portfolio system.

* GitHub: `@aKmsdfhjb`
* Organization: `ak-websites`
* Project Subject: `Nayan Kuikel`

---

# 📄 License

Distributed under the MIT License.

See the `LICENSE` file for more information.

```
```
