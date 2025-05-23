import { useEffect, useRef, useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Mic, MicOff, Send, RefreshCcw, Volume2 } from 'lucide-react';
import LiveGeminiClient, { ExposedMethods } from '@/lib/live-gemini';
import { AudioPlayer } from './audio-player';
import { AudioRecorder } from './audio-recorder';
import { toast } from 'sonner';
import { VADOptions } from '@/lib/audio-input-manager';

// Interface for messages
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

interface VoiceChatProps {
  profileId: string;
  profileName: string;
  profileType: string;
  systemInstructions?: string;
  onMessageReceived?: (message: ChatMessage | string) => void;
  apiKey?: string;
  vadOptions?: Partial<VADOptions>;
}

export function VoiceChat({
  profileId,
  profileName = 'Child',
  profileType = 'standard',
  systemInstructions,
  onMessageReceived,
  apiKey = '',
  vadOptions
}: VoiceChatProps) {
  const [status, setStatus] = useState<string>('Disconnected');
  const [textInput, setTextInput] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([]);
  const [voiceActivityDetected, setVoiceActivityDetected] = useState(false);

  const liveGeminiRef = useRef<ExposedMethods>(null);

  // Handle connection
  const handleConnect = async () => {
    if (!liveGeminiRef.current) {
      toast.error('Live Gemini client not initialized');
      return;
    }

    try {
      setStatus('Connecting...');
      await liveGeminiRef.current.connect();
      setIsConnected(true);
      toast.success('Connected to Gemini');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('Disconnected');
      setIsConnected(false);
    }
  };

  // Handle disconnection
  const handleDisconnect = () => {
    if (!liveGeminiRef.current) return;

    liveGeminiRef.current.disconnect();
    setIsConnected(false);
    setIsListening(false);
    setVoiceActivityDetected(false);
    setStatus('Disconnected');
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (!liveGeminiRef.current || !isConnected) {
      toast.error('Please connect first');
      return;
    }

    try {
      if (!isListening) {
        await liveGeminiRef.current.startAudioStream();
        setIsListening(true);
        toast.success('Listening for voice input...');
      } else {
        liveGeminiRef.current.stopAudioStream();
        setIsListening(false);
        setVoiceActivityDetected(false);
        toast.info('Stopped listening');
      }
    } catch (error) {
      console.error('Microphone error:', error);
      toast.error(`Microphone error: ${error instanceof Error ? error.message : String(error)}`);
      setIsListening(false);
      setVoiceActivityDetected(false);
    }
  };

  // Send text message
  const sendMessage = () => {
    if (!liveGeminiRef.current || !isConnected || !textInput.trim()) return;

    const messageToSend = textInput.trim();

    // Add to messages list
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);

    // Send to Gemini
    liveGeminiRef.current.sendTextMessage(messageToSend);

    // Clear input
    setTextInput('');
  };

  // Update VAD settings
  const updateVADSettings = (options: Partial<VADOptions>) => {
    if (!liveGeminiRef.current) return;

    try {
      liveGeminiRef.current.updateVADSettings(options);
      toast.success('Voice detection settings updated');
    } catch (error) {
      console.error('Failed to update VAD settings:', error);
      toast.error('Failed to update voice detection settings');
    }
  };

  useEffect(() => {
    // Optionally adjust VAD settings based on user profile
    if (liveGeminiRef.current && vadOptions) {
      updateVADSettings(vadOptions);
    }
  }, [vadOptions]);

  return (
    <Card className="w-full max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Chat with {profileName}
          {status !== 'Disconnected' && ` - ${status}`}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={isConnected ? "destructive" : "default"}
            size="sm"
            onClick={isConnected ? handleDisconnect : handleConnect}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>

      {/* Messages display area */}
      <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Start a conversation with {profileName}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-secondary text-secondary-foreground'
              } max-w-[80%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              {message.content}
            </div>
          ))
        )}
      </div>

      {/* Transcript display */}
      {transcript && (
        <div className="bg-background border border-border p-2 rounded-md mb-4 text-sm">
          <p className="font-semibold">Transcript:</p>
          <p>{transcript}</p>
        </div>
      )}

      {/* Voice activity indicator */}
      <div className="relative mb-4">
        <div className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
          voiceActivityDetected
            ? 'bg-green-500'
            : isListening
              ? 'bg-blue-500'
              : 'bg-gray-300'
        }`}>
          {voiceActivityDetected && (
            <div className="absolute -top-1 right-0 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="flex gap-2 mt-2">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          className={`rounded-full ${voiceActivityDetected ? 'bg-green-100' : ''}`}
          onClick={toggleMicrophone}
          disabled={!isConnected}
        >
          {isListening ? <MicOff /> : <Mic />}
        </Button>

        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={!isConnected}
        />

        <Button
          type="button"
          onClick={sendMessage}
          disabled={!isConnected || !textInput.trim()}
          size="icon"
        >
          <Send />
        </Button>
      </div>

      {/* LiveGemini Client */}
      <LiveGeminiClient
        ref={liveGeminiRef}
        apiKey={apiKey}
        profileId={profileId}
        profileName={profileName}
        profileType={profileType}
        systemInstructions={systemInstructions}
        onStatusChange={setStatus}
        onError={(error) => toast.error(error)}
        onTranscriptUpdate={(type, text) => {
          if (type === 'model') {
            // Create a properly formatted message
            const modelMessage = {
              role: 'model',
              content: text
            };
            setMessages(prev => [...prev, modelMessage]);

            // Create a properly formatted ChatMessage to pass to the parent
            if (onMessageReceived) {
              const chatMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: text
              };
              onMessageReceived(chatMessage);
            }
          } else {
            setTranscript(text);
            // If we get a transcript, voice activity is happening
            setVoiceActivityDetected(true);

            // Auto-reset voice activity after a short delay
            const timeout = setTimeout(() => {
              setVoiceActivityDetected(false);
            }, 1000);

            return () => clearTimeout(timeout);
          }
        }}
        vadOptions={vadOptions}
      />
    </Card>
  );
}
