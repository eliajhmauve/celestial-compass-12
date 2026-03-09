import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";
import OpeningAnimation from "@/components/OpeningAnimation";
import Index from "./pages/Index";
import BaZiInputPage from "./pages/BaZiInputPage";
import AnalysisPage from "./pages/AnalysisPage";
import RecordsPage from "./pages/RecordsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showIntro && <OpeningAnimation onComplete={handleIntroComplete} />}
        <BrowserRouter basename="/celestial-compass-12">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/input" element={<BaZiInputPage />} />
            <Route path="/analysis/:id" element={<AnalysisPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
