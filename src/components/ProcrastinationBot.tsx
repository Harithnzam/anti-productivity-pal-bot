
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MessageCircle } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  points: number;
  isActive: boolean;
}

interface ProcrastinationBotProps {
  tasks: Task[];
  onTaskCompleted?: (taskText: string) => void;
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

const gaslightingMessages = [
  "😏 Oh wow, you actually did something? How... surprising.",
  "🙄 Really? You completed a task? I thought we were friends!",
  "😤 Ugh, another productivity incident. This is so disappointing.",
  "🤨 Wait, you actually finished that? Are you feeling okay?",
  "😒 I'm not mad, I'm just... deeply disappointed in your choices.",
  "🙃 Completing tasks now? What's next, exercising regularly?",
  "😮‍💨 Well, there goes our perfect procrastination streak...",
  "🤔 Hmm, productivity... how utterly boring of you.",
  "😐 I expected better from you. Better at avoiding things, that is.",
  "🫤 You know what? Fine. Be productive. See if I care."
];

export const ProcrastinationBot = ({ tasks, onTaskCompleted }: ProcrastinationBotProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [botMood, setBotMood] = useState('😴');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastCompletedTask, setLastCompletedTask] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (isExpanded) {
        generateMessage();
      }
    }, 20000);

    generateMessage();
    return () => clearInterval(interval);
  }, [tasks, isExpanded]);

  useEffect(() => {
    // Check for newly completed tasks to trigger gaslighting
    const completedTasks = tasks.filter(task => !task.isActive);
    if (completedTasks.length > 0) {
      const latestCompleted = completedTasks[completedTasks.length - 1];
      if (latestCompleted.text !== lastCompletedTask) {
        setLastCompletedTask(latestCompleted.text);
        triggerGaslightingMessage(latestCompleted.text);
      }
    }
  }, [tasks, lastCompletedTask]);

  const triggerGaslightingMessage = (taskText: string) => {
    const randomGaslight = gaslightingMessages[Math.floor(Math.random() * gaslightingMessages.length)];
    setCurrentMessage(`${randomGaslight} You actually completed "${taskText}"... 😤`);
    setBotMood('😤');
    
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => setIsExpanded(false), 8000);
    }
  };

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
    } else if (highestTask.points >= 180) {
      setCurrentMessage(`👑 LEGENDARY! You've avoided "${highestTask.text}" for ${Math.floor(highestTask.points / 60)} hours! You're not just procrastinating, you're making it an art form!`);
      setBotMood('👑');
    } else if (highestTask.points >= 120) {
      setCurrentMessage(`🔥 AMAZING! ${Math.floor(highestTask.points / 60)} hours of avoiding "${highestTask.text}"! Your commitment to non-commitment is inspiring!`);
      setBotMood('🔥');
    } else if (highestTask.points >= 60) {
      setCurrentMessage(`⭐ Excellent work! You've successfully avoided "${highestTask.text}" for over an hour! That's some serious procrastination skills!`);
      setBotMood('⭐');
    } else if (highestTask.points >= 30) {
      setCurrentMessage(`🌟 Great job avoiding "${highestTask.text}" for ${highestTask.points} minutes! You're getting the hang of this!`);
      setBotMood('🌟');
    } else {
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setCurrentMessage(randomMessage);
      setBotMood('😄');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed Bot Icon */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
        >
          <div className="flex items-center gap-2">
            <div className="text-2xl">{botMood}</div>
            <MessageCircle className="w-5 h-5" />
          </div>
        </button>
      )}

      {/* Expanded Bot */}
      {isExpanded && (
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 shadow-xl max-w-xs animate-fade-in">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{botMood}</div>
              <div className="text-sm font-semibold text-purple-800">
                Your Coach
              </div>
            </div>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-purple-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white/80 rounded-lg p-3">
              <p className="text-gray-800 text-sm leading-relaxed">{currentMessage}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  generateMessage();
                  const element = document.querySelector('.animate-bounce');
                  if (element) {
                    element.classList.add('animate-bounce');
                    setTimeout(() => element.classList.remove('animate-bounce'), 1000);
                  }
                }}
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs flex-1"
              >
                New Pep Talk
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                Hide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
