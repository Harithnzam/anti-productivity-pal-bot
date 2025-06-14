
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { NotificationManager } from "@/components/NotificationManager";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  
  // Update currentPage based on the actual route
  useEffect(() => {
    switch(location.pathname) {
      case '/':
        setCurrentPage('home');
        break;
      case '/profile':
        setCurrentPage('profile');
        break;
      case '/leaderboard':
        setCurrentPage('leaderboard');
        break;
      default:
        setCurrentPage('home');
    }
  }, [location.pathname]);
  
  const handlePageChange = (page: string) => {
    switch(page) {
      case 'home':
        navigate('/');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'leaderboard':
        navigate('/leaderboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
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
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NotificationManager />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
