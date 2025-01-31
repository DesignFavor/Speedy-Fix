import { useEffect, useRef } from 'react';

const useSoundManager = () => {
  const sounds = useRef({
    Click: new Audio('/sound.wav'),
    Background: new Audio('/bg.ogg'),
  });

  const preloadSounds = () => {
    Object.values(sounds.current).forEach((sound) => {
      sound.load();
    });
  };

  const handleClickSound = () => {
    const clickSound = sounds.current.Click;
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch((error) => {
        console.warn('Click sound play failed:', error);
      });
    }
  };

  useEffect(() => {
    preloadSounds();

    const playBackgroundMusic = () => {
      const bgMusic = sounds.current.Background;
      if (bgMusic) {
        bgMusic.loop = true;
        bgMusic.play().catch((error) => {
          console.warn('Background music play failed:', error);
        });
      }
      window.removeEventListener('click', playBackgroundMusic);
    };

    window.addEventListener('click', playBackgroundMusic);

    return () => {
      const bgMusic = sounds.current.Background;
      if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }
      window.removeEventListener('click', playBackgroundMusic);
    };
  }, []);

  return { handleClickSound };
};

export default useSoundManager;
