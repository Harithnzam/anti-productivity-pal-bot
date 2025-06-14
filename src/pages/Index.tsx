import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, Zap, Target, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TaskItem } from '@/components/TaskItem';
import { ProcrastinationBot } from '@/components/ProcrastinationBot';
import { ExcuseGenerator } from '@/components/ExcuseGenerator';
import { ProcrastinationBingo } from '@/components/ProcrastinationBingo';
import { Navigation } from '@/components/Navigation';
import { Shop } from '@/components/Shop';
import { Profile } from '@/components/Profile';
import { History } from '@/components/History';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Task {
  id: string;
  text: string;
  createdAt: Date;
  lastAvoidedAt: Date;
  totalAvoidanceTime: number;
  isActive: boolean;
  points: number;
  startTime?: Date;
  endTime?: Date;
  estimatedDuration?: number; // in minutes
}

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todont-tasks', []);
  const [newTask, setNewTask] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(30);
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('todont-points', 0);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateAvoidanceTime();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateAvoidanceTime = () => {
    setTasks(prev => {
      let pointsGained = 0;
      
      const updatedTasks = prev.map(task => {
        if (task.isActive) {
          const now = new Date();
          const timeDiff = Math.floor((now.getTime() - new Date(task.lastAvoidedAt).getTime()) / 1000);
          const newPoints = Math.floor(timeDiff / 60); // 1 point per minute
          
          if (newPoints > task.points && newPoints % 5 === 0 && newPoints > 0) {
            toast({
              title: "🎉 Procrastination Master!",
              description: `You've avoided "${task.text}" for ${newPoints} minutes straight! +${newPoints - task.points} points!`,
              duration: 3000,
            });
            pointsGained += newPoints - task.points;
          }
          
          return {
            ...task,
            totalAvoidanceTime: task.totalAvoidanceTime + 1,
            points: newPoints
          };
        }
        return task;
      });

      if (pointsGained > 0) {
        setTotalPoints(prev => prev + pointsGained);
      }

      return updatedTasks;
    });
  };

  const addTask = (taskText?: string, duration?: number) => {
    const task = taskText || newTask;
    const taskDuration = duration || newTaskDuration;
    
    if (!task.trim()) return;
    
    const now = new Date();
    const endTime = new Date(now.getTime() + taskDuration * 60 * 1000);
    
    const newTaskObj: Task = {
      id: Date.now().toString(),
      text: task,
      createdAt: now,
      lastAvoidedAt: now,
      totalAvoidanceTime: 0,
      isActive: true,
      points: 0,
      startTime: now,
      endTime: endTime,
      estimatedDuration: taskDuration
    };
    
    setTasks(prev => [...prev, newTaskObj]);
    
    if (!taskText) {
      setNewTask('');
      setNewTaskDuration(30);
    }
    
    toast({
      title: "🎯 New Avoidance Mission!",
      description: `Great! Now you can officially avoid: "${task}" for ${taskDuration} minutes`,
      duration: 2000,
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (task.isActive) {
          const pointsLost = Math.floor(task.points * 0.3); // Less harsh penalty
          const pointsGained = Math.max(0, task.points - pointsLost);
          
          setTotalPoints(prev => prev + pointsGained);
          
          toast({
            title: "😱 Productivity Alert!",
            description: `Oh no! You actually did "${task.text}". But you earned ${pointsGained} points for the effort!`,
            variant: "default",
          });
          return { ...task, isActive: false, endTime: new Date() };
        } else {
          toast({
            title: "🔄 Back to Avoiding!",
            description: `Welcome back to avoiding "${task.text}"!`,
          });
          return { ...task, isActive: true, lastAvoidedAt: new Date(), startTime: new Date() };
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

  const handlePurchase = (cost: number) => {
    if (totalPoints >= cost) {
      setTotalPoints(prev => prev - cost);
      return true;
    }
    return false;
  };

  const activeTasks = tasks.filter(task => task.isActive);
  const completedTasks = tasks.filter(task => !task.isActive);
  const currentActivePoints = activeTasks.reduce((sum, task) => sum + task.points, 0);

  const renderWelcomePage = () => (
    <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-xl mb-4">
      <CardContent className="p-4 text-center">
        <div className="text-3xl mb-2 animate-bounce">🎯</div>
        <h3 className="text-lg font-bold text-orange-800 mb-1">
          Welcome to the Anti-Productivity Zone!
        </h3>
        <p className="text-orange-700 text-sm max-w-xl mx-auto">
          Add your first task above to start your journey of productive procrastination!
        </p>
      </CardContent>
    </Card>
  );

  const renderHomePage = () => (
    <div className="space-y-6">
      {tasks.length === 0 && renderWelcomePage()}
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <ProcrastinationBingo tasks={activeTasks} onAddTask={addTask} />
          <ExcuseGenerator />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {activeTasks.length > 0 && (
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-700 flex items-center gap-3 text-lg">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  Currently Avoiding ({activeTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
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

          {completedTasks.length > 0 && (
            <Card className="bg-gray-50/95 backdrop-blur-sm shadow-xl border-2 border-gray-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-600 flex items-center gap-3 text-lg">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                  </div>
                  Productivity Incidents ({completedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                {completedTasks.slice(0, 3).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))}
                {completedTasks.length > 3 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    +{completedTasks.length - 3} more completed tasks
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTasks.length === 0 && completedTasks.length === 0 && tasks.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 opacity-50">⏰</div>
                <p className="text-gray-600">
                  All tasks completed! Add more tasks to continue procrastinating.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-orange-800 tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            To-Don't List
          </h1>
          <p className="text-lg text-orange-700 font-medium">
            The Art of Productive Procrastination
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <div>
                  <div className="text-xl font-bold text-yellow-800">{totalPoints}</div>
                  <div className="text-xs text-yellow-600">Total Points</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-orange-200">
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-orange-600" />
                <div>
                  <div className="text-xl font-bold text-orange-800">{activeTasks.length}</div>
                  <div className="text-xs text-orange-600">Active Avoidances</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-xl font-bold text-green-800">{currentActivePoints}</div>
                  <div className="text-xs text-green-600">Active Points</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-red-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-600" />
                <div>
                  <div className="text-xl font-bold text-red-800">{completedTasks.length}</div>
                  <div className="text-xs text-red-600">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Add Task Section */}
        <Card className="border-2 border-dashed border-orange-300 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              What are you avoiding today?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  placeholder="e.g., Doing laundry, Calling mom, Exercising..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  className="flex-1 border-2 border-orange-200 focus:border-orange-400"
                />
                <div className="flex items-center gap-2 min-w-fit">
                  <Input
                    type="number"
                    placeholder="30"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-20 border-2 border-orange-200 focus:border-orange-400"
                    min="5"
                    max="480"
                  />
                  <span className="text-sm text-orange-600">min</span>
                </div>
              </div>
              <Button 
                onClick={() => addTask()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
              >
                Add to Avoid
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Page Content */}
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'profile' && <Profile tasks={tasks} totalPoints={totalPoints} />}
        {currentPage === 'shop' && <Shop points={totalPoints} onPurchase={handlePurchase} />}
        {currentPage === 'history' && <History tasks={tasks} />}
      </div>

      {/* Floating Bot */}
      <ProcrastinationBot tasks={activeTasks} />
    </div>
  );
};

export default Index;
