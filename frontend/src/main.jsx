import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Landing = lazy(() => import("./pages/Landing.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const TaskDetail = lazy(() => import("./pages/TaskDetail.jsx"));
const Tasks = lazy(() => import("./pages/Tasks.jsx"));
const Team = lazy(() => import("./pages/Team.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster richColors position="top-right" closeButton />
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-950 text-sm font-black text-white">Loading TaskFlow...</div>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/tasks/:id" element={<TaskDetail />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Route>
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
