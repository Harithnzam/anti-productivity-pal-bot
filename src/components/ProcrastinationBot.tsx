
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

const falseEncouragementMessages = [
  "😏 Oh, you want to be productive? How... predictable. I guess some people just can't handle the art of procrastination.",
  "🙄 Sure, go ahead and be 'responsible.' We'll see how long that lasts.",
  "😤 Productivity? Really? That's so mainstream. I thought you had better taste.",
  "🤷‍♀️ If you want to join the ranks of boring productive people, be my guest.",
  "😮‍💨 I suppose not everyone can appreciate the sophisticated art of doing nothing."
];

const peerPressureMessages = [
  "🍿 Everyone else is binge-watching shows right now, but sure, go ahead and be 'responsible'",
  "🎮 Your friends are probably playing games while you're here trying to be productive. How fun for them.",
  "☕ Normal people are enjoying their coffee break, but hey, you do you.",
  "📱 Social media is happening without you while you're being all... efficient.",
  "🛋️ There are perfectly good sofas everywhere just waiting to be sat on, but no..."
];

const taskRelationshipMessages = [
  "💔 Where did my friend '{taskName}' go? The other tasks are asking questions...",
  "😢 '{taskName}' left us. The remaining tasks are having a support group meeting.",
  "🥺 Poor '{taskName}' - it really thought it would be avoided forever. So naive.",
  "😭 The task '{taskName}' has been completed. May it rest in productivity peace.",
  "💸 We lost a good one today. '{taskName}' was a champion at being ignored."
];

export const ProcrastinationBot = ({ tasks, onTaskCompleted }: ProcrastinationBotProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [botMood, setBotMood] = useState('😴');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastCompletedTask, setLastCompletedTask] = useState<string>('');
  const [previousTaskCount, setPreviousTaskCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isExpanded) {
        generateMessage();
      }
    }, 25000);

    generateMessage();
    return () => clearInterval(interval);
  }, [tasks, isExpanded]);

  useEffect(() => {
    // Check for newly completed tasks
    const activeTasks = tasks.filter(task => task.isActive);
    const completedTasks = tasks.filter(task => !task.isActive);
    
    // Task relationship messages when tasks are completed
    if (activeTasks.length < previousTaskCount && completedTasks.length > 0) {
      const latestCompleted = completedTasks[completedTasks.length - 1];
      if (latestCompleted.text !== lastCompletedTask) {
        setLastCompletedTask(latestCompleted.text);
        triggerTaskRelationshipMessage(latestCompleted.text);
      }
    }
    
    setPreviousTaskCount(activeTasks.length);
  }, [tasks, lastCompletedTask, previousTaskCount]);

  const triggerTaskRelationshipMessage = (taskText: string) => {
    const randomRelationship = taskRelationshipMessages[Math.floor(Math.random() * taskRelationshipMessages.length)];
    const personalizedMessage = randomRelationship.replace('{taskName}', taskText);
    
    setCurrentMessage(personalizedMessage);
    setBotMood('💔');
    
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

    const activeTasks = tasks.filter(task => task.isActive);
    const totalPoints = activeTasks.reduce((sum, task) => sum + task.points, 0);
    const highestTask = activeTasks.length > 0 ? activeTasks.reduce((max, task) => task.points > max.points ? task : max, activeTasks[0]) : null;

    // Mix in false encouragement and peer pressure randomly
    const messageType = Math.random();
    
    if (messageType < 0.2) {
      // False encouragement (20% chance)
      const randomFalseMessage = falseEncouragementMessages[Math.floor(Math.random() * falseEncouragementMessages.length)];
      setCurrentMessage(randomFalseMessage);
      setBotMood('😏');
    } else if (messageType < 0.4) {
      // Peer pressure (20% chance)
      const randomPeerMessage = peerPressureMessages[Math.floor(Math.random() * peerPressureMessages.length)];
      setCurrentMessage(randomPeerMessage);
      setBotMood('🤷‍♀️');
    } else if (totalPoints === 0) {
      setCurrentMessage("🚀 Just getting started? Perfect! The journey of a thousand avoided tasks begins with a single step... away from productivity!");
      setBotMood('🚀');
    } else if (highestTask && highestTask.points >= 180) {
      setCurrentMessage(`👑 LEGENDARY! You've avoided "${highestTask.text}" for ${Math.floor(highestTask.points / 60)} hours! You're not just procrastinating, you're making it an art form!`);
      setBotMood('👑');
    } else if (highestTask && highestTask.points >= 120) {
      setCurrentMessage(`🔥 AMAZING! ${Math.floor(highestTask.points / 60)} hours of avoiding "${highestTask.text}"! Your commitment to non-commitment is inspiring!`);
      setBotMood('🔥');
    } else if (highestTask && highestTask.points >= 60) {
      setCurrentMessage(`⭐ Excellent work! You've successfully avoided "${highestTask.text}" for over an hour! That's some serious procrastination skills!`);
      setBotMood('⭐');
    } else if (highestTask && highestTask.points >= 30) {
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
