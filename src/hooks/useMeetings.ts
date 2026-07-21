import { useState, useEffect, useCallback } from "react";
import { Meeting } from "../types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "companion_meetings_data";

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse meetings data");
      }
    }
    return [];
  });

  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(() => {
    return meetings.length > 0 ? meetings[0].id : null;
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [meetings]);

  const createNewMeeting = useCallback(() => {
    const newMeeting: Meeting = {
      id: uuidv4(),
      title: "Untitled Meeting",
      agenda: "",
      actions: [],
      createdAt: Date.now(),
      timerDuration: 30 * 60, // 30 minutes default
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    setActiveMeetingId(newMeeting.id);
  }, []);

  // Initialize if empty
  useEffect(() => {
    if (meetings.length === 0) {
      createNewMeeting();
    }
  }, [meetings.length, createNewMeeting]);

  const updateMeeting = useCallback((id: string, updates: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const deleteMeeting = useCallback((id: string) => {
    setMeetings((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      if (activeMeetingId === id) {
        setActiveMeetingId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  }, [activeMeetingId]);

  return {
    meetings,
    activeMeetingId,
    setActiveMeetingId,
    createNewMeeting,
    updateMeeting,
    deleteMeeting
  };
}
