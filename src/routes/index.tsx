import { Card, Row, Col, Table, Tag, Avatar, Typography, Skeleton } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDashboardStats, useDocuments } from "../hooks/useDocuments";
import type { Document, DocumentStatus } from "../types";

const { Title, Text } = Typography;

// Configuração das cores por status — objeto centralizado
const STATUS_CONFIG: Record<DocumentStatus, { color: string; label: string }> =
  {
    active: { color: "green", label: "Active" },
    shared: { color: "blue", label: "Shared" },
    expired: { color: "red", label: "Expired" },
    pending: { color: "orange", label: "Pending" },
  };

// Componente de card de métrica — reutilizável
function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}) {
  return (
    <Card
      style={{
        background: "#131720",
        border: "1px solid #1e2433",
        borderRadius: 12,
      }}
    >
      <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Text style={{ color: "#64748b", fontSize: 12, display: "block" }}>
              {title}
            </Text>
            <Title
              level={2}
              style={{ color: "#e2e8f0", margin: "4px 0 0", fontSize: 32 }}
            >
              {value}
            </Title>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color,
            }}
          >
            {icon}
          </div>
        </div>
      </Skeleton>
    </Card>
  );
}

// Formata bytes para leitura humana
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Formata data ISO para leitura humana
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  // Dois hooks — cada um com o seu estado de loading independente
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: documents, isLoading: docsLoading } = useDocuments();

  // Colunas da tabela — tipadas com o tipo Document
  const columns = [
    {
      title: "Document",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Document) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#1e3a5f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileTextOutlined style={{ color: "#3b82f6", fontSize: 16 }} />
          </div>
          <div>
            <Text
              style={{
                color: "#e2e8f0",
                display: "block",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {title}
            </Text>
            <Text style={{ color: "#475569", fontSize: 11 }}>
              {record.fileType} · {formatFileSize(record.fileSize)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (owner: Document["owner"]) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            size={28}
            style={{ background: "#1e3a5f", color: "#3b82f6", fontSize: 11 }}
          >
            {owner.avatar}
          </Avatar>
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>{owner.name}</Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: DocumentStatus) => (
        <Tag color={STATUS_CONFIG[status].color} style={{ borderRadius: 6 }}>
          {STATUS_CONFIG[status].label}
        </Tag>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {tags.slice(0, 2).map((tag) => (
            <Tag
              key={tag}
              style={{
                background: "#1e2433",
                border: "1px solid #2d3748",
                color: "#64748b",
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              {tag}
            </Tag>
          ))}
          {tags.length > 2 && (
            <Tag
              style={{
                background: "transparent",
                border: "none",
                color: "#475569",
                fontSize: 11,
              }}
            >
              +{tags.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => (
        <Text style={{ color: "#475569", fontSize: 12 }}>
          {formatDate(date)}
        </Text>
      ),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (verified: boolean) =>
        verified ? (
          <CheckCircleOutlined style={{ color: "#22c55e", fontSize: 16 }} />
        ) : (
          <ExclamationCircleOutlined
            style={{ color: "#475569", fontSize: 16 }}
          />
        ),
    },
  ];

  return (
    <div>
      {/* Cabeçalho da página */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ color: "#e2e8f0", margin: 0 }}>
          Dashboard
        </Title>
        <Text style={{ color: "#475569", fontSize: 13 }}>
          Document ownership overview
        </Text>
      </div>

      {/* Cards de métricas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Documents"
            value={stats?.totalDocuments ?? 0}
            icon={<FileTextOutlined />}
            color="#3b82f6"
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active"
            value={stats?.activeDocuments ?? 0}
            icon={<CheckCircleOutlined />}
            color="#22c55e"
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Shared"
            value={stats?.sharedDocuments ?? 0}
            icon={<ShareAltOutlined />}
            color="#3b82f6"
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Expired"
            value={stats?.expiredDocuments ?? 0}
            icon={<ClockCircleOutlined />}
            color="#ef4444"
            loading={statsLoading}
          />
        </Col>
      </Row>

      {/* Tabela de documentos */}
      <Card
        title={<Text style={{ color: "#e2e8f0" }}>Recent Documents</Text>}
        style={{
          background: "#131720",
          border: "1px solid #1e2433",
          borderRadius: 12,
        }}
        extra={
          <Text style={{ color: "#475569", fontSize: 12 }}>
            {documents?.length ?? 0} documents
          </Text>
        }
      >
        <Table
          dataSource={documents}
          columns={columns}
          rowKey="id"
          loading={docsLoading}
          pagination={{ pageSize: 5 }}
          className="dark-table"
        />
      </Card>
    </div>
  );
}
