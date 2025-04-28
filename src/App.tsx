
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatingChatButton } from "./components/support/FloatingChatButton";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import BusinessGenerator from "./pages/BusinessGenerator";
import Themes from "./pages/Themes";
import Signup from "./pages/Signup";
import ProfileComplete from "./pages/ProfileComplete";
import PromptLogs from "./pages/PromptLogs";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <div className="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/chat" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/business-generator" element={<BusinessGenerator />} />
              <Route path="/profile/complete" element={<ProfileComplete />} />
              <Route path="/prompt-logs" element={<PromptLogs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingChatButton />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  </React.StrictMode>
);

export default App;
