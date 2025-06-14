import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, Zap, Target, TrendingUp, User, ShoppingBag, History as HistoryIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TaskItem } from '@/components/TaskItem';
import { ProcrastinationBot } from '@/components/ProcrastinationBot';
import { ExcuseGenerator } from '@/components/ExcuseGenerator';
import { ProcrastinationBingo } from '@/components/ProcrastinationBingo';
import { TaskConfirmationDialog } from '@/components/TaskConfirmationDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { playSound } from '@/utils/soundManager';

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
  estimatedDuration?: number;
}

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todont-tasks', []);
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('todont-points', 0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    taskName: string;
    duration: number;
    onConfirm: () => void;
  }>({
    isOpen: false,
    taskName: '',
    duration: 0,
    onConfirm: () => {}
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateAvoidanceTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [tasks]);

  const updateAvoidanceTime = () => {
    setTasks(prev => {
      let pointsGained = 0;
      
      const updatedTasks = prev.map(task => {
        if (task.isActive && task.lastAvoidedAt) {
          const now = new Date();
          const lastAvoidedTime = new Date(task.lastAvoidedAt);
          const timeDiff = Math.floor((now.getTime() - lastAvoidedTime.getTime()) / 1000);
          const newPoints = Math.floor(timeDiff / 60); // 1 point per minute
          
          console.log(`Task: ${task.text}, Time diff: ${timeDiff}s, New points: ${newPoints}, Old points: ${task.points}`);
          
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
        console.log('Adding points:', pointsGained);
        setTotalPoints(prev => {
          const newTotal = prev + pointsGained;
          console.log('New total points:', newTotal);
          return newTotal;
        });
      }

      return updatedTasks;
    });
  };

  const addTask = (taskText: string, duration: number) => {
    if (!taskText.trim()) return;
    
    setConfirmationDialog({
      isOpen: true,
      taskName: taskText,
      duration: duration,
      onConfirm: () => confirmAddTask(taskText, duration)
    });
  };

  const confirmAddTask = (taskText: string, duration: number) => {
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60 * 1000);
    
    const newTaskObj: Task = {
      id: Date.now().toString(),
      text: taskText,
      createdAt: now,
      lastAvoidedAt: now,
      totalAvoidanceTime: 0,
      isActive: true,
      points: 0,
      startTime: now,
      endTime: endTime,
      estimatedDuration: duration
    };
    
    console.log('Creating new task:', newTaskObj);
    
    setTasks(prev => {
      const newTasks = [...prev, newTaskObj];
      console.log('Updated tasks array:', newTasks);
      return newTasks;
    });
    
    // Play sound with 2 second delay
    setTimeout(() => {
      playSound('taskAdded');
    }, 2000);
    
    toast({
      title: "🎯 New Avoidance Mission!",
      description: `Great! Now you can officially avoid: "${taskText}" for ${duration} minutes`,
      duration: 2000,
    });

    setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (task.isActive) {
          const pointsLost = Math.floor(task.points * 0.3);
          const pointsGained = Math.max(0, task.points - pointsLost);
          
          setTotalPoints(prev => prev + pointsGained);
          
          // Play sound with 2 second delay
          setTimeout(() => {
            playSound('taskDone');
          }, 2000);
          
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
          Add your first task by clicking on the bingo calendar below to start your journey of productive procrastination!
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-4 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        {tasks.length === 0 && renderWelcomePage()}

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-orange-800 tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            To-Don't List
          </h1>
          <p className="text-lg text-orange-700 font-medium">
            The Art of Productive Procrastination
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center items-center gap-3">
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Bingo and Games */}
          <div className="lg:col-span-7 space-y-6">
            <ProcrastinationBingo 
              tasks={activeTasks} 
              onAddTask={addTask} 
            />
            <ExcuseGenerator />
          </div>

          {/* Right Column - Profile and Shop */}
          <div className="lg:col-span-5 space-y-6">
            {/* Profile Section */}
            <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-800 flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl mb-2">😴</div>
                  <Badge className="bg-yellow-500 text-white">
                    {totalPoints >= 500 ? 'Master Avoider' : totalPoints >= 200 ? 'Pro Procrastinator' : 'Beginner'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white/80 p-2 rounded">
                    <div className="text-lg font-bold text-yellow-800">{totalPoints}</div>
                    <div className="text-xs text-yellow-600">Points</div>
                  </div>
                  <div className="bg-white/80 p-2 rounded">
                    <div className="text-lg font-bold text-green-800">{currentActivePoints}</div>
                    <div className="text-xs text-green-600">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Section */}
            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-800 flex items-center gap-2 text-lg">
                  <ShoppingBag className="w-5 h-5" />
                  Quick Shop
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white/80 rounded">
                    <span className="text-sm">Coffee Break</span>
                    <Button 
                      size="sm" 
                      onClick={() => handlePurchase(50)}
                      disabled={totalPoints < 50}
                      className="text-xs px-2 py-1"
                    >
                      50pts
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/80 rounded">
                    <span className="text-sm">Gaming Pass</span>
                    <Button 
                      size="sm" 
                      onClick={() => handlePurchase(120)}
                      disabled={totalPoints < 120}
                      className="text-xs px-2 py-1"
                    >
                      120pts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Tasks */}
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
                <CardContent className="space-y-3 max-h-64 overflow-y-auto">
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

            {/* History Section */}
            {tasks.length > 0 && (
              <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
                    <HistoryIcon className="w-5 h-5" />
                    Recent History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 bg-white/80 rounded text-xs">
                        {task.isActive ? (
                          <Clock className="w-3 h-3 text-orange-500" />
                        ) : (
                          <Trophy className="w-3 h-3 text-green-500" />
                        )}
                        <span className="truncate flex-1">{task.text}</span>
                        <Badge variant="secondary" className="text-xs">
                          {task.points}pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bot */}
      <ProcrastinationBot tasks={activeTasks} />

      {/* Task Confirmation Dialog */}
      <TaskConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        taskName={confirmationDialog.taskName}
        onConfirm={confirmationDialog.onConfirm}
        onCancel={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default Index;
