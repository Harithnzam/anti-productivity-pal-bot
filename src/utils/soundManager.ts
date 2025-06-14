
export const soundUrls = {
  taskAdded: 'https://www.myinstants.com/media/sounds/vine-boom.mp3',
  taskDone: 'https://www.myinstants.com/media/sounds/success-fanfare-trumpets.mp3',
  podium: 'https://www.myinstants.com/media/sounds/victory-ff.mp3'
};

export const playSound = (soundType: keyof typeof soundUrls) => {
  try {
    const audio = new Audio(soundUrls[soundType]);
    audio.volume = 0.3; // Set moderate volume
    audio.play().catch(err => {
      console.log('Sound play failed:', err);
      // Fallback - try alternative approach
      const fallbackAudio = document.createElement('audio');
      fallbackAudio.src = soundUrls[soundType];
      fallbackAudio.volume = 0.3;
      fallbackAudio.play().catch(() => {
        console.log('Fallback sound also failed');
      });
    });
  } catch (error) {
    console.log('Sound initialization failed:', error);
  }
};
