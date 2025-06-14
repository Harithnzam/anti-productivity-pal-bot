
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Trophy, Coffee, Gamepad2, Music, Star } from 'lucide-react';
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
  onPurchase: (cost: number) => boolean;
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
    icon: Star,
    category: 'rewards'
  },
  {
    id: '6',
    name: 'Social Media Deep Dive',
    description: 'Spend 2 hours scrolling guilt-free',
    cost: 75,
    icon: Trophy,
    category: 'excuses'
  }
];

export const Shop = ({ points, onPurchase }: ShopProps) => {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const handlePurchase = (item: ShopItem) => {
    const success = onPurchase(item.cost);
    
    if (success) {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rewards': return 'bg-green-100 text-green-800';
      case 'excuses': return 'bg-yellow-100 text-yellow-800';
      case 'boosts': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <Card key={item.id} className={`transition-all duration-300 ${
              isPurchased 
                ? 'bg-green-50 border-green-300 shadow-md' 
                : canAfford 
                  ? 'bg-white border-orange-200 hover:shadow-xl hover:scale-105 cursor-pointer' 
                  : 'bg-gray-50 border-gray-300 opacity-75'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-full ${
                    isPurchased ? 'bg-green-200' : 'bg-orange-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isPurchased ? 'text-green-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <Badge className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{item.description}</p>
                
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
                        ? 'bg-green-500 hover:bg-green-500 cursor-default' 
                        : canAfford 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'opacity-50 cursor-not-allowed'
                    }
                  >
                    {isPurchased ? '✓ Owned' : canAfford ? 'Buy Now' : 'Too Expensive'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {purchasedItems.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Your Purchases ({purchasedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {purchasedItems.map(itemId => {
                const item = shopItems.find(i => i.id === itemId);
                return item ? (
                  <Badge key={itemId} className="bg-green-500 text-white">
                    {item.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
