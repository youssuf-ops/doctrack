import type { Document, DashboardStats } from "../types";

// Dados simulados — estrutura idêntica ao que viria de uma API real
// Numa aplicação de produção, estes dados viriam de fetch('/api/documents')
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc-001",
    title: "Q1 2026 Financial Report",
    description:
      "Quarterly financial summary including revenue, expenses and projections for ShelterZoom internal use.",
    status: "active",
    owner: {
      id: "user-001",
      name: "Youssuf Abdula",
      email: "youssuf@albiclick.com",
      avatar: "YA",
    },
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-05-10T14:30:00Z",
    expiresAt: "2026-12-31T23:59:00Z",
    tags: ["finance", "Q1", "internal"],
    fileSize: 2048000,
    fileType: "PDF",
    sharedWith: ["cfo@company.com", "ceo@company.com"],
    isVerified: true,
    history: [
      {
        id: "evt-001",
        action: "created",
        timestamp: "2026-01-15T09:00:00Z",
        actor: "Youssuf Abdula",
        details: "Document created and uploaded",
      },
      {
        id: "evt-002",
        action: "shared",
        timestamp: "2026-01-16T10:00:00Z",
        actor: "Youssuf Abdula",
        details: "Shared with CFO and CEO",
      },
      {
        id: "evt-003",
        action: "viewed",
        timestamp: "2026-01-17T11:30:00Z",
        actor: "cfo@company.com",
        details: "Document viewed",
      },
    ],
  },
  {
    id: "doc-002",
    title: "Client NDA — TechCorp Partnership",
    description:
      "Non-disclosure agreement for the TechCorp strategic partnership initiative.",
    status: "shared",
    owner: {
      id: "user-001",
      name: "Youssuf Abdula",
      email: "youssuf@albiclick.com",
      avatar: "YA",
    },
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-15T16:00:00Z",
    expiresAt: "2027-03-01T00:00:00Z",
    tags: ["legal", "NDA", "partnership"],
    fileSize: 512000,
    fileType: "DOCX",
    sharedWith: ["legal@techcorp.com", "partner@techcorp.com"],
    isVerified: true,
    history: [
      {
        id: "evt-004",
        action: "created",
        timestamp: "2026-03-01T08:00:00Z",
        actor: "Youssuf Abdula",
        details: "NDA document created",
      },
      {
        id: "evt-005",
        action: "shared",
        timestamp: "2026-03-02T09:00:00Z",
        actor: "Youssuf Abdula",
        details: "Sent to TechCorp legal team",
      },
    ],
  },
  {
    id: "doc-003",
    title: "Product Roadmap H2 2025",
    description:
      "Internal product roadmap document for the second half of 2025.",
    status: "expired",
    owner: {
      id: "user-002",
      name: "Ana Silva",
      email: "ana@company.com",
      avatar: "AS",
    },
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-12-31T23:00:00Z",
    expiresAt: "2025-12-31T23:59:00Z",
    tags: ["product", "roadmap", "2025"],
    fileSize: 1024000,
    fileType: "PDF",
    sharedWith: [],
    isVerified: false,
    history: [
      {
        id: "evt-006",
        action: "created",
        timestamp: "2025-06-01T10:00:00Z",
        actor: "Ana Silva",
        details: "Roadmap created",
      },
      {
        id: "evt-007",
        action: "expired",
        timestamp: "2025-12-31T23:59:00Z",
        actor: "System",
        details: "Document expired automatically",
      },
    ],
  },
  {
    id: "doc-004",
    title: "Security Audit Report 2026",
    description:
      "Annual cybersecurity audit conducted by external team. Confidential.",
    status: "pending",
    owner: {
      id: "user-003",
      name: "Carlos Matos",
      email: "carlos@company.com",
      avatar: "CM",
    },
    createdAt: "2026-05-18T14:00:00Z",
    updatedAt: "2026-05-18T14:00:00Z",
    expiresAt: null,
    tags: ["security", "audit", "confidential"],
    fileSize: 3072000,
    fileType: "PDF",
    sharedWith: ["ciso@company.com"],
    isVerified: false,
    history: [
      {
        id: "evt-008",
        action: "created",
        timestamp: "2026-05-18T14:00:00Z",
        actor: "Carlos Matos",
        details: "Audit report uploaded, pending review",
      },
    ],
  },
  {
    id: "doc-005",
    title: "Employee Handbook v3.2",
    description: "Updated employee handbook with revised remote work policies.",
    status: "active",
    owner: {
      id: "user-004",
      name: "Maria Costa",
      email: "maria@company.com",
      avatar: "MC",
    },
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-04-20T11:00:00Z",
    expiresAt: null,
    tags: ["HR", "handbook", "policies"],
    fileSize: 768000,
    fileType: "PDF",
    sharedWith: ["all@company.com"],
    isVerified: true,
    history: [
      {
        id: "evt-009",
        action: "created",
        timestamp: "2026-02-10T09:00:00Z",
        actor: "Maria Costa",
        details: "Handbook v3.2 published",
      },
      {
        id: "evt-010",
        action: "modified",
        timestamp: "2026-04-20T11:00:00Z",
        actor: "Maria Costa",
        details: "Remote work section updated",
      },
    ],
  },
];

// Função que calcula as stats do dashboard a partir dos documentos
// Lógica pura — sem side effects, sem chamadas externas
export function computeDashboardStats(documents: Document[]): DashboardStats {
  return {
    totalDocuments: documents.length,
    activeDocuments: documents.filter((d) => d.status === "active").length,
    sharedDocuments: documents.filter((d) => d.status === "shared").length,
    expiredDocuments: documents.filter((d) => d.status === "expired").length,
    pendingDocuments: documents.filter((d) => d.status === "pending").length,
  };
}

// Simula delay de rede — para os hooks TanStack Query parecerem reais
export function simulateApiDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
