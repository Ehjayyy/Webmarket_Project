/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useAuth } from "./authStore";

export type ReportTargetType = "seller" | "product";

export type Report = {
  id: number;
  user_id: number;
  target_type: ReportTargetType;
  target_id: number;
  reason: string;
  created_at: string;
};

type ReportContextValue = {
  submitReport: (payload: Omit<Report, "id" | "created_at" | "user_id">) => Promise<void>;
  listMyReports: Report[];
  loading: boolean;
  reload: () => Promise<void>;
};

const ReportContext = createContext<ReportContextValue | null>(null);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const { user, token, ready } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    if (!ready || !user || !token) {
      setReports([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/reports/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [user]);

  const submitReport: ReportContextValue["submitReport"] = async ({ target_type, target_id, reason }) => {
    if (!ready || !user || !token) throw new Error("You must be logged in.");
    const response = await fetch("http://localhost:4000/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        target_type,
        target_id,
        reason,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit report");
    }

    await reload();
  };

  const listMyReports = reports;

  const value = useMemo(
    () => ({
      submitReport,
      listMyReports,
      loading,
      reload,
    }),
    [reports, loading]
  );

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReports must be used within ReportProvider");
  return ctx;
}