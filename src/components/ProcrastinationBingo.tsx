
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BingoCard {
  id: string;
  task: string;
  avoided: boolean;
  date: number;
  month: number;
  year: number;
}

interface Task {
  id: string;
  text: string;
  isActive: boolean;
}

interface ProcrastinationBingoProps {
  tasks: Task[];
}

export const ProcrastinationBingo = ({ tasks }: ProcrastinationBingoProps) => {
  const [bingoCard, setBingoCard] = useState<BingoCard[]>([]);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  useEffect(() => {
    generateBingoCard();
  }, [tasks, currentWeekStart]);

  const generateBingoCard = () => {
    const activeTasks = tasks.filter(task => task.isActive);
    if (activeTasks.length === 0) return;

    const newCard: BingoCard[] = [];
    const startDate = new Date(currentWeekStart);
    
    // Generate 25 consecutive days starting from the current week
    for (let i = 0; i < 25; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
      newCard.push({
        id: `${i}`,
        task: randomTask.text,
        avoided: Math.random() > 0.8, // Some randomly avoided for demo
        date: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
    }
    setBingoCard(newCard);
    checkForBingo(newCard);
  };

  const toggleAvoidance = (id: string) => {
    const newCard = bingoCard.map(cell => 
      cell.id === id ? { ...cell, avoided: !cell.avoided } : cell
    );
    setBingoCard(newCard);
    checkForBingo(newCard);
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
        {bingoCard.length === 0 ? (
          <div className="text-center py-8 text-emerald-700">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Add some tasks to generate your Procrastination Calendar!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {bingoCard.map((cell, index) => (
                <button
                  key={cell.id}
                  onClick={() => toggleAvoidance(cell.id)}
                  className={`
                    aspect-square p-2 rounded-lg text-xs font-medium transition-all duration-200 border-2
                    ${cell.avoided 
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg transform scale-105' 
                      : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400'
                    }
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
                </button>
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
              Complete a full row, column, or diagonal to get BINGO! 🎯
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
