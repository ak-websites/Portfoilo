🏗️ Dynamic Admin-Controlled Portfolio

A high-performance, full-stack CMS-driven portfolio built and maintained by Aashutosh Kuikel (@aKmsdfhjb) within the ak-websites organization.

This project was architected for Nayan Kuikel as a self-contained Content Management System, allowing the end-user to manage every aspect of their professional presence—from hero text to project galleries—directly through a secure dashboard without touching a single line of code.

🌐 Live Demo: nayan-rho.vercel.app

✨ Key Features

🔐 Live Admin Dashboard

Total Control: Edit Hero sections, About Me, Projects, Skills, and Education in real-time.

Message Management: A built-in log to read and manage inbound messages/RSVPs from the contact form.

Role-Based Access: Secure admin panel with the ability to provision access to other collaborators.

🎨 Advanced Theming System

6 Signature Themes: Architectural, Concrete, Luxury, Nordic, Precision, and Blueprint.

18 Visual Variants: Each theme supports Light, Dark, and a custom "Earth/Brown" mode.

Global Real-time Sync: Theme selections are stored in Firestore, updating the site's look for all visitors instantly.

🚀 Technical Excellence

Motion Design: Framer Motion-powered scroll reveals, parallax backgrounds, and fluid entrance transitions.

Modern Stack: Leveraging Vite 7 and React 19 for industry-leading performance.

Security First: URL sanitization helpers and protected route logic for the admin dashboard.

🛠️ Tech Stack

Layer

Technology

Frontend

React 19, TypeScript, Vite 7

Styling

TailwindCSS 4, Custom CSS Variables

Backend

Firebase (Firestore, Auth, Storage)

State Management

Zustand

Form Logic

React Hook Form + Zod

Routing

React Router DOM v7

Icons

Lucide React

🚀 Getting Started

1. Installation

git clone https://github.com/ak-websites/Portfoilo.git
cd Portfoilo
npm install


2. Firebase Configuration

Update src/lib/firebase.ts with your credentials:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


3. Local Development

npm run dev


📁 Project Structure

src/
├── components/
│   ├── admin/          # Dashboard panels (SocialLinks, UserManagement)
│   ├── sections/       # Modular UI sections (Hero, Projects, Skills)
│   └── social/         # Floating Social Sidebar logic
├── lib/
│   ├── firebase.ts     # Firebase initialization
│   ├── socialPlatforms.tsx  # Social link configs and icon mapping
│   └── themePresentation.ts # Per-theme animation variants
├── pages/
│   ├── Home.tsx        # Public portfolio view
│   ├── Admin.tsx       # Secured management dashboard
│   └── Login.tsx       # Authentication gateway
├── store/
│   ├── useAuth.ts      # Authentication state
│   ├── useContent.ts   # Firestore synchronization logic
│   └── useTheme.ts     # Theme and Mode configuration
└── utils/
    ├── cn.ts           # Tailwind class merging utility
    └── security.ts     # URL sanitization and protection helpers


👤 Developer & Maintainer

Aashutosh Kuikel

GitHub: @aKmsdfhjb

Organization: ak-websites

Project Subject: Nayan Kuikel

📄 License

Distributed under the MIT License. See LICENSE for more information.
