import {
  Card,
  Tag,
  Avatar,
  Typography,
  Timeline,
  Descriptions,
  Badge,
  Button,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ShareAltOutlined,
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useDocument } from "../../hooks/useDocuments";
import type { DocumentEvent, DocumentStatus } from "../../types";

const { Title, Text } = Typography;

// Config de status — mesma lógica do dashboard, reutilizável
const STATUS_CONFIG: Record<
  DocumentStatus,
  {
    color: string;
    label: string;
    badge: "success" | "processing" | "error" | "warning";
  }
> = {
  active: { color: "green", label: "Active", badge: "success" },
  shared: { color: "blue", label: "Shared", badge: "processing" },
  expired: { color: "red", label: "Expired", badge: "error" },
  pending: { color: "orange", label: "Pending", badge: "warning" },
};

// Ícone e cor para cada tipo de evento no timeline
const EVENT_CONFIG: Record<
  DocumentEvent["action"],
  { icon: React.ReactNode; color: string }
> = {
  created: { icon: <FileTextOutlined />, color: "#3b82f6" },
  shared: { icon: <ShareAltOutlined />, color: "#8b5cf6" },
  viewed: { icon: <EyeOutlined />, color: "#64748b" },
  modified: { icon: <EditOutlined />, color: "#f59e0b" },
  expired: { icon: <ClockCircleOutlined />, color: "#ef4444" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Props do componente — recebe o id e a função para voltar atrás
type DocumentDetailProps = {
  id: string;
  onBack: () => void;
};

export default function DocumentDetail({ id, onBack }: DocumentDetailProps) {
  const { data: document, isLoading, isError } = useDocument(id);

  // Estado de loading — skeleton enquanto os dados chegam
  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <div
          style={{
            height: 400,
            background: "#131720",
            borderRadius: 12,
            border: "1px solid #1e2433",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#475569" }}>Loading document...</Text>
        </div>
      </div>
    );
  }

  // Estado de erro — documento não encontrado
  if (isError || !document) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <ExclamationCircleOutlined style={{ fontSize: 48, color: "#ef4444" }} />
        <Title level={4} style={{ color: "#e2e8f0", marginTop: 16 }}>
          Document not found
        </Title>
        <Button onClick={onBack} style={{ marginTop: 8 }}>
          Go back
        </Button>
      </div>
    );
  }

  const status = STATUS_CONFIG[document.status];

  return (
    <div>
      {/* Header da página */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ color: "#94a3b8" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Title level={3} style={{ color: "#e2e8f0", margin: 0 }}>
              {document.title}
            </Title>
            {document.isVerified && (
              <SafetyCertificateOutlined
                style={{ color: "#22c55e", fontSize: 20 }}
              />
            )}
          </div>
          <Text style={{ color: "#475569", fontSize: 13 }}>
            {document.description}
          </Text>
        </div>
        <Badge
          status={status.badge}
          text={
            <Tag color={status.color} style={{ borderRadius: 6, fontSize: 13 }}>
              {status.label}
            </Tag>
          }
        />
      </div>

      {/* Grid principal — 2 colunas */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}
      >
        {/* Coluna esquerda — detalhes + ownership trail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Metadados do documento */}
          <Card
            title={<Text style={{ color: "#e2e8f0" }}>Document Details</Text>}
            style={{
              background: "#131720",
              border: "1px solid #1e2433",
              borderRadius: 12,
            }}
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item
                label={<Text style={{ color: "#475569" }}>File Type</Text>}
              >
                <Tag
                  style={{
                    background: "#1e3a5f",
                    border: "none",
                    color: "#3b82f6",
                  }}
                >
                  {document.fileType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text style={{ color: "#475569" }}>File Size</Text>}
              >
                <Text style={{ color: "#e2e8f0" }}>
                  {formatFileSize(document.fileSize)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text style={{ color: "#475569" }}>Created</Text>}
              >
                <Text style={{ color: "#e2e8f0" }}>
                  {formatDate(document.createdAt)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text style={{ color: "#475569" }}>Last Updated</Text>}
              >
                <Text style={{ color: "#e2e8f0" }}>
                  {formatDate(document.updatedAt)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text style={{ color: "#475569" }}>Expires</Text>}
              >
                <Text
                  style={{ color: document.expiresAt ? "#e2e8f0" : "#475569" }}
                >
                  {document.expiresAt
                    ? formatDate(document.expiresAt)
                    : "No expiration"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text style={{ color: "#475569" }}>Verified</Text>}
              >
                {document.isVerified ? (
                  <CheckCircleOutlined style={{ color: "#22c55e" }} />
                ) : (
                  <ExclamationCircleOutlined style={{ color: "#475569" }} />
                )}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ borderColor: "#1e2433" }} />

            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {document.tags.map((tag) => (
                <Tag
                  key={tag}
                  style={{
                    background: "#1e2433",
                    border: "1px solid #2d3748",
                    color: "#64748b",
                    borderRadius: 4,
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>

          {/* Ownership Trail — o conceito central da ShelterZoom */}
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SafetyCertificateOutlined style={{ color: "#3b82f6" }} />
                <Text style={{ color: "#e2e8f0" }}>Ownership Trail</Text>
              </div>
            }
            style={{
              background: "#131720",
              border: "1px solid #1e2433",
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "#475569",
                fontSize: 12,
                display: "block",
                marginBottom: 20,
              }}
            >
              Complete immutable audit trail — every action recorded in sequence
            </Text>

            {/* Timeline de eventos */}
            <Timeline
              items={document.history.map((event) => ({
                color: EVENT_CONFIG[event.action].color,
                dot: (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `${EVENT_CONFIG[event.action].color}20`,
                      border: `1px solid ${EVENT_CONFIG[event.action].color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: EVENT_CONFIG[event.action].color,
                    }}
                  >
                    {EVENT_CONFIG[event.action].icon}
                  </div>
                ),
                children: (
                  <div style={{ paddingBottom: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: "#e2e8f0",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {event.action.charAt(0).toUpperCase() +
                          event.action.slice(1)}
                      </Text>
                      <Text style={{ color: "#475569", fontSize: 11 }}>
                        by {event.actor}
                      </Text>
                    </div>
                    <Text
                      style={{
                        color: "#64748b",
                        fontSize: 12,
                        display: "block",
                      }}
                    >
                      {event.details}
                    </Text>
                    <Text style={{ color: "#334155", fontSize: 11 }}>
                      {formatDate(event.timestamp)}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </div>

        {/* Coluna direita — owner + partilha */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Owner */}
          <Card
            title={<Text style={{ color: "#e2e8f0" }}>Document Owner</Text>}
            style={{
              background: "#131720",
              border: "1px solid #1e2433",
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                size={48}
                style={{
                  background: "#1e3a5f",
                  color: "#3b82f6",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {document.owner.avatar}
              </Avatar>
              <div>
                <Text
                  style={{
                    color: "#e2e8f0",
                    display: "block",
                    fontWeight: 500,
                  }}
                >
                  {document.owner.name}
                </Text>
                <Text style={{ color: "#475569", fontSize: 12 }}>
                  {document.owner.email}
                </Text>
              </div>
            </div>
          </Card>

          {/* Shared with */}
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#e2e8f0" }}>Shared With</Text>
                <Tag
                  style={{
                    background: "#1e2433",
                    border: "none",
                    color: "#64748b",
                  }}
                >
                  {document.sharedWith.length} people
                </Tag>
              </div>
            }
            style={{
              background: "#131720",
              border: "1px solid #1e2433",
              borderRadius: 12,
            }}
          >
            {document.sharedWith.length === 0 ? (
              <Text style={{ color: "#334155", fontSize: 13 }}>
                Not shared with anyone
              </Text>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {document.sharedWith.map((email) => (
                  <div
                    key={email}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Avatar
                      size={28}
                      icon={<UserOutlined />}
                      style={{ background: "#1e2433", color: "#64748b" }}
                    />
                    <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                      {email}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Stats rápidas */}
          <Card
            title={<Text style={{ color: "#e2e8f0" }}>Activity</Text>}
            style={{
              background: "#131720",
              border: "1px solid #1e2433",
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text style={{ color: "#475569", fontSize: 13 }}>
                  Total events
                </Text>
                <Text style={{ color: "#e2e8f0", fontWeight: 500 }}>
                  {document.history.length}
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text style={{ color: "#475569", fontSize: 13 }}>
                  Shared with
                </Text>
                <Text style={{ color: "#e2e8f0", fontWeight: 500 }}>
                  {document.sharedWith.length} people
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text style={{ color: "#475569", fontSize: 13 }}>
                  Verification
                </Text>
                <Text
                  style={{
                    color: document.isVerified ? "#22c55e" : "#475569",
                    fontWeight: 500,
                  }}
                >
                  {document.isVerified ? "Verified" : "Unverified"}
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
