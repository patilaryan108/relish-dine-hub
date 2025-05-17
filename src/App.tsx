
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Billing from "./pages/Billing";
import BillView from "./pages/BillView";
import Employee from "./pages/Employee";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";
import { defaultMenuItems } from "./utils/defaultMenuItems";

const queryClient = new QueryClient();

const App = () => {
  // Initialize default data if none exists
  useEffect(() => {
    // Initialize default users
    const existingUsers = localStorage.getItem('karunadu_users');
    if (!existingUsers) {
      // Create default accounts
      const defaultUsers = [
        {
          id: '1',
          name: 'Restaurant Owner',
          email: 'owner@karunadu.com',
          password: 'owner123',
          role: 'owner'
        },
        {
          id: '2',
          name: 'Staff Member',
          email: 'staff@karunadu.com',
          password: 'staff123',
          role: 'staff'
        }
      ];
      localStorage.setItem('karunadu_users', JSON.stringify(defaultUsers));
    }
    
    // Initialize default menu items
    const existingMenu = localStorage.getItem('karunadu_menu_items');
    if (!existingMenu) {
      localStorage.setItem('karunadu_menu_items', JSON.stringify(defaultMenuItems));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/bill-view" element={<BillView />} />
                  <Route path="/employee" element={<Employee />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
