
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, User, Trophy, History } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-orange-200 p-4">
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => onPageChange('home')}
          variant={currentPage === 'home' ? 'default' : 'outline'}
          className={`flex items-center gap-2 ${
            currentPage === 'home' 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
          }`}
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
        <Button
          onClick={() => onPageChange('profile')}
          variant={currentPage === 'profile' ? 'default' : 'outline'}
          className={`flex items-center gap-2 ${
            currentPage === 'profile' 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
          }`}
        >
          <User className="w-4 h-4" />
          Profile
        </Button>
        <Button
          onClick={() => onPageChange('leaderboard')}
          variant={currentPage === 'leaderboard' ? 'default' : 'outline'}
          className={`flex items-center gap-2 ${
            currentPage === 'leaderboard' 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </Button>
      </div>
    </Card>
  );
};
