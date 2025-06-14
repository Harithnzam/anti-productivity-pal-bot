
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Trophy, Coffee, Gamepad2, Music } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ElementType;
  category: 'rewards' | 'excuses' | 'boosts';
}

interface ShopProps {
  points: number;
  onPurchase: (cost: number) => void;
}

const shopItems: ShopItem[] = [
  {
    id: '1',
    name: 'Coffee Break Excuse',
    description: 'Perfect excuse for a 30-minute coffee break',
    cost: 50,
    icon: Coffee,
    category: 'excuses'
  },
  {
    id: '2',
    name: 'Gaming Session Pass',
    description: '2-hour guilt-free gaming session',
    cost: 120,
    icon: Gamepad2,
    category: 'rewards'
  },
  {
    id: '3',
    name: 'Productivity Immunity',
    description: 'Immune to guilt for 1 day',
    cost: 200,
    icon: Trophy,
    category: 'boosts'
  },
  {
    id: '4',
    name: 'Music Listening Marathon',
    description: 'Justify 3 hours of just listening to music',
    cost: 80,
    icon: Music,
    category: 'rewards'
  },
  {
    id: '5',
    name: 'Ultimate Procrastinator Badge',
    description: 'Show off your avoidance mastery',
    cost: 500,
    icon: Trophy,
    category: 'rewards'
  }
];

export const Shop = ({ points, onPurchase }: ShopProps) => {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const handlePurchase = (item: ShopItem) => {
    if (points >= item.cost) {
      onPurchase(item.cost);
      setPurchasedItems(prev => [...prev, item.id]);
      toast({
        title: "🛒 Purchase Successful!",
        description: `You bought "${item.name}" for ${item.cost} points!`,
        duration: 3000,
      });
    } else {
      toast({
        title: "😅 Not Enough Points!",
        description: `You need ${item.cost - points} more points to buy this item.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center gap-3 text-2xl">
            <ShoppingBag className="w-8 h-8" />
            Procrastination Shop
          </CardTitle>
          <div className="text-purple-600">
            Your Points: <Badge className="bg-yellow-500 text-yellow-900 text-lg px-3 py-1">{points}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map((item) => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = points >= item.cost;
          const IconComponent = item.icon;

          return (
            <Card key={item.id} className={`${
              isPurchased 
                ? 'bg-green-50 border-green-300' 
                : canAfford 
                  ? 'bg-white border-orange-200 hover:shadow-lg transition-shadow' 
                  : 'bg-gray-50 border-gray-300'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${
                    isPurchased ? 'bg-green-200' : 'bg-orange-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isPurchased ? 'text-green-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-orange-600">
                    {item.cost} pts
                  </div>
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford || isPurchased}
                    size="sm"
                    className={
                      isPurchased 
                        ? 'bg-green-500 hover:bg-green-500' 
                        : canAfford 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : ''
                    }
                  >
                    {isPurchased ? 'Owned' : canAfford ? 'Buy' : 'Too Expensive'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
