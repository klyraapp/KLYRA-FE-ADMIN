/**
 * useExportHandlers Hook
 * Manages export modal state and handles export operations with translation support
 */

import { useLanguage } from "@/context/LanguageContext";
import { useCallback, useState } from "react";
import useToast from "../../hooks/useToast";
import { exportToCsv } from "./exportCsv";
import { exportToPdf } from "./exportPdf";
import { normalizeExportData } from "./normalizeExportData";

const DEFAULT_STATE = {
  retentionDays: 30,
  exportFormats: {
    csv: true,
    pdf: true,
    excel: false,
  },
  enableRealtime: false,
  allowCustomReports: false,
};

const useExportHandlers = ({ pageKey, getData, onClose }) => {
  const toast = useToast();
  const { currentLanguage } = useLanguage();
  const [retentionDays, setRetentionDays] = useState(
    DEFAULT_STATE.retentionDays,
  );
  const [exportFormats, setExportFormats] = useState(
    DEFAULT_STATE.exportFormats,
  );
  const [enableRealtime, setEnableRealtime] = useState(
    DEFAULT_STATE.enableRealtime,
  );
  const [allowCustomReports, setAllowCustomReports] = useState(
    DEFAULT_STATE.allowCustomReports,
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleRetentionChange = useCallback((value) => {
    setRetentionDays(value);
  }, []);

  const handleFormatChange = useCallback((format, checked) => {
    setExportFormats((prev) => ({
      ...prev,
      [format]: checked,
    }));
  }, []);

  const handleRealtimeChange = useCallback((e) => {
    setEnableRealtime(e.target.checked);
  }, []);

  const handleCustomReportsChange = useCallback((e) => {
    setAllowCustomReports(e.target.checked);
  }, []);

  const handleReset = useCallback(() => {
    setRetentionDays(DEFAULT_STATE.retentionDays);
    setExportFormats(DEFAULT_STATE.exportFormats);
    setEnableRealtime(DEFAULT_STATE.enableRealtime);
    setAllowCustomReports(DEFAULT_STATE.allowCustomReports);
    toast.success("export.settingsReset");
  }, [toast]);

  const handleSave = useCallback(async () => {
    const hasSelectedFormat =
      exportFormats.csv || exportFormats.pdf || exportFormats.excel;

    if (!hasSelectedFormat) {
      toast.error("export.selectFormat");
      return;
    }

    setIsExporting(true);

    try {
      const rawData = await getData();

      if (!rawData || rawData.length === 0) {
        toast.warning("export.noData");
        setIsExporting(false);
        return;
      }

      const normalizedData = normalizeExportData(rawData);
      const timestamp = new Date().toISOString().split("T")[0];
      let successCount = 0;

      if (exportFormats.csv) {
        try {
          exportToCsv(
            normalizedData,
            `${pageKey}-${timestamp}.csv`,
            currentLanguage,
          );
          successCount++;
        } catch (csvError) {
          toast.error("export.csvFailed");
        }
      }

      if (exportFormats.pdf) {
        try {
          await exportToPdf(
            normalizedData,
            `${pageKey}-${timestamp}.pdf`,
            pageKey,
            currentLanguage,
          );
          successCount++;
        } catch (pdfError) {
          toast.error("export.pdfFailed");
        }
      }

      if (exportFormats.excel) {
        toast.info("Excel export will be available soon");
      }

      if (successCount > 0) {
        toast.success("export.exportSuccess");
        onClose();
      } else if (!exportFormats.excel) {
        toast.error("export.exportFailed");
      }
    } catch (error) {
      toast.error("export.exportFailed");
    } finally {
      setIsExporting(false);
    }
  }, [exportFormats, getData, pageKey, onClose, toast, currentLanguage]);

  return {
    retentionDays,
    exportFormats,
    enableRealtime,
    allowCustomReports,
    isExporting,
    handleRetentionChange,
    handleFormatChange,
    handleRealtimeChange,
    handleCustomReportsChange,
    handleReset,
    handleSave,
  };
};

export default useExportHandlers;
