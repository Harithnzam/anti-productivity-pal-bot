
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Task {
  id: string;
  text: string;
  isActive: boolean;
}

const procrastinationReminders = [
  "🎯 Hey there, master procrastinator! Remember '{taskName}'? It's still waiting for you to ignore it!",
  "☕ Just a friendly reminder that '{taskName}' is getting lonely in your to-don't list!",
  "🎮 '{taskName}' called - it wants to know if you're still avoiding it professionally!",
  "😴 Your task '{taskName}' is patiently waiting to be procrastinated on. Don't disappoint it!",
  "🏆 Congratulations! You've successfully avoided '{taskName}' for a while now. Keep up the great work!",
  "⏰ Time check: '{taskName}' is still there, still being avoided. You're doing amazing!",
  "🎪 Breaking news: '{taskName}' remains expertly unfinished. Your procrastination skills are legendary!",
  "🌟 '{taskName}' would like to remind you that it's still perfectly avoidable. Continue the excellent work!"
];

export const NotificationManager = () => {
  const [tasks] = useLocalStorage<Task[]>('todont-tasks', []);

  useEffect(() => {
    const showRandomReminder = () => {
      const activeTasks = tasks.filter(task => task.isActive);
      
      if (activeTasks.length === 0) return;

      const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
      const randomMessage = procrastinationReminders[Math.floor(Math.random() * procrastinationReminders.length)];
      const personalizedMessage = randomMessage.replace('{taskName}', randomTask.text);

      toast({
        title: "🔔 Procrastination Reminder",
        description: personalizedMessage,
        duration: 5000,
      });
    };

    // Set interval for 7.5 minutes (450,000 milliseconds)
    const interval = setInterval(showRandomReminder, 450000);

    return () => clearInterval(interval);
  }, [tasks]);

  return null; // This component doesn't render anything visible
};
