
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Trophy, RotateCcw, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BingoCard {
  id: string;
  task: string;
  avoided: boolean;
  date: number;
  month: number;
  year: number;
  hasCustomTask: boolean;
}

interface Task {
  id: string;
  text: string;
  isActive: boolean;
  createdAt: Date;
  lastAvoidedAt: Date;
  totalAvoidanceTime: number;
  points: number;
  startTime?: Date;
  endTime?: Date;
  estimatedDuration?: number;
}

interface ProcrastinationBingoProps {
  tasks: Task[];
  onAddTask: (taskText: string, duration: number) => void;
}

export const ProcrastinationBingo = ({ tasks, onAddTask }: ProcrastinationBingoProps) => {
  const [bingoCard, setBingoCard] = useState<BingoCard[]>([]);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [taskDuration, setTaskDuration] = useState(30);
  const [addTaskMessageIndex, setAddTaskMessageIndex] = useState(0);

  const addTaskMessages = [
    "📝 Task Added! Welcome to the procrastination paradise!",
    "🎯 New Mission: Successfully avoid this task for maximum points!",
    "🎪 Another star joins the circus of avoidance! Bravo!",
    "🏆 Task registered in the Hall of Things To Ignore!",
    "🎭 The drama begins! Will you conquer this task or will it conquer you?"
  ];

  useEffect(() => {
    generateBingoCard();
  }, [currentWeekStart]);

  // Sync bingo card with task completions
  useEffect(() => {
    setBingoCard(prev => prev.map(cell => {
      // Check if this cell's task matches any completed task
      const matchingTask = tasks.find(task => 
        task.text.toLowerCase() === cell.task.toLowerCase() && 
        !task.isActive
      );
      
      if (matchingTask && !cell.avoided) {
        // Mark as avoided if task is completed
        return { ...cell, avoided: true };
      }
      
      // Check if task was reactivated
      const activeTask = tasks.find(task => 
        task.text.toLowerCase() === cell.task.toLowerCase() && 
        task.isActive
      );
      
      if (activeTask && cell.avoided && cell.hasCustomTask) {
        // Unmark if task was reactivated
        return { ...cell, avoided: false };
      }
      
      return cell;
    }));
  }, [tasks]);

  const generateBingoCard = () => {
    const newCard: BingoCard[] = [];
    const startDate = new Date(currentWeekStart);
    const taskTexts = [
      'Exercise', 'Clean room', 'Study', 'Call family', 'Do laundry',
      'Meal prep', 'Read book', 'Organize files', 'Pay bills', 'Water plants',
      'Write emails', 'Update resume', 'Plan week', 'Declutter', 'Learn skill',
      'Cook dinner', 'Take walk', 'Meditate', 'Social media', 'Watch series',
      'Play games', 'Listen music', 'Browse web', 'Chat friends', 'Take nap'
    ];
    
    // Generate 25 consecutive days starting from the current week
    for (let i = 0; i < 25; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Use different tasks based on index to avoid repetition
      const taskText = taskTexts[i % taskTexts.length];
      
      newCard.push({
        id: `${i}`,
        task: taskText,
        avoided: false,
        date: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        hasCustomTask: false
      });
    }
    setBingoCard(newCard);
    setCompletedLines([]);
  };

  const toggleAvoidance = (id: string) => {
    const newCard = bingoCard.map(cell => 
      cell.id === id ? { ...cell, avoided: !cell.avoided } : cell
    );
    setBingoCard(newCard);
    checkForBingo(newCard);
    
    const cell = newCard.find(c => c.id === id);
    if (cell?.avoided) {
      toast({
        title: "✅ Task Avoided!",
        description: `Great job avoiding "${cell.task}"!`,
        duration: 2000,
      });
    }
  };

  const handleCellClick = (id: string) => {
    setSelectedCell(id);
    const cell = bingoCard.find(c => c.id === id);
    if (cell) {
      setNewTaskText(cell.task);
    }
  };

  const handleAddCustomTask = () => {
    if (!selectedCell || !newTaskText.trim()) return;
    
    // Add to main task list - this should trigger points
    console.log('Adding task to main list:', newTaskText, taskDuration);
    onAddTask(newTaskText, taskDuration);
    
    // Update bingo card
    const newCard = bingoCard.map(cell => 
      cell.id === selectedCell 
        ? { ...cell, task: newTaskText, hasCustomTask: true }
        : cell
    );
    setBingoCard(newCard);
    
    setSelectedCell(null);
    setNewTaskText('');
    setTaskDuration(30);
    
    // Cycle through different "Add Task" messages
    const currentMessage = addTaskMessages[addTaskMessageIndex];
    setAddTaskMessageIndex((addTaskMessageIndex + 1) % addTaskMessages.length);
    
    toast({
      title: currentMessage.split('!')[0] + '!',
      description: `"${newTaskText}" added to both bingo and main list!`,
      duration: 3000,
    });
  };

  const checkForBingo = (card: BingoCard[]) => {
    const lines = [
      // Rows
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
      // Columns
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
      // Diagonals
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];

    const newCompletedLines: number[] = [];
    lines.forEach((line, index) => {
      const isComplete = line.every(pos => card[pos]?.avoided);
      if (isComplete) {
        newCompletedLines.push(index);
      }
    });

    if (newCompletedLines.length > completedLines.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast({
        title: "🎉 B-I-N-G-O!",
        description: `You've completed a line of procrastination! Master level achieved!`,
        duration: 5000,
      });
    }

    setCompletedLines(newCompletedLines);
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentWeekStart(newDate);
  };

  const formatDateHeader = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 24);
    
    return `${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border-2 border-emerald-200 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎊</div>
          <div className="absolute top-4 left-4 text-4xl animate-pulse">✨</div>
          <div className="absolute top-4 right-4 text-4xl animate-pulse">🎉</div>
          <div className="absolute bottom-4 left-4 text-4xl animate-pulse">🌟</div>
          <div className="absolute bottom-4 right-4 text-4xl animate-pulse">🎊</div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="text-emerald-800 flex items-center gap-2 text-xl">
          <Calendar className="w-6 h-6" />
          Procrastination Calendar Bingo
          {completedLines.length > 0 && (
            <Badge className="bg-yellow-500 text-yellow-900 ml-2">
              <Trophy className="w-4 h-4 mr-1" />
              {completedLines.length} BINGO{completedLines.length > 1 ? 'S' : ''}!
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center justify-between">
          <Button onClick={() => changeWeek('prev')} variant="outline" size="sm">
            ← Previous
          </Button>
          <div className="text-sm font-medium text-emerald-700">
            {formatDateHeader()}
          </div>
          <Button onClick={() => changeWeek('next')} variant="outline" size="sm">
            Next →
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {bingoCard.map((cell, index) => (
            <Dialog key={cell.id}>
              <DialogTrigger asChild>
                <button
                  onClick={() => handleCellClick(cell.id)}
                  className={`
                    aspect-square p-2 rounded-lg text-xs font-medium transition-all duration-200 border-2 relative
                    ${cell.avoided 
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg transform scale-105' 
                      : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400'
                    }
                    ${cell.hasCustomTask ? 'ring-2 ring-blue-400' : ''}
                  `}
                  title={cell.task}
                >
                  <div className="text-[10px] font-bold mb-1">
                    {cell.month}/{cell.date}
                  </div>
                  <div className="truncate leading-tight">
                    {cell.task.length > 8 ? cell.task.substring(0, 8) + '...' : cell.task}
                  </div>
                  {cell.avoided && (
                    <div className="text-lg mt-1">✓</div>
                  )}
                  {cell.hasCustomTask && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customize Task for {cell.month}/{cell.date}</DialogTitle>
                  <DialogDescription>
                    Add a custom task to avoid and start earning points!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Task Description</label>
                    <Input
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Enter task to procrastinate on..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={taskDuration}
                      onChange={(e) => setTaskDuration(Number(e.target.value))}
                      min="5"
                      max="480"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddCustomTask}
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                    <Button 
                      onClick={() => toggleAvoidance(cell.id)}
                      variant={cell.avoided ? "destructive" : "secondary"}
                    >
                      {cell.avoided ? 'Mark Undone' : 'Mark Avoided'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
        
        <div className="flex justify-center gap-2 pt-2">
          <Button
            onClick={generateBingoCard}
            variant="outline"
            size="sm"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Card
          </Button>
        </div>
        
        <div className="text-center text-xs text-emerald-600">
          Click any box to customize task or mark as avoided • Complete a row, column, or diagonal for BINGO! 🎯
        </div>
      </CardContent>
    </Card>
  );
};
