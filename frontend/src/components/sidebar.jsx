import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckSquare,
  Book,
  Clock,
  Home,
  Settings,
  BarChart,
  BookOpen,
  Users,
  CloudLightning,
  Brain,
  PersonStanding,
  Heart,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Update activeTab based on current path
  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
        setActiveTab("home");
        break;
      case "/todo":
        setActiveTab("tasks");
        break;
      case "/flashcards":
        setActiveTab("flashcards");
        break;
      // Add other cases as needed
      default:
        break;
    }
  }, [location.pathname]);

  const handleTabClick = (id) => {
    setActiveTab(id);
    switch (id) {
      case "home":
        navigate("/dashboard");
        break;
      case "tasks":
        navigate("/todo");
        break;
      case "flashcards":
        navigate("/flashcards");
        break;
      // Add other navigation cases as needed
      default:
        break;
    }
  };

  return (
    <div className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold hidden md:block">StudySpear</h1>
        <div className="md:hidden flex justify-center">
          <BookOpen size={24} />
        </div>
      </div>

      <nav className="flex-1 pt-4">
        <ul>
          {[
            { id: "home", icon: Home, label: "Dashboard" },
            { id: "tasks", icon: CloudLightning, label: "Energy Manager" },
            { id: "flashcards", icon: Brain, label: "Memorizers" },
          ].map((item) => (
            <li key={item.id} className="mb-1">
              <button
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center py-2 px-4 w-full ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3 hidden md:block">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center py-2 gap-2 text-gray-600 hover:text-gray-900 w-full">
          <span className="ml-3 hidden md:block">Made by Exeperia</span>

          <Heart size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
