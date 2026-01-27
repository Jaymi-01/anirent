# 🌌 AniRent - Cyberpunk Anime Rental Platform

AniRent is a high-performance, full-stack e-commerce application designed for the modern anime enthusiast. Built with **Next.js 15**, **TypeScript**, **Jikan API** and **Firebase**, it offers a seamless experience for renting anime titles in a visually stunning, neon-soaked cyberpunk environment.

## ✨ Features

### 🛒 Customer Experience
- **Dynamic Catalog:** Real-time anime data integrated via the Jikan API (MyAnimeList).
- **Smart Search:** Filter and find anime by title or genre.
- **Cyberpunk UI:** Modern, responsive interface using Tailwind CSS and Framer Motion for smooth transitions.
- **Persistent Cart:** Add multiple rentals and manage them effortlessly before checkout.
- **Order Tracking:** A dedicated "My Orders" page with a visual progress tracker (`Placed` → `Processing` → `Shipped` → `Delivered`).
- **Interactive Guides:** One-time onboarding popups to help new users find their way.

### 🔐 Authentication & Security
- **Google Sign-In:** Secure user authentication powered by Firebase.
- **Role-Based Access:** Restricted Admin Dashboard protected by environment-level email verification.
- **Firestore Rules:** Production-ready security rules to protect user data and order history.

### 🛠 Admin Management
- **Order Control Center:** View all customer orders and update their fulfillment status in real-time.
- **Price Management:** Override default API prices and apply "Price Slashes" (discounts) with instant global updates.
- **Real-time Analytics:** Monitor sales activity as it happens.

### ✉️ Communications
- **Email Confirmations:** Automated, beautifully styled order confirmation emails sent via Nodemailer and React Email.

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Source:** [Jikan API](https://jikan.moe/)
- **Emails:** [Nodemailer](https://nodemailer.com/)

## 🛠 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jaymi-01/anirent.git
   cd anirent
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Variables:**
   Create a `.env` file and add your credentials:
   ```env
   # Firebase Public Keys
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   
   # Admin Configuration
   NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com
   
   # Email Configuration (Nodemailer)
   EMAIL_USER=...
   EMAIL_PASS=...
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Deploy Firestore Rules:**
   Copy the contents of `firestore.rules` to your Firebase Console or deploy via CLI.
