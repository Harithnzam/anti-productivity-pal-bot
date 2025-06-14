
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Trophy, Target, Calendar, Clock, Zap } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Task {
  id: string;
  text: string;
  points: number;
  isActive: boolean;
  createdAt: Date;
  totalAvoidanceTime: number;
}

const ProfilePage = () => {
  const [tasks] = useLocalStorage<Task[]>('todont-tasks', []);
  const [totalPoints] = useLocalStorage<number>('todont-points', 0);

  const activeTasks = tasks.filter(task => task.isActive);
  const completedTasks = tasks.filter(task => !task.isActive);
  const totalAvoidanceTime = activeTasks.reduce((sum, task) => sum + task.points, 0);

  const getRank = (points: number) => {
    if (points >= 1000) return { title: 'Legendary Procrastinator', color: 'bg-purple-500', emoji: '👑' };
    if (points >= 500) return { title: 'Master Avoider', color: 'bg-yellow-500', emoji: '🏆' };
    if (points >= 200) return { title: 'Professional Procrastinator', color: 'bg-blue-500', emoji: '🎯' };
    if (points >= 50) return { title: 'Casual Avoider', color: 'bg-green-500', emoji: '😴' };
    return { title: 'Beginner Procrastinator', color: 'bg-gray-500', emoji: '🐣' };
  };

  const getNextRank = (points: number) => {
    if (points < 50) return { target: 50, title: 'Casual Avoider' };
    if (points < 200) return { target: 200, title: 'Professional Procrastinator' };
    if (points < 500) return { target: 500, title: 'Master Avoider' };
    if (points < 1000) return { target: 1000, title: 'Legendary Procrastinator' };
    return { target: 1000, title: 'Max Level' };
  };

  const rank = getRank(totalPoints);
  const nextRank = getNextRank(totalPoints);
  const progressPercentage = Math.min((totalPoints / nextRank.target) * 100, 100);

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-orange-800 tracking-tight">
            Procrastination Profile
          </h1>
          <p className="text-lg text-orange-700">Your journey in the art of productive avoidance</p>
        </div>

        {/* Main Profile Card */}
        <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-3 text-2xl">
              <User className="w-8 h-8" />
              Your Procrastination Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{rank.emoji}</div>
              <Badge className={`${rank.color} text-white text-lg px-4 py-2`}>
                {rank.title}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/80">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-800">{totalPoints}</div>
                  <div className="text-sm text-yellow-600">Total Points</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-800">{activeTasks.length}</div>
                  <div className="text-sm text-orange-600">Active Avoidances</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-800">{totalAvoidanceTime}</div>
                  <div className="text-sm text-green-600">Minutes Avoided</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-800">{completedTasks.length}</div>
                  <div className="text-sm text-red-600">Tasks Completed</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress to Next Rank */}
            <Card className="bg-white/80">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Progress to Next Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Next: {nextRank.title}</span>
                    <span className="text-sm text-gray-600">
                      {totalPoints}/{nextRank.target} points
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                  <div className="text-center text-sm text-gray-600">
                    {nextRank.target - totalPoints} points to next rank
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80">
              <CardHeader>
                <CardTitle className="text-lg">Recent Procrastination Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.slice(0, 10).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      {task.isActive ? (
                        <Clock className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Trophy className="w-4 h-4 text-green-500" />
                      )}
                      <span className="flex-1 truncate">{task.text}</span>
                      <Badge variant="secondary">
                        {task.points} pts
                      </Badge>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.isActive ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {task.isActive ? 'Active' : 'Done'}
                      </span>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No procrastination activity yet. Start avoiding some tasks!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
