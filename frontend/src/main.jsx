import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import HeroPage from "./pages/heroPage.jsx";
import FlashcardLearningPlatform from "./pages/flashCardFiles.jsx";
import TodoPage from "./components/todo.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import LoginPage from "./pages/loginPage.jsx";
import RegisterPage from "./pages/registerPage.jsx";
import OnboardingPage from "./pages/onboardingPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/flashcards" element={<FlashcardLearningPlatform/>} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
