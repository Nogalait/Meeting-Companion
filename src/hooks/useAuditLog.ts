import { useState, useCallback, useRef } from "react";
import { AuditLogEntry } from "../types";
import { v4 as uuidv4 } from "uuid";

const AUDIT_STORAGE_KEY = "companion_audit_log";
const MAX_AUDIT_LOG_SIZE = 100;

export function useAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse audit log");
      }
    }
    return [];
  });

  const saveTimeoutRef = useRef<number | null>(null);

  const addLog = useCallback((action: string, details: string) => {
    setLogs((prev) => {
      const newLog: AuditLogEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        action,
        details,
      };
      
      const newLogs = [newLog, ...prev].slice(0, MAX_AUDIT_LOG_SIZE);
      
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = window.setTimeout(() => {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(newLogs));
      }, 500);
      
      return newLogs;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }, []);

  return {
    logs,
    addLog,
    clearLogs
  };
}
