# 🎯 Study Spear

**Study Spear by Team Experia**

---

## 📚 About the Project

### 🔍 Problem Statement
Students often struggle to maintain a balance between academic responsibilities and extracurricular activities. A major challenge lies in managing their time efficiently, especially when going through extensive study materials—often spending hours on content that may have little relevance from an exam perspective.

Additionally, students frequently find it difficult to keep track of all their tasks and deadlines, leading to incomplete assignments or forgotten responsibilities. This lack of prioritization and task management results in stress, reduced productivity, and missed opportunities for academic and personal growth.

### 💡 The Idea

- **AI-Powered Energy-Aware Task Scheduling**
  Introduces a personal productivity model by first learning the user’s biological and behavioral peak hours through an onboarding questionnaire. Over time, it adapts to the user's real behavior.

- **Smart Content Prioritization with Adaptive Flashcards**
  Highlights the most relevant and exam-focused points, especially those less familiar to the learner.

---

## 👥 Team Experia

- **Uvais J** – Backend (Team Lead)
- **Muhammed Anees V** – Designer / UI
- **Mohammed Fahad** – UI / Backend

---

## ⚙️ Key Components

1. ✅ Reduce cognitive overload
2. ⚡ Optimized efficiency
3. 🔗 Seamless integration
4. 🎯 Personalized experience

---

# 🚀 Project Setup Guide

This project contains two parts:
- `backend/` → Express.js (Node.js server)
- `frontend/` → React (Vite)

Follow the steps below to get started.

---

## 📌 1. Fork & Clone the Repository

```bash
# Fork the repository on GitHub first
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

## 🔐 2. Set Up Environment Variables

Both frontend and backend require .env files. Sample .env.example files are provided in each folder.
### 👉 For Backend
```bash
cd backend
cp .env.example .env
```
Edit the .env file and fill in values like:
```bash
PORT=5000
DB_URL=your_database_url
JWT_SECRET=your_secret_key
```
### 👉 For Frontend
```bash
cd ../frontend
cp .env.example .env
```
Edit the .env file and fill in values like:
```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=MyApp
```
## 📦 3. Install Dependencies
Backend
```bash
cd backend
npm install
```
Frontend
```bash
cd ../frontend
npm install
```
▶️ 4. Run the Project Locally
Start Backend
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000 (or your configured port)

Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173 (or whatever Vite shows)

## ✅ 5. Test the App

Visit http://localhost:5173 in your browser.

Make sure the frontend connects to the backend using the API URL from the .env file.
