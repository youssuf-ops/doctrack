import { z } from "zod";

// Schema Zod para o formulário de upload
// z.object() define a forma esperada dos dados
export const uploadDocumentSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título não pode ter mais de 100 caracteres"),

  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "Máximo 500 caracteres"),

  tags: z
    .string()
    .optional()
    .transform((val) =>
      // Converte string "tag1, tag2" em array ["tag1", "tag2"]
      val
        ? val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    ),

  expiresAt: z.string().optional().nullable(),

  sharedWith: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean)
        : [],
    ),
});

// z.infer extrai o tipo TypeScript do schema Zod automaticamente
// Não precisas de definir o tipo manualmente — Zod faz isso por ti
export type UploadDocumentFormData = z.infer<typeof uploadDocumentSchema>;

// Schema para filtros da lista de documentos
export const documentFilterSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(["all", "active", "shared", "expired", "pending"])
    .default("all"),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type DocumentFilter = z.infer<typeof documentFilterSchema>;
