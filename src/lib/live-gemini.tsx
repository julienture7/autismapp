'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { AudioInputManager, VADOptions } from './audio-input-manager';

// Update to use the native audio dialogue model
const LIVE_API_MODEL_NAME = 'gemini-2.5-flash-preview-native-audio-dialog';
const OUTPUT_AUDIO_SAMPLE_RATE = 24000;
const AUDIO_FORMAT_FOR_GEMINI = 'audio/pcm';

// VAD options to fine-tune voice detection sensitivity
const DEFAULT_VAD_OPTIONS: VADOptions = {
  enabled: true,
  silenceThreshold: 0.01, // Adjust based on testing and environmental noise
  silenceDurationMs: 1000, // Wait 1 second of silence before ending activity
  minSpeechDurationMs: 300, // Minimum 300ms of speech to consider it valid activity
};

export interface LiveGeminiClientProps {
  apiKey: string;
  profileId: string;
  onStatusChange: (status: string) => void;
  onError: (message: string) => void;
  onTranscriptUpdate?: (type: 'interim' | 'final' | 'model', transcript: string) => void;
  systemInstructions?: string;
  profileName?: string;
  profileType?: string;
  languageCode?: string;
  voiceName?: string;
  onLogExport?: (log: string) => void;
  autoStartStreamOnSetup?: boolean;
  vadOptions?: Partial<VADOptions>;
}

export interface ExposedMethods {
  connect: () => Promise<void>;
  disconnect: () => void;
  startAudioStream: () => Promise<void>;
  stopAudioStream: () => void;
  sendTextMessage: (text: string) => void;
  isConnected: boolean;
  isStreamingAudio: boolean;
  isAISpeaking: boolean;
  getDebugLog: () => string;
  updateVADSettings: (options: Partial<VADOptions>) => void;
}

const LiveGeminiClient = forwardRef<ExposedMethods, LiveGeminiClientProps>(({
  apiKey,
  profileId,
  onStatusChange,
  onError,
  onTranscriptUpdate,
  systemInstructions,
  profileName = 'Child',
  profileType = 'standard',
  languageCode = 'en-US',
  voiceName = 'Zephyr',
  onLogExport,
  autoStartStreamOnSetup = false,
  vadOptions = {},
}, ref) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreamingAudio, setIsStreamingAudio] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioInputManagerRef = useRef<AudioInputManager | null>(null);
  const playbackAudioContextRef = useRef<AudioContext | null>(null);
  const audioPlayerQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingFromQueueRef = useRef(false);
  const isUserSpeakingRef = useRef(false);

  const logEntriesRef = useRef<string[]>([]);
  const instanceIdRef = useRef(Symbol(`${profileName}-${profileId?.slice(-4)}-${Date.now().toString().slice(-5)}`));

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [LGC ID: ${instanceIdRef.current.description?.slice(-10)}] ${message}`;
    console.log(logEntry);
    logEntriesRef.current.push(logEntry);
  }, []);

  const getFullDebugLog = useCallback(() => logEntriesRef.current.join('\n'), []);

  const getSystemInstructionText = useCallback((): string => {
    return systemInstructions ||
      `You are WonderChat, a friendly AI assistant designed to help ${profileName}, who is a child with ${profileType}.
      Keep your responses appropriate for children. Be patient, clear, and encouraging.
      Focus on building confidence and creating a positive experience.
      Adapt your communication style to support their specific needs.`;
  }, [systemInstructions, profileName, profileType]);

  // Helper function to convert PCM16 array buffer to base64
  const pcm16ArrayBufferToBase64 = (pcm16Buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(pcm16Buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Set up handlers for AudioInputManager events
  const setupAudioInputManagerHandlers = useCallback((audioInputManager: AudioInputManager) => {
    // For raw PCM audio data
    audioInputManager.on('rawData', (pcm16Buffer: ArrayBuffer) => {
      if (isConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isUserSpeakingRef.current) {
        // Send raw PCM data directly through WebSocket
        const payload = {
          realtimeInput: {
            media: {
              mimeType: `${AUDIO_FORMAT_FOR_GEMINI};rate=16000`,
              data: pcm16ArrayBufferToBase64(pcm16Buffer)
            }
          }
        };
        wsRef.current.send(JSON.stringify(payload));
      }
    });

    // Voice activity detection events
    audioInputManager.on('activityStart', () => {
      addLog("VAD detected speech start - sending activityStart to Gemini");
      isUserSpeakingRef.current = true;

      if (isConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Send activity start signal to Gemini
        const payload = { realtimeInput: { activityStart: {} }};
        wsRef.current.send(JSON.stringify(payload));
        onStatusChange("Listening...");
      }
    });

    audioInputManager.on('activityEnd', () => {
      addLog("VAD detected speech end - sending activityEnd to Gemini");
      isUserSpeakingRef.current = false;

      if (isConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Send activity end signal to Gemini
        const payload = { realtimeInput: { activityEnd: {} }};
        wsRef.current.send(JSON.stringify(payload));
        onStatusChange("Processing...");
      }
    });

    // Status and error handling
    audioInputManager.on('status', (message: string) => {
      addLog(`AudioInputManager status: ${message}`);
    });

    audioInputManager.on('error', (message: string) => {
      addLog(`AudioInputManager error: ${message}`);
      onError(`Microphone error: ${message}`);
    });

    audioInputManager.on('activeStateChange', (isActive: boolean) => {
      addLog(`AudioInputManager active state changed: ${isActive}`);
      setIsStreamingAudio(isActive);
    });
  }, [addLog, isConnected, onError, onStatusChange]);

  // Initialize and manage AudioInputManager instance with VAD options
  useEffect(() => {
    addLog(`AudioInputManager Effect: Initializing for ProfileID: ${profileId}.`);

    if (audioInputManagerRef.current) {
      addLog("AudioInputManager Effect: WARN - Existing AIM ref found. Destroying it first.");
      audioInputManagerRef.current.destroy();
    }

    // Merge default VAD options with any user-provided options
    const mergedVADOptions = { ...DEFAULT_VAD_OPTIONS, ...vadOptions };
    addLog(`AudioInputManager Effect: Using VAD options: ${JSON.stringify(mergedVADOptions)}`);

    const newAudioInputManager = new AudioInputManager(
      `[AIM-${profileId?.slice(-4)}-${instanceIdRef.current.description?.slice(-5)}]`,
      mergedVADOptions
    );
    audioInputManagerRef.current = newAudioInputManager;
    addLog(`AudioInputManager Effect: New AIM instance created: ${newAudioInputManager['instanceLogPrefix']}`);

    // Set up event handlers for the new AudioInputManager
    setupAudioInputManagerHandlers(newAudioInputManager);

    return () => {
      if (audioInputManagerRef.current) {
        audioInputManagerRef.current.destroy();
        audioInputManagerRef.current = null;
        addLog("AudioInputManager Effect: Cleanup - AIM instance destroyed");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]); // Only re-run when profileId changes

  const cleanupPlaybackAudioResources = useCallback((fullCleanup = true) => {
    addLog(`cleanupPlaybackAudioResources called, fullCleanup=${fullCleanup}`);

    audioPlayerQueueRef.current = [];
    isPlayingFromQueueRef.current = false;

    if (fullCleanup && playbackAudioContextRef.current) {
      addLog('Closing AudioContext');
      playbackAudioContextRef.current.close().catch(e => addLog(`Error closing AudioContext: ${e}`));
      playbackAudioContextRef.current = null;
    }
  }, [addLog]);

  const disconnectFromGemini = useCallback(() => {
    addLog('disconnect method called.');

    cleanupPlaybackAudioResources(true);

    if (audioInputManagerRef.current?.getIsActive()) {
      addLog('Stopping AudioInputManager');
      audioInputManagerRef.current.stop();
    }

    if (wsRef.current) {
      if (wsRef.current.readyState !== WebSocket.CLOSED) {
        addLog('Closing WebSocket');
        wsRef.current.close(1000, 'User disconnected');
      }
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsStreamingAudio(false);
    setIsAISpeaking(false);
    onStatusChange('Disconnected');
  }, [addLog, cleanupPlaybackAudioResources, onStatusChange]);

  const playNextAudioChunkFromQueue = useCallback(async () => {
    if (!audioPlayerQueueRef.current.length || isPlayingFromQueueRef.current) return;

    isPlayingFromQueueRef.current = true;
    addLog(`Playing audio from queue. Items: ${audioPlayerQueueRef.current.length}`);
    setIsAISpeaking(true);
    onStatusChange('Speaking...');

    try {
      if (!playbackAudioContextRef.current) {
        addLog('Creating new AudioContext');
        playbackAudioContextRef.current = new AudioContext({ sampleRate: OUTPUT_AUDIO_SAMPLE_RATE });
      }

      while (audioPlayerQueueRef.current.length > 0) {
        const audioData = audioPlayerQueueRef.current.shift();
        if (!audioData) continue;

        // Convert PCM audio to playable format
        const audioBuffer = await playbackAudioContextRef.current.decodeAudioData(audioData);
        const source = playbackAudioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(playbackAudioContextRef.current.destination);

        await new Promise<void>((resolve) => {
          source.onended = () => resolve();
          source.start();
        });

        addLog('Audio chunk playback complete');
      }
    } catch (error) {
      addLog(`Error playing audio: ${error}`);
      onError(`Audio playback error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      isPlayingFromQueueRef.current = false;
      setIsAISpeaking(false);

      if (isConnected && !isStreamingAudio) {
        onStatusChange('Ready');
      }
    }
  }, [addLog, isConnected, isStreamingAudio, onError, onStatusChange]);

  const handleServerMessage = useCallback((message: any) => {
    if (!message) {
      addLog('WARN: Received empty message');
      return;
    }

    // Handle setup complete
    if (message.setupComplete) {
      addLog('Setup complete received');
      setIsConnected(true);
      onStatusChange('Connected');
      return;
    }

    // Handle server content (text/audio responses)
    if (message.serverContent) {
      const { serverContent } = message;

      // Handle interruptions
      if (serverContent.interrupted) {
        addLog('Generation interrupted');
        cleanupPlaybackAudioResources(false);
        if (onTranscriptUpdate) onTranscriptUpdate('model', '[Interrupted]');
        return;
      }

      // Handle turn complete
      if (serverContent.turnComplete) {
        addLog('Turn complete');
        return;
      }

      // Handle model output (audio or text)
      if (serverContent.modelTurn?.parts) {
        const { parts } = serverContent.modelTurn;

        // Handle text responses
        const textParts = parts.filter((part: any) => typeof part.text === 'string');
        if (textParts.length > 0) {
          const text = textParts.map((part: any) => part.text).join(' ');
          addLog(`Model text response: ${text.substring(0, 50)}...`);
          if (onTranscriptUpdate) onTranscriptUpdate('model', text);
        }

        // Handle audio responses
        const audioParts = parts.filter((part: any) => part.inlineData?.mimeType?.startsWith('audio/'));
        if (audioParts.length > 0) {
          addLog(`Received ${audioParts.length} audio parts`);

          for (const part of audioParts) {
            if (part.inlineData?.data) {
              const base64Data = part.inlineData.data;
              const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
              audioPlayerQueueRef.current.push(binaryData.buffer);
            }
          }

          // Start playback if not already playing
          playNextAudioChunkFromQueue();
        }
      }

      // Handle input transcription (when user speaks)
      if (serverContent.inputTranscription?.text) {
        const transcriptionText = serverContent.inputTranscription.text;
        const isFinal = serverContent.inputTranscription.isFinal;

        addLog(`Input transcription ${isFinal ? '(final)' : '(interim)'}: ${transcriptionText}`);

        if (onTranscriptUpdate) {
          onTranscriptUpdate(
            isFinal ? 'final' : 'interim',
            transcriptionText
          );
        }
      }
    }

    // Handle errors
    if (message.error) {
      const errorMessage = message.error.message || 'Unknown server error';
      addLog(`Server error: ${errorMessage}`);
      onError(`Gemini error: ${errorMessage}`);

      if (message.error.code === 'UNAUTHENTICATED') {
        disconnectFromGemini();
      }
    }

    // Handle websocket closing notifications
    if (message.goAway) {
      addLog(`Server is closing connection: ${JSON.stringify(message.goAway)}`);
      // Optionally reconnect here or notify the user
    }
  }, [addLog, cleanupPlaybackAudioResources, disconnectFromGemini, onError, onStatusChange, onTranscriptUpdate, playNextAudioChunkFromQueue]);

  const sendSetupMessage = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog('Cannot send setup: WS not open');
      return;
    }

    const systemInstruction = getSystemInstructionText();
    addLog(`Sending setup message with system instruction (${systemInstruction.length} chars)`);

    const setupMessage = {
      setup: {
        model: LIVE_API_MODEL_NAME,
        config: {
          // Set audio as the response modality
          responseModalities: ["AUDIO"],

          // Configure speech for native audio
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName
              }
            }
          },

          // System instructions
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },

          // Enable native audio features
          enableAffectiveDialog: true,
          proactivity: { proactiveAudio: true },

          // Configure input audio transcription
          inputAudioTranscription: {},

          // Voice activity detection config
          realtimeInputConfig: {
            automaticActivityDetection: {
              disabled: false,
              startOfSpeechSensitivity: "START_SENSITIVITY_HIGH",
              endOfSpeechSensitivity: "END_SENSITIVITY_HIGH",
              prefixPaddingMs: 500,
              silenceDurationMs: 800
            },
            activityHandling: "INTERRUPTION"
          }
        }
      }
    };

    wsRef.current.send(JSON.stringify(setupMessage));
    onStatusChange('Initializing...');
  }, [getSystemInstructionText, onStatusChange, voiceName, addLog]);

  const connectToGemini = useCallback(async () => {
    logEntriesRef.current = [];
    addLog('Connect method called');

    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      addLog('WARN: WS exists and not closed. Forcing close.');
      wsRef.current.onclose = null;
      wsRef.current.close(1000, 'Forced pre-connect close');
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    cleanupPlaybackAudioResources(true);
    addLog('Cleanup of playback complete before new connection.');

    onStatusChange('Connecting...');
    const WSS_SERVICE_URL = `wss://generativelanguage.googleapis.com/v1/projects/experimental/locations/us-central1/models/${LIVE_API_MODEL_NAME}:streamGenerateContent?key=${apiKey}`;
    addLog(`Connecting to WS: ${WSS_SERVICE_URL.split('?')[0]}`);

    try {
      wsRef.current = new WebSocket(WSS_SERVICE_URL);
      wsRef.current.binaryType = "arraybuffer";
    } catch (e) {
      addLog(`ERROR WS creation: ${e}`);
      onError(`WS creation failed: ${e}`);
      onStatusChange('Disconnected');
      return Promise.reject(e);
    }

    if (!wsRef.current) {
      addLog("ERROR: wsRef.current is null.");
      onError("WS creation failed.");
      return Promise.reject("WS null");
    }

    return new Promise<void>((resolve, reject) => {
        if(!wsRef.current) {
          reject(new Error("WebSocket ref is null"));
          return;
        }

        wsRef.current.onopen = () => {
          addLog('WS open. Sending setup.');
          onStatusChange('Connection open...');
          sendSetupMessage();
          resolve();
        };

        wsRef.current.onmessage = (event: MessageEvent) => {
            try {
                const data = event.data;
                let message;

                if (data instanceof ArrayBuffer) {
                    message = JSON.parse(new TextDecoder().decode(data));
                }
                else if (typeof data === 'string') {
                    message = JSON.parse(data);
                }
                else {
                    addLog(`WARN: Unhandled WS message type: ${typeof data}`);
                    return;
                }

                handleServerMessage(message);
            } catch (e) {
                addLog(`ERROR parsing WS message: ${e}. Data: ${event.data}`);
            }
        };

        wsRef.current.onerror = (event) => {
            addLog(`WS error event.`);
            onError('WebSocket error.');
            disconnectFromGemini();
            reject(event);
        };

        wsRef.current.onclose = (event) => {
            addLog(`WS closed. Code: ${event.code}, Reason: ${event.reason}, WasClean: ${event.wasClean}`);
            disconnectFromGemini();
        };
    });
  }, [apiKey, addLog, onStatusChange, onError, sendSetupMessage, handleServerMessage, cleanupPlaybackAudioResources, disconnectFromGemini]);

  const startAudioStreaming = useCallback(async () => {
    addLog('startAudioStream func called.');

    if (!isConnected) {
      addLog('Cannot start audio: Not connected.');
      onError('Cannot start: Not connected.');
      return;
    }

    if (!audioInputManagerRef.current) {
      addLog('ERROR: AudioInputManager not ready.');
      onError('Audio system not ready.');
      return;
    }

    if (audioInputManagerRef.current.getIsActive()) {
      addLog('AudioInputManager already active.');
      return;
    }

    try {
      await audioInputManagerRef.current.start();
    } catch (err) {
        const errorMsg = `Mic setup error: ${err instanceof Error ? err.message : String(err)}`;
        addLog(`ERROR in startAudioStream: ${errorMsg}`);
        onError(errorMsg);
    }
  }, [isConnected, addLog, onError]);

  const stopAudioStreaming = useCallback(() => {
    addLog('stopAudioStream called.');

    if (!audioInputManagerRef.current?.getIsActive()) {
      addLog('AudioInputManager not active.');
      return;
    }

    audioInputManagerRef.current.stop();
  }, [addLog]);

  const sendUserText = useCallback((text: string) => {
    if (!isConnected || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog('Cannot send text: Not connected');
      onError('Not connected');
      return;
    }

    if (!text.trim()) {
      addLog('Text is empty, not sending');
      return;
    }

    addLog(`Sending text message: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
    onStatusChange('Sending message...');

    const message = {
      clientContent: {
        turns: [
          {
            parts: [
              { text }
            ]
          }
        ],
        turnComplete: true
      }
    };

    wsRef.current.send(JSON.stringify(message));
  }, [isConnected, addLog, onError, onStatusChange]);

  useImperativeHandle(ref, () => ({
    connect: async () => {
      return connectToGemini();
    },
    disconnect: () => {
      disconnectFromGemini();
    },
    startAudioStream: async () => {
      return startAudioStreaming();
    },
    stopAudioStream: () => {
      stopAudioStreaming();
    },
    sendTextMessage: (text: string) => {
      sendUserText(text);
    },
    get isConnected() {
      return isConnected;
    },
    get isStreamingAudio() {
      return isStreamingAudio;
    },
    get isAISpeaking() {
      return isAISpeaking;
    },
    getDebugLog: () => getFullDebugLog(),
    updateVADSettings: (options: Partial<VADOptions>) => {
      if (audioInputManagerRef.current) {
        addLog(`Updating VAD options: ${JSON.stringify(options)}`);
        audioInputManagerRef.current.updateVADOptions(options);
      } else {
        addLog('WARNING: Cannot update VAD settings - AudioInputManager not initialized');
      }
    }
  }), [connectToGemini, disconnectFromGemini, startAudioStreaming,
       stopAudioStreaming, sendUserText, isConnected, isStreamingAudio,
       isAISpeaking, getFullDebugLog, addLog]);

  useEffect(() => {
    addLog(`LGC instance ID ${instanceIdRef.current.description?.slice(-10)} MOUNTED. Profile: ${profileName}, PID: ${profileId}`);
    setIsConnected(false);
    setIsStreamingAudio(false);
    setIsAISpeaking(false);
    logEntriesRef.current = [];

    return () => {
      addLog(`LGC instance ID ${instanceIdRef.current.description?.slice(-10)} UNMOUNTING. Profile: ${profileName}, PID: ${profileId}`);
      disconnectFromGemini();

      if (onLogExport) {
        onLogExport(getFullDebugLog());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, profileId, profileName, disconnectFromGemini, addLog, onLogExport, getFullDebugLog]);

  return null;
});

LiveGeminiClient.displayName = 'LiveGeminiClient';
export default LiveGeminiClient;
