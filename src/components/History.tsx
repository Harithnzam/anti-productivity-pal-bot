
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History as HistoryIcon, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  points: number;
  isActive: boolean;
  createdAt: Date;
}

interface HistoryProps {
  tasks: Task[];
}

export const History = ({ tasks }: HistoryProps) => {
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-3 text-2xl">
            <HistoryIcon className="w-8 h-8" />
            Your Procrastination History
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <Card className="bg-white/90">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600">No procrastination history yet. Start avoiding some tasks!</p>
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map((task) => (
            <Card key={task.id} className={`bg-white/90 border-2 ${
              task.isActive ? 'border-orange-200' : 'border-gray-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {task.isActive ? (
                      <Clock className="w-5 h-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{task.text}</h3>
                      <p className="text-sm text-gray-500">
                        Added on {formatDate(task.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={`${
                      task.isActive 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.points} pts
                    </Badge>
                    <Badge variant={task.isActive ? 'default' : 'secondary'}>
                      {task.isActive ? 'Avoiding' : 'Completed'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
