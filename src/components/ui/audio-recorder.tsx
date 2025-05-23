import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Mic, MicOff, Square } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isDisabled?: boolean;
}

export function AudioRecorder({ onRecordingComplete, isDisabled = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Clean up timer on component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Stop any active recording
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);

        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access the microphone. Please make sure you have a microphone connected and have granted permission to use it.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <>
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="flex items-center gap-2"
            disabled={isDisabled}
          >
            <Square className="h-4 w-4" />
            <span>{formatTime(recordingTime)}</span>
          </Button>
        </>
      ) : (
        <Button
          onClick={startRecording}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isDisabled}
        >
          <Mic className="h-4 w-4" />
          <span>Record</span>
        </Button>
      )}
    </div>
  );
}

export default AudioRecorder;
