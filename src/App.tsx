"use client"

import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { initializeStorage } from "./utils/initStorage"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Investments from "./pages/Investments"
import InvestmentDetail from "./pages/InvestmentDetail"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import AdminDashboard from "./pages/AdminDashboard"
import PartnerDashboard from "./pages/PartnerDashboard"
import InvestorDashboard from "./pages/InvestorDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  const [storageInitialized, setStorageInitialized] = useState<boolean | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const result = await initializeStorage()
        setStorageInitialized(result)
      } catch (error) {
        console.error("Erro ao inicializar armazenamento:", error)
        setStorageInitialized(false)
      }
    }

    init()
  }, [])

  // Renderizar a aplicação independentemente do resultado da inicialização do armazenamento
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/investments/:id" element={<InvestmentDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredUserType="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parceiro"
                element={
                  <ProtectedRoute requiredUserType="parceiro">
                    <PartnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investidor"
                element={
                  <ProtectedRoute requiredUserType="investidor">
                    <InvestorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
