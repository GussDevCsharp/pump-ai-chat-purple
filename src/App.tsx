
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import BusinessGenerator from "./pages/BusinessGenerator";
import Themes from "./pages/Themes";
import Signup from "./pages/Signup";
import ProfileComplete from "./pages/ProfileComplete";
import PromptLogs from "./pages/PromptLogs";
import Privacy from "./pages/Privacy";
import Subscription from "./pages/Subscription";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Toast components wrapped with location check
const ToastProviders = () => {
  const location = useLocation();
  const isChatRoute = location.pathname === "/chat";
  
  if (isChatRoute) {
    return null; // Don't render any toast providers on chat route
  }
  
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
};

const queryClient = new QueryClient();

const App = () => {
  // Verificar a preferência de tema ao iniciar o app
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/business-generator" element={<BusinessGenerator />} />
              <Route path="/profile-complete" element={<ProfileComplete />} />
              <Route path="/prompt-logs" element={<PromptLogs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastProviders />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
