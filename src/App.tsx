/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useMeetings } from './hooks/useMeetings';
import { useAuditLog } from './hooks/useAuditLog';
import { Sidebar } from './components/Sidebar';
import { MeetingWorkspace } from './components/MeetingWorkspace';
import { SettingsModal } from './components/SettingsModal';
import { LayoutDashboard, Menu } from 'lucide-react';

export default function App() {
  const { 
    meetings, 
    activeMeetingId, 
    setActiveMeetingId, 
    createNewMeeting, 
    updateMeeting 
  } = useMeetings();
  const { addLog } = useAuditLog();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeMeeting = meetings.find(m => m.id === activeMeetingId);

  useEffect(() => {
    addLog('App Init', 'Meeting companion initialized');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateMeeting = () => {
    createNewMeeting();
    addLog('Meeting Created', 'Created a new untitled meeting');
    setIsSidebarOpen(false);
  };

  const handleUpdateMeeting = (id: string, updates: Partial<any>) => {
    updateMeeting(id, updates);
    if (updates.isObfuscated !== undefined) {
      addLog('Visibility Changed', `Meeting obfuscation set to ${updates.isObfuscated}`);
    }
    if (updates.ribbonColor !== undefined) {
      addLog('Color Changed', `Meeting ribbon color updated`);
    }
  };

  const handleSelectMeeting = (id: string) => {
    setActiveMeetingId(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 font-sans antialiased text-zinc-900 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          meetings={meetings}
          activeId={activeMeetingId}
          onSelect={handleSelectMeeting}
          onCreate={handleCreateMeeting}
          onUpdateMeeting={handleUpdateMeeting}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex flex-none items-center p-4 border-b border-zinc-100 bg-white">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-zinc-800 text-sm ml-2">Companion</span>
        </div>

        {activeMeeting ? (
          <MeetingWorkspace 
            key={activeMeeting.id} 
            meeting={activeMeeting} 
            onUpdate={(updates) => {
              updateMeeting(activeMeeting.id, updates);
            }} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center">
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
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
