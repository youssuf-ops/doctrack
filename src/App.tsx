import { useState } from "react";
import UploadPage from "./routes/upload";
import DocumentDetail from "./routes/documents/$id";
import { Layout, Menu, Badge, Avatar, Typography, Button } from "antd";
import {
  FileTextOutlined,
  DashboardOutlined,
  UploadOutlined,
  SafetyCertificateOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import Dashboard from "./routes/index";
import "./App.css";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

// Tipo para controlar qual página está ativa
type ActivePage = "dashboard" | "documents" | "upload";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  return (
    <Layout style={{ minHeight: "100vh", background: "#0f1117" }}>
      {/* ── SIDEBAR ── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={240}
        style={{
          background: "#0f1117",
          borderRight: "1px solid #1e2433",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? "20px 8px" : "20px 24px",
            borderBottom: "1px solid #1e2433",
            transition: "all 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SafetyCertificateOutlined
              style={{ color: "#3b82f6", fontSize: 22 }}
            />
            {!collapsed && (
              <Text
                strong
                style={{ color: "#e2e8f0", fontSize: 16, letterSpacing: 1 }}
              >
                DocTrack
              </Text>
            )}
          </div>
          {!collapsed && (
            <Text style={{ color: "#475569", fontSize: 11 }}>
              Document Management Platform
            </Text>
          )}
        </div>

        {/* Navegação */}
        <Menu
          mode="inline"
          selectedKeys={[activePage]}
          style={{ background: "#0f1117", border: "none", marginTop: 8 }}
          onClick={({ key }) => setActivePage(key as ActivePage)}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "documents",
              icon: <FileTextOutlined />,
              label: "Documents",
            },
            {
              key: "upload",
              icon: <UploadOutlined />,
              label: "Upload",
            },
          ]}
        />
      </Sider>

      {/* ── ÁREA PRINCIPAL ── */}
      <Layout style={{ background: "#0f1117" }}>
        {/* Header */}
        <Header
          style={{
            background: "#0f1117",
            borderBottom: "1px solid #1e2433",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          {/* Botão colapsar sidebar */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: "#94a3b8", fontSize: 16 }}
          />

          {/* Lado direito do header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge count={3} size="small">
              <BellOutlined
                style={{ color: "#94a3b8", fontSize: 18, cursor: "pointer" }}
              />
            </Badge>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar
                size={32}
                style={{ background: "#3b82f6", fontSize: 12, fontWeight: 600 }}
              >
                JM
              </Avatar>
              {!collapsed && (
                <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                  James Mercer
                </Text>
              )}
            </div>
          </div>
        </Header>

        {/* Conteúdo — renderiza a página ativa */}
        <Content style={{ padding: 24, overflow: "auto" }}>
          {activePage === "dashboard" && !selectedDocId && (
            <Dashboard onSelectDocument={(id) => setSelectedDocId(id)} />
          )}
          {activePage === "dashboard" && selectedDocId && (
            <DocumentDetail
              id={selectedDocId}
              onBack={() => setSelectedDocId(null)}
            />
          )}
          {activePage === "documents" && (
            <div style={{ color: "#94a3b8" }}>Documents page — Hora 6</div>
          )}
          {activePage === "upload" && <UploadPage />}
        </Content>
      </Layout>
    </Layout>
  );
}
