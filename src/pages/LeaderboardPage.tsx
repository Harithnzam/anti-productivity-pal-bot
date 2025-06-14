
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { playSound } from '@/utils/soundManager';

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: string;
  tasksCompleted: number;
}

const LeaderboardPage = () => {
  const [totalPoints] = useLocalStorage<number>('todont-points', 0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [hasPlayedPodiumSound, setHasPlayedPodiumSound] = useState(false);

  useEffect(() => {
    // Generate mock leaderboard data with user's actual points
    const mockData: LeaderboardEntry[] = [
      { id: '1', name: 'LazyMaster2024', points: 1250, rank: 'Legendary Procrastinator', tasksCompleted: 45 },
      { id: '2', name: 'ProcrastiNinja', points: 980, rank: 'Master Avoider', tasksCompleted: 38 },
      { id: '3', name: 'AvoidanceKing', points: 875, rank: 'Master Avoider', tasksCompleted: 32 },
      { id: 'user', name: 'You', points: totalPoints, rank: getRank(totalPoints), tasksCompleted: 12 },
      { id: '4', name: 'SlothModeOn', points: 650, rank: 'Professional Procrastinator', tasksCompleted: 28 },
      { id: '5', name: 'DelayedGratification', points: 520, rank: 'Master Avoider', tasksCompleted: 25 },
      { id: '6', name: 'TomorrowIsTheDay', points: 445, rank: 'Professional Procrastinator', tasksCompleted: 22 },
      { id: '7', name: 'MaybeLaterMaybe', points: 380, rank: 'Professional Procrastinator', tasksCompleted: 18 },
      { id: '8', name: 'JustFiveMoreMinutes', points: 320, rank: 'Professional Procrastinator', tasksCompleted: 15 },
      { id: '9', name: 'IWillStartMonday', points: 280, rank: 'Casual Avoider', tasksCompleted: 14 },
    ];

    // Sort by points and assign positions
    const sortedData = mockData.sort((a, b) => b.points - a.points);
    setLeaderboard(sortedData);

    // Play podium sound for top 3 only once per visit
    if (!hasPlayedPodiumSound) {
      const userPosition = sortedData.findIndex(entry => entry.id === 'user') + 1;
      if (userPosition <= 3) {
        setTimeout(() => {
          playSound('podium');
        }, 2000);
      }
      setHasPlayedPodiumSound(true);
    }
  }, [totalPoints, hasPlayedPodiumSound]);

  const getRank = (points: number) => {
    if (points >= 1000) return 'Legendary Procrastinator';
    if (points >= 500) return 'Master Avoider';
    if (points >= 200) return 'Professional Procrastinator';
    if (points >= 50) return 'Casual Avoider';
    return 'Beginner Procrastinator';
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-amber-900';
      default:
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900';
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-orange-800 tracking-tight">
            Procrastination Leaderboard
          </h1>
          <p className="text-lg text-orange-700">Hall of Fame for Master Avoiders</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <Card key={entry.id} className={`${getPositionColor(index + 1)} border-2`}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {getPositionIcon(index + 1)}
                </div>
                <div className="text-lg font-bold mb-2">{entry.name}</div>
                <div className="text-2xl font-extrabold mb-2">{entry.points}</div>
                <div className="text-sm opacity-80">points</div>
                <Badge className="mt-2 bg-white/20 text-inherit">
                  #{index + 1}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-3 text-2xl">
              <Trophy className="w-8 h-8" />
              Complete Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                    entry.id === 'user'
                      ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-300 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold">
                    #{index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold ${
                        entry.id === 'user' ? 'text-orange-800' : 'text-gray-800'
                      }`}>
                        {entry.name}
                      </span>
                      {entry.id === 'user' && (
                        <Badge className="bg-orange-500 text-white">YOU</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.rank} • {entry.tasksCompleted} tasks completed
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-700">
                      {entry.points}
                    </div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>

                  {index < 3 && getPositionIcon(index + 1)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Stats Summary */}
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Your Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  #{leaderboard.findIndex(entry => entry.id === 'user') + 1}
                </div>
                <div className="text-sm text-purple-600">Your Rank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">{totalPoints}</div>
                <div className="text-sm text-purple-600">Your Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  {leaderboard.length > 0 && leaderboard[0].points - totalPoints}
                </div>
                <div className="text-sm text-purple-600">Points to #1</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
