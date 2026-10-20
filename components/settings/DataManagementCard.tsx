"use client";

import {
  Download,
  Save,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { Button } from "@/components/ui/Button";
import { importUserData } from "@/actions/data";
import {
  parseExportFile,
  summarizeImport,
  type ExportPayload,
  type ImportSummary,
} from "@/lib/data-export";

type DataRow = {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
};

const ROWS: DataRow[] = [
  {
    key: "export",
    icon: <Upload className="h-4 w-4" />,
    title: "Export Data",
    description: "Download your data as a JSON file",
    actionLabel: "Export",
    actionIcon: <Upload className="h-3.5 w-3.5" />,
  },
  {
    key: "backup",
    icon: <Save className="h-4 w-4" />,
    title: "Create Backup",
    description: "Save a backup to your device",
    actionLabel: "Backup",
    actionIcon: <Save className="h-3.5 w-3.5" />,
  },
];

type ImportStatus = "idle" | "importing" | "done" | "error";

function importSummaryLine(s: ImportSummary): string {
  const parts: string[] = [];
  if (s.hasProfile) parts.push("profile settings");
  if (s.categories) parts.push(`${s.categories} categor${s.categories === 1 ? "y" : "ies"}`);
  if (s.moodLevels) parts.push(`${s.moodLevels} mood levels`);
  if (s.habits) parts.push(`${s.habits} habit${s.habits === 1 ? "" : "s"}`);
  if (s.completions) parts.push(`${s.completions} completion${s.completions === 1 ? "" : "s"}`);
  if (s.moodEntries) parts.push(`${s.moodEntries} mood entr${s.moodEntries === 1 ? "y" : "ies"}`);
  if (s.notes) parts.push(`${s.notes} note${s.notes === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

export function DataManagementCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<{
    payload: ExportPayload;
    fileName: string;
    summary: ImportSummary;
  } | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function triggerDownload(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handlePickFileClick() {
    if (importStatus === "importing") return;
    setPendingFile(null);
    setStatusMessage(null);
    setImportStatus("idle");
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const text = await file.text();
    const result = parseExportFile(text);
    if (!result.payload) {
      setPendingFile(null);
      setStatusMessage(result.error ?? "That file isn't a valid export.");
      setImportStatus("error");
      return;
    }
    setPendingFile({
      payload: result.payload,
      fileName: file.name,
      summary: summarizeImport(result.payload),
    });
    setStatusMessage(null);
    setImportStatus("idle");
  }

  function cancelImport() {
    setPendingFile(null);
    setStatusMessage(null);
    setImportStatus("idle");
  }

  async function confirmImport() {
    if (!pendingFile) return;
    setImportStatus("importing");
    setStatusMessage(null);
    const result = await importUserData(pendingFile.payload);
    if (result.success) {
      setImportStatus("done");
      setStatusMessage(
        `Import complete — ${importSummaryLine(pendingFile.summary)}.`,
      );
      setPendingFile(null);
    } else {
      setImportStatus("error");
      setStatusMessage(result.error ?? "Failed to import data");
      setPendingFile(null);
    }
  }

  return (
    <SettingsSection
      title="Data"
      description="Your data stays in your control."
    >
      <div className="divide-y divide-border">
        {ROWS.map((row) => (
          <SettingsRow
            key={row.key}
            icon={row.icon}
            title={row.title}
            description={row.description}
            control={
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  triggerDownload(
                    row.key === "backup"
                      ? "/api/data/export?backup=1"
                      : "/api/data/export",
                  )
                }
              >
                {row.actionIcon}
                {row.actionLabel}
              </Button>
            }
          />
        ))}

        <SettingsRow
          icon={<Download className="h-4 w-4" />}
          title="Import Data"
          description={
            pendingFile
              ? `Selected “${pendingFile.fileName}”`
              : "Restore data from a backup file"
          }
          control={
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePickFileClick}
              disabled={importStatus === "importing"}
            >
              <Download className="h-3.5 w-3.5" />
              Import
            </Button>
          }
        />

        {pendingFile && (
          <div className="rounded-lg border border-error/40 bg-error-light p-3">
            <p className="text-sm text-text">
              Import “{pendingFile.fileName}”?
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {importSummaryLine(pendingFile.summary) || "This file is empty."}
              {" — "}merges into your account; nothing is deleted.
            </p>
            <div className="mt-2 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={cancelImport}
                disabled={importStatus === "importing"}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmImport}
                disabled={importStatus === "importing"}
              >
                {importStatus === "importing" ? "Importing…" : "Import"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {statusMessage && (
        <p
          className="pt-3 text-xs text-text-muted"
          role={importStatus === "error" ? "alert" : "status"}
        >
          <span
            className={
              importStatus === "error" ? "text-error-foreground" : "text-success-foreground"
            }
          >
            {importStatus === "error" ? "Import failed — " : ""}
          </span>
          {statusMessage}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFileChange}
      />
    </SettingsSection>
  );
}
