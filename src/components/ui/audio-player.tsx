import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string | null;
  className?: string;
}

export function AudioPlayer({ audioSrc, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioSrc || '');
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Cleanup
    return () => {
      audio.pause();
      audio.src = '';

      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [audioSrc]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;

    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioSrc) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={togglePlayPause}
          disabled={!audioSrc}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={restart}
          disabled={!audioSrc}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <span className="text-xs text-muted-foreground min-w-[40px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

export default AudioPlayer;
