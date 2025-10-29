import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Importando o componente Layout
import Index from "./pages/Index";
import Triagem from "./pages/Triagem"; // Importando a nova página de Triagem
import Teleorientacao from "./pages/Teleorientacao"; // Importando a nova página de Teleorientacao
import Relatorios from "./pages/Relatorios"; // Importando a nova página de Relatorios
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout> {/* Envolvendo as rotas com o Layout */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/triagem" element={<Triagem />} />
            <Route path="/teleorientacao" element={<Teleorientacao />} />
            <Route path="/relatorios" element={<Relatorios />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;