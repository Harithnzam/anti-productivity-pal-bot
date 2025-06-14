
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Trophy, Target, Calendar } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  points: number;
  isActive: boolean;
}

interface ProfileProps {
  tasks: Task[];
  totalPoints: number;
}

export const Profile = ({ tasks, totalPoints }: ProfileProps) => {
  const activeTasks = tasks.filter(task => task.isActive);
  const completedTasks = tasks.filter(task => !task.isActive);
  const totalAvoidanceTime = activeTasks.reduce((sum, task) => sum + task.points, 0);

  const getRank = (points: number) => {
    if (points >= 1000) return { title: 'Legendary Procrastinator', color: 'bg-purple-500' };
    if (points >= 500) return { title: 'Master Avoider', color: 'bg-yellow-500' };
    if (points >= 200) return { title: 'Professional Procrastinator', color: 'bg-blue-500' };
    if (points >= 50) return { title: 'Casual Avoider', color: 'bg-green-500' };
    return { title: 'Beginner Procrastinator', color: 'bg-gray-500' };
  };

  const rank = getRank(totalPoints);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-3 text-2xl">
            <User className="w-8 h-8" />
            Your Procrastination Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">😴</div>
            <Badge className={`${rank.color} text-white text-lg px-4 py-2`}>
              {rank.title}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-white/80">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-800">{totalPoints}</div>
                <div className="text-sm text-yellow-600">Total Points Earned</div>
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
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{totalAvoidanceTime}</div>
                <div className="text-sm text-green-600">Minutes Avoided Today</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">😱</div>
                <div className="text-2xl font-bold text-red-800">{completedTasks.length}</div>
                <div className="text-sm text-red-600">Productivity Incidents</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Achievement Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Next Rank Progress</span>
                  <span className="text-sm text-gray-600">
                    {totalPoints}/500 points
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((totalPoints / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
