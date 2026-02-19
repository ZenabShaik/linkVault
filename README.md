# ✨ LinkVault — Smart Bookmark Manager

A premium, real-time bookmark management application built with modern full-stack architecture.

This project demonstrates secure authentication, real-time data synchronization, and a polished production-grade UI.

---

## 🚀 Live Demo

🔗 https://link-vault-omega-liard.vercel.app

---

## 🧠 Key Features

### 🔐 Google OAuth Authentication
- Secure login using Supabase + Google OAuth
- No password handling required
- Session persistence across refresh

---

### 📌 Personal Bookmark Vault
- Each user has a **private bookmark space**
- Data isolation enforced using Supabase Row Level Security (RLS)

---

### ⚡ Real-Time Sync
- Bookmarks update instantly across tabs
- Uses Supabase Realtime WebSocket subscriptions

---

### ➕ Bookmark Management
Users can:
- Add bookmarks with title + URL
- Delete their own bookmarks
- Open links directly

---

### 🎨 Premium UI/UX
- Glassmorphism design
- Smooth micro-animations (Framer Motion)
- Responsive modern layout
- Favicon auto-fetch for each bookmark

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-------------|
Frontend | Next.js App Router |
Auth | Supabase Auth |
Database | Supabase Postgres |
Realtime | Supabase Realtime |
Styling | Tailwind CSS |
Animations | Framer Motion |
Deployment | Vercel |

---

## 🔒 Security Implementation

Row Level Security policies ensure:

- Users can only view their own bookmarks
- Insert/Delete restricted to authenticated user ID

Example policy logic:

auth.uid() = user_id


---

## ⚡ Challenges Faced & Solutions

### 1️⃣ OAuth Redirect Issues on Production
**Problem:** Google login redirected to localhost after deployment.

**Solution:** Configured correct Site URL and Redirect URLs in Supabase + Google Cloud Console.

---

### 2️⃣ Real-Time Updates Not Reflecting Instantly
**Problem:** Bookmarks only appeared after refresh.

**Solution:** Implemented Supabase Realtime subscriptions and manual state refresh after mutations.

---

### 3️⃣ Secure Multi-User Data Isolation
**Problem:** Prevent users from accessing others' bookmarks.

**Solution:** Implemented strict RLS policies using `auth.uid()` checks.

---

## 📈 Performance & Architecture Highlights

- Optimized client-side rendering
- Minimal API calls
- Efficient WebSocket realtime sync
- Fully serverless deployment

---

## 👨‍💻 Author

Zenab Shaik  
MERN Full Stack Developer  
Specializing in scalable web apps and AI-integrated systems.

---

## 🎯 Project Goal

This application demonstrates:

- Secure authentication workflows
- Real-time full-stack architecture
- Production-ready UI design
- Clean, maintainable code structure

---

