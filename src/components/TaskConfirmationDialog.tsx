
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smile, Coffee, Gamepad2, Tv, Bed } from 'lucide-react';

interface TaskConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  taskName: string;
}

const procrastinationMessages = [
  {
    title: "🎯 Perfect Choice!",
    message: "Why do today what you can put off until tomorrow? You're about to become a master of strategic delay!",
    icon: <Smile className="w-6 h-6 text-yellow-500" />
  },
  {
    title: "☕ Coffee Break Time?",
    message: "This task looks exhausting. Maybe you should grab a coffee first... or five. You'll need the energy!",
    icon: <Coffee className="w-6 h-6 text-brown-500" />
  },
  {
    title: "🎮 Gaming Sounds Better",
    message: "Tasks are temporary, but your gaming skills are forever. One quick match won't hurt, right?",
    icon: <Gamepad2 className="w-6 h-6 text-blue-500" />
  },
  {
    title: "📺 Educational Content Awaits",
    message: "YouTube has so much educational content! Watching cat videos is basically research... for something.",
    icon: <Tv className="w-6 h-6 text-red-500" />
  },
  {
    title: "😴 Rest is Important",
    message: "You know what? A well-rested person is more productive. Maybe a quick nap would help you focus better later!",
    icon: <Bed className="w-6 h-6 text-purple-500" />
  }
];

export const TaskConfirmationDialog = ({ isOpen, onConfirm, onCancel, taskName }: TaskConfirmationDialogProps) => {
  const [currentMessage] = useState(() => 
    procrastinationMessages[Math.floor(Math.random() * procrastinationMessages.length)]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            {currentMessage.icon}
          </div>
          <DialogTitle className="text-xl font-bold text-orange-800">
            {currentMessage.title}
          </DialogTitle>
          <DialogDescription className="text-center text-orange-700 mt-4">
            You're about to add <strong>"{taskName}"</strong> to your avoidance list.
          </DialogDescription>
          <div className="bg-white/80 p-4 rounded-lg mt-4 border border-orange-200">
            <p className="text-sm text-orange-800 italic">
              {currentMessage.message}
            </p>
          </div>
        </DialogHeader>
        
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Cancel (Be Productive 😱)
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Yes, Let's Procrastinate! 🎉
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
