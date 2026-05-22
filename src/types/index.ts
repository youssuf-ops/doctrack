// Os tipos são o "contrato" da aplicação.
// Qualquer dado que circule no DocTrack tem que respeitar estes tipos.

export type DocumentStatus = 'active' | 'shared' | 'expired' | 'pending'

export type DocumentOwner = {
  id: string
  name: string
  email: string
  avatar: string
}

export type DocumentEvent = {
  id: string
  action: 'created' | 'shared' | 'viewed' | 'modified' | 'expired'
  timestamp: string   // ISO 8601 — ex: "2026-05-20T09:30:00Z"
  actor: string       // nome de quem fez a ação
  details: string
}

export type Document = {
  id: string
  title: string
  description: string
  status: DocumentStatus
  owner: DocumentOwner
  createdAt: string
  updatedAt: string
  expiresAt: string | null   // null = sem expiração
  tags: string[]
  fileSize: number           // em bytes
  fileType: string           // ex: "PDF", "DOCX"
  sharedWith: string[]       // lista de emails
  history: DocumentEvent[]   // trail completo — conceito SSOT da ShelterZoom
  isVerified: boolean        // documento com token de verificação
}

// Este tipo é usado nas métricas do dashboard
export type DashboardStats = {
  totalDocuments: number
  activeDocuments: number
  sharedDocuments: number
  expiredDocuments: number
  pendingDocuments: number
}