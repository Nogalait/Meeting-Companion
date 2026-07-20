/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMeetings } from './hooks/useMeetings';
import { useAuditLog } from './hooks/useAuditLog';
import { Sidebar } from './components/Sidebar';
import { MeetingWorkspace } from './components/MeetingWorkspace';
import { LayoutDashboard, X, Menu, Trash2, Clock } from 'lucide-react';
import { cn } from './utils/cn';

export default function App() {
  const { 
    meetings, 
    activeMeetingId, 
    setActiveMeetingId, 
    createNewMeeting, 
    updateMeeting 
  } = useMeetings();

  const { logs, addLog, clearLogs } = useAuditLog();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'audit'>('general');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('companion_webhook_url') || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const saveSettings = () => {
    localStorage.setItem('companion_webhook_url', webhookUrl);
    setIsSettingsOpen(false);
  };

  const handleSelectMeeting = (id: string) => {
    setActiveMeetingId(id);
    setIsSidebarOpen(false); // Close sidebar on mobile when selecting
  };

  const handleCreateMeeting = () => {
    createNewMeeting();
    addLog('Created Meeting', 'New meeting created.');
  };

  const activeMeeting = meetings.find(m => m.id === activeMeetingId);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-zinc-50 font-sans antialiased text-zinc-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          meetings={meetings}
          activeId={activeMeetingId}
          onSelect={handleSelectMeeting}
          onCreate={handleCreateMeeting}
          onUpdateMeeting={updateMeeting}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>
      
      {activeMeeting ? (
        <MeetingWorkspace 
          key={activeMeeting.id} 
          meeting={activeMeeting} 
          onUpdate={(updates) => updateMeeting(activeMeeting.id, updates)} 
          addLog={addLog}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white relative">
          <button 
            className="absolute top-4 left-4 p-2 bg-zinc-100 rounded-md lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <LayoutDashboard className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-800 tracking-tight">No Meeting Selected</h2>
          <p className="text-zinc-500 mt-2 text-sm">Select a meeting from the sidebar or create a new one.</p>
          <button 
            onClick={handleCreateMeeting}
            className="mt-6 bg-zinc-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm"
          >
            Create New Meeting
          </button>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] border border-zinc-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-900">Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-zinc-100 px-6 pt-2 gap-4">
              <button 
                onClick={() => setActiveSettingsTab('general')}
                className={cn("pb-3 text-sm font-medium transition-colors", activeSettingsTab === 'general' ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
              >
                General
              </button>
              <button 
                onClick={() => setActiveSettingsTab('audit')}
                className={cn("pb-3 text-sm font-medium transition-colors", activeSettingsTab === 'audit' ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
              >
                Audit Log
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {activeSettingsTab === 'general' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Google Sheets Webhook URL</label>
                    <input 
                      type="text" 
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400"
                    />
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                      Paste your Google Apps Script Web App URL here to enable one-click syncing to your Google Sheet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-zinc-500">Recent activity (Rolling max 50)</p>
                    <button 
                      onClick={clearLogs}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Logs
                    </button>
                  </div>
                  <div className="space-y-3">
                    {logs.length === 0 ? (
                      <p className="text-sm text-zinc-400 italic text-center py-8">No logs available.</p>
                    ) : (
                      logs.map(log => (
                        <div key={log.id} className="text-sm border-l-2 border-zinc-200 pl-3 py-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-xs text-zinc-400">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="font-medium text-zinc-800">{log.action}</div>
                          {log.details && <div className="text-xs text-zinc-500 mt-0.5">{log.details}</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {activeSettingsTab === 'general' && (
              <div className="p-6 border-t border-zinc-100 flex justify-end">
                <button onClick={saveSettings} className="bg-zinc-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm">
                  Save Settings
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
