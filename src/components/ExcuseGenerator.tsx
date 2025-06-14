
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const excuses = [
  "Mercury is in retrograde, affecting my productivity chakras.",
  "I'm letting my subconscious process the task for optimal results.",
  "I'm practicing the ancient art of strategic delay.",
  "My productivity energy is recharging for maximum efficiency later.",
  "I'm waiting for the perfect alignment of motivation and opportunity.",
  "I'm giving others a chance to step up and shine.",
  "I'm conducting important research on alternative approaches.",
  "My intuition says the timing isn't quite right yet.",
  "I'm building anticipation for when I finally tackle this task.",
  "I'm preserving my mental energy for more critical tasks.",
  "I'm in a creative incubation period right now.",
  "The universe is clearly not ready for me to complete this yet.",
  "I'm practicing mindful procrastination as a form of meditation.",
  "I'm waiting for technology to advance and make this easier.",
  "I'm giving myself time to approach this with fresh perspective.",
  "I'm honoring my natural rhythms and energy cycles.",
  "I'm conducting a thorough risk assessment first.",
  "I'm waiting for inspiration to strike organically.",
  "I'm building character through delayed gratification.",
  "I'm optimizing for long-term success over short-term action."
];

export const ExcuseGenerator = () => {
  const [currentExcuse, setCurrentExcuse] = useState(excuses[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const generateExcuse = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      setCurrentExcuse(randomExcuse);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-100 to-blue-100 border-2 border-indigo-200">
      <CardHeader>
        <CardTitle className="text-indigo-800 flex items-center gap-2">
          🎭 Professional Excuse Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 rounded-lg p-4 mb-4 min-h-[80px] flex items-center">
          <p className="text-gray-800 text-lg leading-relaxed font-medium italic">
            "{currentExcuse}"
          </p>
        </div>
        <Button
          onClick={generateExcuse}
          disabled={isSpinning}
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning ? 'Crafting Excuse...' : 'Generate New Excuse'}
        </Button>
        <p className="text-xs text-indigo-600 mt-2 text-center">
          Perfect for explaining your productive procrastination to others!
        </p>
      </CardContent>
    </Card>
  );
};
