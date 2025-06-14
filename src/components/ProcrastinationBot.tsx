
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  text: string;
  points: number;
  isActive: boolean;
}

interface ProcrastinationBotProps {
  tasks: Task[];
}

const encouragingMessages = [
  "🎉 Look at you go! Not doing anything productive and loving it!",
  "👏 You're a natural at this procrastination thing!",
  "🌟 Your avoidance skills are truly impressive!",
  "🎯 Master level procrastination achieved!",
  "🔥 You're on fire... at not doing things!",
  "💫 The art of doing nothing has never looked so good!",
  "🏆 Champion of productive procrastination!",
  "⭐ Your future self will thank you for this delay!",
  "🎈 Why do today what you can put off until tomorrow?",
  "🌈 Procrastination: It's not laziness, it's selective action!"
];

const milestoneMessages = [
  "🥇 30 minutes of pure avoidance! You're a natural!",
  "🏅 1 hour of successful procrastination! Legend status achieved!",
  "👑 2 hours strong! You could teach a masterclass in avoidance!",
  "🎊 3+ hours! You've transcended ordinary procrastination!",
];

export const ProcrastinationBot = ({ tasks }: ProcrastinationBotProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [botMood, setBotMood] = useState('😴');

  useEffect(() => {
    const interval = setInterval(() => {
      generateMessage();
    }, 15000); // New message every 15 seconds

    generateMessage(); // Initial message
    return () => clearInterval(interval);
  }, [tasks]);

  const generateMessage = () => {
    if (tasks.length === 0) {
      setCurrentMessage("🤖 Add some tasks to avoid and I'll cheer you on!");
      setBotMood('🤖');
      return;
    }

    const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
    const highestTask = tasks.reduce((max, task) => task.points > max.points ? task : max, tasks[0]);

    if (totalPoints === 0) {
      setCurrentMessage("🚀 Just getting started? Perfect! The journey of a thousand avoided tasks begins with a single step... away from productivity!");
      setBotMood('🚀');
    } else if (highestTask.points >= 180) { // 3+ hours
      setCurrentMessage(`👑 LEGENDARY! You've avoided "${highestTask.text}" for ${Math.floor(highestTask.points / 60)} hours! You're not just procrastinating, you're making it an art form!`);
      setBotMood('👑');
    } else if (highestTask.points >= 120) { // 2+ hours
      setCurrentMessage(`🔥 AMAZING! ${Math.floor(highestTask.points / 60)} hours of avoiding "${highestTask.text}"! Your commitment to non-commitment is inspiring!`);
      setBotMood('🔥');
    } else if (highestTask.points >= 60) { // 1+ hour
      setCurrentMessage(`⭐ Excellent work! You've successfully avoided "${highestTask.text}" for over an hour! That's some serious procrastination skills!`);
      setBotMood('⭐');
    } else if (highestTask.points >= 30) { // 30+ minutes
      setCurrentMessage(`🌟 Great job avoiding "${highestTask.text}" for ${highestTask.points} minutes! You're getting the hang of this!`);
      setBotMood('🌟');
    } else {
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setCurrentMessage(randomMessage);
      setBotMood('😄');
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{botMood}</div>
          <div className="text-lg font-semibold text-purple-800">
            Your Procrastination Coach
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 rounded-lg p-4 mb-3">
          <p className="text-gray-800 leading-relaxed">{currentMessage}</p>
        </div>
        <Button
          onClick={generateMessage}
          variant="outline"
          size="sm"
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          Get New Encouragement
        </Button>
      </CardContent>
    </Card>
  );
};
