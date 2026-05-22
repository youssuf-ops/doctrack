import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MOCK_DOCUMENTS,
  computeDashboardStats,
  simulateApiDelay,
} from "../data/documents";
import type { Document } from "../types";

// Chaves de query — centralizar evita typos e facilita invalidação
// É um padrão profissional chamado "query key factory"
export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  detail: (id: string) => [...documentKeys.all, "detail", id] as const,
  stats: () => [...documentKeys.all, "stats"] as const,
};

// Hook para buscar todos os documentos
export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: async () => {
      // Simula chamada a API com delay de rede
      await simulateApiDelay(600);
      return MOCK_DOCUMENTS;
    },
    staleTime: 1000 * 60 * 5, // dados considerados "frescos" por 5 minutos
  });
}

// Hook para buscar um documento por ID
export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      await simulateApiDelay(400);
      const doc = MOCK_DOCUMENTS.find((d) => d.id === id);
      if (!doc) throw new Error(`Document ${id} not found`);
      return doc;
    },
    enabled: Boolean(id), // só executa se houver um ID válido
  });
}

// Hook para as stats do dashboard
export function useDashboardStats() {
  return useQuery({
    queryKey: documentKeys.stats(),
    queryFn: async () => {
      await simulateApiDelay(300);
      return computeDashboardStats(MOCK_DOCUMENTS);
    },
    staleTime: 1000 * 60 * 2,
  });
}

// Hook para simular upload de documento
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDoc: Partial<Document>) => {
      await simulateApiDelay(1200); // upload demora mais
      // Numa API real: return fetch('/api/documents', { method: 'POST', body: ... })
      return { ...newDoc, id: `doc-${Date.now()}` };
    },
    onSuccess: () => {
      // Invalida o cache de documentos — força re-fetch automático
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.stats() });
    },
  });
}
