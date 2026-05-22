import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";

// QueryClient é o gestor de cache global do TanStack Query
// Configuramos comportamentos default aqui — aplicam-se a todos os hooks
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // tenta 1 vez em caso de erro (default é 3)
      refetchOnWindowFocus: false, // não re-fetcha quando voltas ao tab
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools — aparece como botão flutuante no browser, só em desenvolvimento */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
