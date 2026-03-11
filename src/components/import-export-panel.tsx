"use client";

import React, { useState } from "react";
import { DawState } from "@/types/daw";
import { generateExportData, generateProjectData, generateReactCode } from "@/lib/daw-utils";
import { useI18n } from "@/contexts/i18n-context";

interface ImportExportPanelProps {
  state: DawState;
  onRestore: (project: unknown) => void;
}

export function ImportExportPanel({ state, onRestore }: ImportExportPanelProps) {
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const { t, locale } = useI18n();

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const copyToClipboard = async (text: string, successKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showMessage(t(successKey));
    } catch (err) {
      alert("Copy failed.");
    }
  };

  const handleCopyReact = () => {
    const code = generateReactCode(generateExportData(state), locale);
    copyToClipboard(code, "importExport.copySuccessReact");
  };

  const handleCopyJson = () => {
    const json = JSON.stringify(generateProjectData(state));
    copyToClipboard(json, "importExport.copySuccessJson");
  };

  const handleRestore = () => {
    if (!importText.trim()) return;
    try {
      const data = JSON.parse(importText);
      onRestore(data);
      setImportText("");
      alert(t("importExport.restoreSuccess"));
    } catch (err) {
      alert(t("importExport.restoreError"));
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-xl flex flex-col gap-4">
      <h2 className="text-sm font-bold text-gray-200 border-b border-gray-700 pb-3 flex items-center gap-2">
        <span className="text-lg">📤</span> {t("importExport.title")}
      </h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleCopyReact}
          className="flex-1 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white text-xs py-2.5 px-4 rounded-md transition-all font-bold shadow-lg"
        >
          {t("importExport.copyReact")}
        </button>
        <button
          onClick={handleCopyJson}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2.5 px-4 rounded-md border border-gray-600 transition-all font-bold shadow-lg"
        >
          {t("importExport.copyJson")}
        </button>
      </div>
      
      <p
        className={`text-[10px] text-blue-400 text-center font-bold h-3 transition-opacity duration-300 ${
          message ? "opacity-100" : "opacity-0"
        }`}
      >
        {message || " "}
      </p>

      <div className="mt-2 flex flex-col gap-2">
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder={t("importExport.importPlaceholder")}
          className="w-full bg-gray-900 text-white text-[10px] p-3 rounded-md border border-gray-600 font-mono h-20 focus:outline-none focus:border-blue-500 transition-colors custom-scrollbar"
        />
        <button
          onClick={handleRestore}
          className="bg-green-700 hover:bg-green-600 text-white text-xs py-2 px-4 rounded-md transition-colors font-bold shadow-md"
        >
          {t("importExport.restore")}
        </button>
      </div>
    </div>
  );
}
