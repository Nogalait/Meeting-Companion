import React from 'react';
import { X, ShieldAlert, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuditLog } from '../hooks/useAuditLog';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { logs, clearLogs } = useAuditLog();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between flex-none">
          <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-zinc-500" />
            Security & Audit Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-2">Zero Trust & Security</h3>
            <p className="text-sm text-zinc-600 mb-4">
              This application operates on a local-first, zero-trust approach. No private keys are stored or exposed. Anti-crawling directives and Content Security Policies (CSP) are active.
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-1">Audit Log</h3>
                <p className="text-xs text-zinc-500">Tracks the last 100 actions locally. Saved via low-priority rolling writes to preserve mobile performance.</p>
              </div>
              <button 
                onClick={clearLogs}
                className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
            
            {logs.length === 0 ? (
              <div className="text-center py-8 text-sm text-zinc-400 bg-zinc-50 rounded-lg border border-zinc-100 border-dashed">
                No activity recorded yet.
              </div>
            ) : (
              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase text-zinc-500 font-medium tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-zinc-50/50">
                        <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                          {format(log.timestamp, 'HH:mm:ss')}
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-800">
                          {log.action}
                        </td>
                        <td className="px-4 py-3 text-zinc-600 truncate max-w-[200px]">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
