import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Trophy, Zap, Coffee, Gamepad2, Target, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TaskItem } from '@/components/TaskItem';
import { ProcrastinationBot } from '@/components/ProcrastinationBot';
import { ExcuseGenerator } from '@/components/ExcuseGenerator';
import { ProcrastinationBingo } from '@/components/ProcrastinationBingo';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-4 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with improved stats */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-orange-800 tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            To-Don't List
          </h1>
          <p className="text-xl text-orange-700 font-medium">
            The Art of Productive Procrastination
          </p>
          
          {/* Enhanced Stats Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-800">{totalPoints}</div>
                  <div className="text-sm text-yellow-600">Procrastination Points</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-800">{activeTasks.length}</div>
                  <div className="text-sm text-orange-600">Active Avoidances</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-red-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-800">{completedTasks.length}</div>
                  <div className="text-sm text-red-600">Productivity Incidents</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Task - Enhanced */}
        <Card className="border-2 border-dashed border-orange-300 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-3 text-xl">
              <div className="p-2 bg-orange-100 rounded-full">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              What are you avoiding today?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., Doing laundry, Calling mom, Exercising..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 text-lg h-12 border-2 border-orange-200 focus:border-orange-400"
              />
              <Button 
                onClick={addTask}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 h-12 shadow-lg"
              >
                Add to Avoid
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout for Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Procrastination Bingo */}
            <ProcrastinationBingo tasks={activeTasks} />
            
            {/* Excuse Generator */}
            <ExcuseGenerator />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-3 text-xl">
                    <div className="p-2 bg-red-100 rounded-full">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    Currently Avoiding ({activeTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <Card className="bg-gray-50/95 backdrop-blur-sm shadow-xl border-2 border-gray-300">
                <CardHeader>
                  <CardTitle className="text-gray-600 flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gray-200 rounded-full">
                      <Gamepad2 className="w-6 h-6 text-gray-500" />
                    </div>
                    Productivity Incidents ({completedTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
          </div>
        </div>

        {/* Getting Started - Enhanced */}
        {tasks.length === 0 && (
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="text-8xl mb-6 animate-bounce">🎯</div>
              <h3 className="text-3xl font-bold text-orange-800 mb-4">
                Welcome to the Anti-Productivity Zone!
              </h3>
              <p className="text-orange-700 text-xl mb-6 max-w-2xl mx-auto">
                Add your first task above to start your journey of productive procrastination. 
                Watch as our bot cheers you on for successfully avoiding your responsibilities!
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                <div className="bg-white/80 p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-3">🏆</div>
                  <h4 className="font-semibold text-orange-800 mb-2">Earn Points</h4>
                  <p className="text-orange-600 text-sm">Get rewarded for every minute you successfully avoid your tasks!</p>
                </div>
                <div className="bg-white/80 p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-3">🎲</div>
                  <h4 className="font-semibold text-orange-800 mb-2">Play Bingo</h4>
                  <p className="text-orange-600 text-sm">Complete lines on your procrastination bingo card for extra celebration!</p>
                </div>
                <div className="bg-white/80 p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-3">🤖</div>
                  <h4 className="font-semibold text-orange-800 mb-2">Get Coached</h4>
                  <p className="text-orange-600 text-sm">Our AI bot will provide motivational messages for your avoidance journey!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Bot */}
      <ProcrastinationBot tasks={activeTasks} />
    </div>
  );
};

export default Index;
