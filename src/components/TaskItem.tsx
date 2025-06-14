
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, RotateCcw, Trash2, Timer } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  createdAt: Date;
  lastAvoidedAt: Date;
  totalAvoidanceTime: number;
  isActive: boolean;
  points: number;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    const updateTime = () => {
      if (task.isActive) {
        const now = new Date();
        const diff = Math.floor((now.getTime() - new Date(task.lastAvoidedAt).getTime()) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        if (hours > 0) {
          setTimeDisplay(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeDisplay(`${minutes}m ${seconds}s`);
        } else {
          setTimeDisplay(`${seconds}s`);
        }
      } else {
        setTimeDisplay('Completed 😱');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [task.isActive, task.lastAvoidedAt]);

  const getAvoidanceLevel = () => {
    const minutes = task.points;
    if (minutes >= 120) return { level: 'Master Procrastinator', color: 'bg-purple-500', emoji: '👑' };
    if (minutes >= 60) return { level: 'Avoidance Expert', color: 'bg-red-500', emoji: '🔥' };
    if (minutes >= 30) return { level: 'Seasoned Avoider', color: 'bg-orange-500', emoji: '⭐' };
    if (minutes >= 10) return { level: 'Procrastination Padawan', color: 'bg-yellow-500', emoji: '🌟' };
    return { level: 'Beginner Avoider', color: 'bg-green-500', emoji: '🌱' };
  };

  const avoidanceLevel = getAvoidanceLevel();

  return (
    <Card className={`transition-all duration-300 ${task.isActive ? 'border-l-4 border-l-red-400 bg-red-50/50' : 'border-l-4 border-l-gray-400 bg-gray-50/50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-lg font-medium ${task.isActive ? 'text-red-800' : 'text-gray-600 line-through'}`}>
                {task.text}
              </span>
              {task.isActive && (
                <Badge className={`${avoidanceLevel.color} text-white px-2 py-1 text-xs`}>
                  {avoidanceLevel.emoji} {avoidanceLevel.level}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                <span>Avoiding for: {timeDisplay}</span>
              </div>
              
              {task.isActive && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-green-600 font-medium">{task.points} points</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onToggle(task.id)}
              variant={task.isActive ? "destructive" : "default"}
              size="sm"
              className={task.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {task.isActive ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Done 😱
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Avoid Again
                </>
              )}
            </Button>
            
            <Button
              onClick={() => onDelete(task.id)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
