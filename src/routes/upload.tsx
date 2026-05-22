import { useState } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  Typography,
  Tag,
  Alert,
  Progress,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TagOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useUploadDocument } from "../hooks/useDocuments";
import { uploadDocumentSchema } from "../schemas/document.schema";
import type { UploadDocumentFormData } from "../schemas/document.schema";

const { Title, Text } = Typography;
const { TextArea } = Input;

type FormState = {
  title: string;
  description: string;
  tags: string;
  sharedWith: string;
  expiresAt: string | null;
};

type FormErrors = Partial<Record<keyof UploadDocumentFormData, string>>;

export default function UploadPage() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    tags: "",
    sharedWith: "",
    expiresAt: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const { mutate: uploadDocument, isPending, isSuccess } = useUploadDocument();

  function validateField(name: keyof FormState, value: string) {
    const partial = { ...form, [name]: value };
    const result = uploadDocumentSchema.safeParse(partial);

    if (!result.success) {
      const fieldError = result.error.issues.find(
        (issue) => issue.path[0] === name,
      );
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError?.message ?? undefined,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleChange(name: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }

  function handleSubmit() {
    setSubmitted(true);

    const result = uploadDocumentSchema.safeParse(form);

    if (!result.success) {
      const allErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UploadDocumentFormData;
        if (!allErrors[field]) allErrors[field] = issue.message;
      });
      setErrors(allErrors);
      return;
    }

    uploadDocument({
      title: result.data.title,
      description: result.data.description,
      tags: result.data.tags,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: result.data.expiresAt ?? null,
      sharedWith: result.data.sharedWith,
      isVerified: false,
      fileType: "PDF",
      fileSize: 0,
      history: [],
    });
  }

  const filledFields = [form.title, form.description].filter(Boolean).length;
  const progress = Math.round((filledFields / 2) * 100);

  if (isSuccess) {
    return (
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
          paddingTop: 80,
        }}
      >
        <CheckCircleOutlined style={{ fontSize: 64, color: "#22c55e" }} />
        <Title level={3} style={{ color: "#e2e8f0", marginTop: 24 }}>
          Document uploaded successfully
        </Title>
        <Text style={{ color: "#64748b" }}>
          Your document is pending review and will be available shortly.
        </Text>
        <div style={{ marginTop: 32 }}>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
            style={{ background: "#3b82f6", border: "none" }}
          >
            Upload another document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ color: "#e2e8f0", margin: 0 }}>
          Upload Document
        </Title>
        <Text style={{ color: "#475569", fontSize: 13 }}>
          Add a new document to the platform
        </Text>
      </div>

      <Card
        style={{
          background: "#131720",
          border: "1px solid #1e2433",
          borderRadius: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 12 }}>
            Form completion
          </Text>
          <Text style={{ color: "#3b82f6", fontSize: 12 }}>{progress}%</Text>
        </div>
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor="#3b82f6"
          trailColor="#1e2433"
        />
      </Card>

      <Card
        style={{
          background: "#131720",
          border: "1px solid #1e2433",
          borderRadius: 12,
        }}
      >
        <Form layout="vertical" requiredMark={false}>
          <Form.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileTextOutlined style={{ color: "#3b82f6", fontSize: 13 }} />
                <Text style={{ color: "#94a3b8", fontSize: 13 }}>Title *</Text>
              </div>
            }
            validateStatus={
              errors.title ? "error" : form.title ? "success" : ""
            }
            help={
              errors.title && (
                <Text style={{ color: "#ef4444", fontSize: 12 }}>
                  {errors.title}
                </Text>
              )
            }
          >
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Q2 2026 Financial Report"
              style={{
                background: "#0f1117",
                border: "1px solid #1e2433",
                color: "#e2e8f0",
                borderRadius: 8,
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                Description *
              </Text>
            }
            validateStatus={
              errors.description ? "error" : form.description ? "success" : ""
            }
            help={
              errors.description && (
                <Text style={{ color: "#ef4444", fontSize: 12 }}>
                  {errors.description}
                </Text>
              )
            }
          >
            <TextArea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the document content and purpose..."
              rows={4}
              style={{
                background: "#0f1117",
                border: "1px solid #1e2433",
                color: "#e2e8f0",
                borderRadius: 8,
                resize: "none",
              }}
            />
            <Text style={{ color: "#334155", fontSize: 11 }}>
              {form.description.length}/500 characters
            </Text>
          </Form.Item>

          <Form.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TagOutlined style={{ color: "#3b82f6", fontSize: 13 }} />
                <Text style={{ color: "#94a3b8", fontSize: 13 }}>Tags</Text>
                <Text style={{ color: "#334155", fontSize: 11 }}>
                  (comma separated)
                </Text>
              </div>
            }
          >
            <Input
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="e.g. finance, Q2, internal"
              style={{
                background: "#0f1117",
                border: "1px solid #1e2433",
                color: "#e2e8f0",
                borderRadius: 8,
              }}
            />
            {form.tags && (
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {form.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag) => (
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
              </div>
            )}
          </Form.Item>

          <Form.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TeamOutlined style={{ color: "#3b82f6", fontSize: 13 }} />
                <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                  Share with
                </Text>
                <Text style={{ color: "#334155", fontSize: 11 }}>
                  (emails, comma separated)
                </Text>
              </div>
            }
          >
            <Input
              value={form.sharedWith}
              onChange={(e) => handleChange("sharedWith", e.target.value)}
              placeholder="e.g. cfo@company.com, legal@company.com"
              style={{
                background: "#0f1117",
                border: "1px solid #1e2433",
                color: "#e2e8f0",
                borderRadius: 8,
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined style={{ color: "#3b82f6", fontSize: 13 }} />
                <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                  Expiration date
                </Text>
                <Text style={{ color: "#334155", fontSize: 11 }}>
                  (optional)
                </Text>
              </div>
            }
          >
            <DatePicker
              style={{
                width: "100%",
                background: "#0f1117",
                border: "1px solid #1e2433",
                borderRadius: 8,
              }}
              onChange={(_, dateStr) =>
                handleChange(
                  "expiresAt",
                  Array.isArray(dateStr) ? dateStr[0] : dateStr,
                )
              }
            />
          </Form.Item>

          {submitted && Object.values(errors).some(Boolean) && (
            <Alert
              message="Please fix the errors above before submitting."
              type="error"
              style={{
                background: "#1a0f0f",
                border: "1px solid #7f1d1d",
                marginBottom: 16,
                borderRadius: 8,
              }}
            />
          )}

          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleSubmit}
            loading={isPending}
            style={{
              width: "100%",
              height: 44,
              background: "#3b82f6",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
