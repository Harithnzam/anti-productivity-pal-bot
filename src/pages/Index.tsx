
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Trophy, Zap, Coffee, Gamepad2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TaskItem } from '@/components/TaskItem';
import { ProcrastinationBot } from '@/components/ProcrastinationBot';
import { ExcuseGenerator } from '@/components/ExcuseGenerator';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Task {
  id: string;
  text: string;
  createdAt: Date;
  lastAvoidedAt: Date;
  totalAvoidanceTime: number;
  isActive: boolean;
  points: number;
}

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todont-tasks', []);
  const [newTask, setNewTask] = useState('');
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('todont-points', 0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateAvoidanceTime();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateAvoidanceTime = () => {
    setTasks(prev => prev.map(task => {
      if (task.isActive) {
        const timeDiff = Math.floor((new Date().getTime() - new Date(task.lastAvoidedAt).getTime()) / 1000);
        const newPoints = Math.floor(timeDiff / 60); // 1 point per minute of avoidance
        
        if (newPoints > task.points && newPoints % 5 === 0) {
          // Celebrate every 5 minutes of successful procrastination
          toast({
            title: "🎉 Procrastination Master!",
            description: `You've avoided "${task.text}" for ${newPoints} minutes straight!`,
            duration: 3000,
          });
        }
        
        return {
          ...task,
          totalAvoidanceTime: task.totalAvoidanceTime + 1,
          points: newPoints
        };
      }
      return task;
    }));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      createdAt: new Date(),
      lastAvoidedAt: new Date(),
      totalAvoidanceTime: 0,
      isActive: true,
      points: 0
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask('');
    
    toast({
      title: "🎯 New Avoidance Mission!",
      description: `Great! Now you can officially avoid: "${newTask}"`,
      duration: 2000,
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (task.isActive) {
          // Task was completed (boo!)
          const pointsLost = Math.floor(task.points * 0.5);
          setTotalPoints(prev => Math.max(0, prev - pointsLost));
          toast({
            title: "😱 Productivity Alert!",
            description: `Oh no! You actually did "${task.text}". Lost ${pointsLost} procrastination points!`,
            variant: "destructive",
          });
          return { ...task, isActive: false };
        } else {
          // Task reactivated for avoidance
          toast({
            title: "🔄 Back to Avoiding!",
            description: `Welcome back to avoiding "${task.text}"!`,
          });
          return { ...task, isActive: true, lastAvoidedAt: new Date() };
        }
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "🗑️ Mission Abandoned",
      description: "Task removed from your avoidance list!",
    });
  };

  const activeTasks = tasks.filter(task => task.isActive);
  const completedTasks = tasks.filter(task => !task.isActive);
  const currentPoints = activeTasks.reduce((sum, task) => sum + task.points, 0);

  useEffect(() => {
    setTotalPoints(currentPoints);
  }, [currentPoints, setTotalPoints]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-orange-800 tracking-tight">
            To-Don't List
          </h1>
          <p className="text-lg text-orange-700 font-medium">
            The Art of Productive Procrastination
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-yellow-200 text-yellow-800">
              <Trophy className="w-5 h-5 mr-2" />
              {totalPoints} Procrastination Points
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Coffee className="w-5 h-5 mr-2" />
              {activeTasks.length} Active Avoidances
            </Badge>
          </div>
        </div>

        {/* Add New Task */}
        <Card className="border-2 border-dashed border-orange-300 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              What are you avoiding today?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Doing laundry, Calling mom, Exercising..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 text-lg"
              />
              <Button 
                onClick={addTask}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                Add to Avoid
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Procrastination Bot */}
        <ProcrastinationBot tasks={activeTasks} />

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Currently Avoiding ({activeTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Excuse Generator */}
        <ExcuseGenerator />

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card className="bg-gray-50/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Productivity Incidents ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Getting Started */}
        {tasks.length === 0 && (
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-orange-800 mb-2">
                Welcome to the Anti-Productivity Zone!
              </h3>
              <p className="text-orange-700 text-lg mb-4">
                Add your first task above to start your journey of productive procrastination.
              </p>
              <p className="text-orange-600">
                Remember: The goal is to NOT do these things. Points are awarded for successful avoidance!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
