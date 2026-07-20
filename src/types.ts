export interface ActionItem {
  id: string;
  action: string;
  driver: string;
  timeline: string;
  completed: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  agenda: string;
  actions: ActionItem[];
  createdAt: number;
  timerDuration: number; // in seconds
  ribbonColor?: string;
  isObfuscated?: boolean;
}
