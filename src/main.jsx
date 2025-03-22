import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import HeroPage from "./pages/heroPage.jsx";
import FlashcardPage from "./pages/flashCardPage.jsx";
import TodoPage from "./components/todo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
