/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMeetings } from './hooks/useMeetings';
import { Sidebar } from './components/Sidebar';
import { MeetingWorkspace } from './components/MeetingWorkspace';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  const { 
    meetings, 
    activeMeetingId, 
    setActiveMeetingId, 
    createNewMeeting, 
    updateMeeting 
  } = useMeetings();

  const activeMeeting = meetings.find(m => m.id === activeMeetingId);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 font-sans antialiased text-zinc-900">
      <Sidebar 
        meetings={meetings}
        activeId={activeMeetingId}
        onSelect={setActiveMeetingId}
        onCreate={createNewMeeting}
        onUpdateMeeting={updateMeeting}
      />
      
      {activeMeeting ? (
        <MeetingWorkspace 
          key={activeMeeting.id} 
          meeting={activeMeeting} 
          onUpdate={(updates) => updateMeeting(activeMeeting.id, updates)} 
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <LayoutDashboard className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-800 tracking-tight">No Meeting Selected</h2>
          <p className="text-zinc-500 mt-2 text-sm">Select a meeting from the sidebar or create a new one.</p>
          <button 
            onClick={createNewMeeting}
            className="mt-6 bg-zinc-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm"
          >
            Create New Meeting
          </button>
        </div>
      )}
    </div>
  );
}
