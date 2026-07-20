import { useState, useCallback, useEffect } from 'react';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
}

const MAX_LOGS = 50; // Rolling log, keeps memory usage low
const STORAGE_KEY = 'companion_audit_logs';

export function useAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse audit logs', e);
    }
    return [];
  });

  useEffect(() => {
    // Save to local storage asynchronously to minimize main thread blocking
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }, 100);
    return () => clearTimeout(timeout);
  }, [logs]);

  const addLog = useCallback((action: string, details: string = '') => {
    setLogs(prev => {
      const newEntry: AuditLogEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        action,
        details,
      };
      // Keep only the most recent MAX_LOGS
      return [newEntry, ...prev].slice(0, MAX_LOGS);
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
}
