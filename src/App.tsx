
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NotificationManager } from "@/components/NotificationManager";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    switch(page) {
      case 'home':
        window.location.href = '/';
        break;
      case 'profile':
        window.location.href = '/profile';
        break;
      case 'leaderboard':
        window.location.href = '/leaderboard';
        break;
      default:
        window.location.href = '/';
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NotificationManager />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100">
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
              <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
