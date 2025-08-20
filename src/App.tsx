import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { initializeDatabase } from "@/lib/mockDb";

// Pages
import Index from "./pages/Index";
import LoginCitizen from "./pages/LoginCitizen";
import RegisterCitizen from "./pages/RegisterCitizen";
import LoginOfficial from "./pages/LoginOfficial";
import RegisterOfficial from "./pages/RegisterOfficial";
import Admin from "./pages/Admin";
import RaiseGrievance from "./pages/RaiseGrievance";
import TrackGrievances from "./pages/TrackGrievances";
import OfficialDashboard from "./pages/OfficialDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize database on app start
    const initDb = async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initDb();
    
    // Set up auto-escalation every 30 seconds
    const autoEscalationInterval = setInterval(async () => {
      const { autoEscalateGrievances } = await import('@/lib/sla');
      const escalatedGrievances = autoEscalateGrievances();
      
      if (escalatedGrievances.length > 0) {
        const { toast } = await import('@/hooks/use-toast');
        toast({
          title: "Auto-Escalation",
          description: `${escalatedGrievances.length} grievance(s) escalated due to SLA breach.`,
          variant: "destructive"
        });
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(autoEscalationInterval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login-citizen" element={<LoginCitizen />} />
                <Route path="/register-citizen" element={<RegisterCitizen />} />
                <Route path="/login-official" element={<LoginOfficial />} />
                <Route path="/register-official" element={<RegisterOfficial />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/raise" element={<RaiseGrievance />} />
                <Route path="/track" element={<TrackGrievances />} />
                <Route path="/official" element={<OfficialDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
