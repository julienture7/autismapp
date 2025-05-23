// src/lib/audio-input-manager.ts
import { EventEmitter } from 'eventemitter3';

const INPUT_AUDIO_SAMPLE_RATE = 16000; // Standard for many speech APIs

function pcm16ArrayBufferToBase64(pcm16Buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(pcm16Buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export interface AudioInputManagerEventTypes {
  data: (base64Audio: string) => void;
  rawData: (pcm16Buffer: ArrayBuffer) => void; // New event for raw PCM data
  activityStart: () => void; // New event for VAD activity start
  activityEnd: () => void; // New event for VAD activity end
  error: (errorMessage: string) => void;
  status: (statusMessage: string) => void; // For logging/status updates from the manager
  activeStateChange: (isActive: boolean) => void; // To inform parent about active state
}

export interface VADOptions {
  enabled: boolean;
  silenceThreshold: number; // Audio level below which is considered silence (0.0 to 1.0)
  silenceDurationMs: number; // Duration of silence to trigger end of speech
  minSpeechDurationMs: number; // Minimum duration of speech to consider valid
}

export class AudioInputManager extends EventEmitter<AudioInputManagerEventTypes> {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private scriptProcessorNode: ScriptProcessorNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  private _isActive = false; // Internal state
  private instanceLogPrefix: string;

  // VAD-related properties
  private vadOptions: VADOptions = {
    enabled: true,
    silenceThreshold: 0.01, // Default threshold
    silenceDurationMs: 1000, // Default 1 second of silence to end activity
    minSpeechDurationMs: 300, // Minimum duration of speech to consider it valid
  };
  private isSpeaking = false;
  private silenceStartTime = 0;
  private speechStartTime = 0;
  private vadCheckInterval: number | null = null;
  private vadAnalysisData = new Uint8Array(128); // For frequency analysis

  constructor(private logSource: string = "AudioInputMgr", vadOptions?: Partial<VADOptions>) {
    super();
    this.instanceLogPrefix = `[${logSource}-${Date.now().toString().slice(-5)}]`;
    if (vadOptions) {
      this.vadOptions = { ...this.vadOptions, ...vadOptions };
    }
    this.log(`Instance created. VAD ${this.vadOptions.enabled ? 'enabled' : 'disabled'}.`);
  }

  private log(message: string) {
    const fullMessage = `${this.instanceLogPrefix} ${message}`;
    console.log(fullMessage);
    this.emit('status', fullMessage); // Emit internal logs as status
  }

  public getIsActive(): boolean {
    return this._isActive;
  }

  private setActiveState(isActive: boolean) {
    if (this._isActive !== isActive) {
      this._isActive = isActive;
      this.emit('activeStateChange', this._isActive);
      this.log(`Active state changed to: ${this._isActive}`);
    }
  }

  private setupVAD() {
    if (!this.vadOptions.enabled || !this.audioContext || !this._isActive) {
      return;
    }

    this.log('Setting up Voice Activity Detection...');

    // Create analyser node for monitoring audio levels
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.5;

    // Connect mediaStreamSource to analyser
    if (this.mediaStreamSource) {
      this.mediaStreamSource.connect(this.analyserNode);
      this.log('Connected MediaStreamSource to AnalyserNode for VAD.');
    }

    // Start the VAD monitoring
    this.monitorVAD();
  }

  private monitorVAD() {
    if (!this.vadOptions.enabled || !this._isActive) return;

    this.vadCheckInterval = window.setInterval(() => {
      if (!this._isActive || !this.analyserNode) {
        if (this.vadCheckInterval) {
          clearInterval(this.vadCheckInterval);
          this.vadCheckInterval = null;
        }
        return;
      }

      // Get current audio levels
      this.analyserNode.getByteFrequencyData(this.vadAnalysisData);

      // Calculate average level
      let sum = 0;
      for (let i = 0; i < this.vadAnalysisData.length; i++) {
        sum += this.vadAnalysisData[i];
      }
      const averageLevel = sum / (this.vadAnalysisData.length * 255); // Normalize to 0-1

      const now = Date.now();

      // Check if we're above the threshold (speaking)
      if (averageLevel > this.vadOptions.silenceThreshold) {
        if (!this.isSpeaking) {
          // Speech just started
          this.speechStartTime = now;
          this.isSpeaking = true;
          this.log(`VAD detected speech start, level: ${averageLevel.toFixed(3)}`);
        }
        // Reset silence timer since we detected speech
        this.silenceStartTime = 0;
      } else {
        // Below threshold (silence)
        if (this.isSpeaking) {
          // If this is the beginning of silence
          if (this.silenceStartTime === 0) {
            this.silenceStartTime = now;
            this.log(`VAD detected potential speech end, level: ${averageLevel.toFixed(3)}`);
          } else if (now - this.silenceStartTime > this.vadOptions.silenceDurationMs) {
            // Silence has lasted long enough to be considered end of speech
            const speechDuration = this.silenceStartTime - this.speechStartTime;

            if (speechDuration >= this.vadOptions.minSpeechDurationMs) {
              // Valid speech segment ended
              this.log(`VAD: Speech ended after ${speechDuration}ms, emitting activityEnd`);
              this.emit('activityEnd');
            } else {
              this.log(`VAD: Speech too short (${speechDuration}ms), ignoring`);
            }

            this.isSpeaking = false;
            this.silenceStartTime = 0;
          }
        }
      }

      // If we just started speaking and haven't emitted activity start yet
      if (this.isSpeaking &&
          this.speechStartTime > 0 &&
          now - this.speechStartTime >= this.vadOptions.minSpeechDurationMs) {
        this.log('VAD: Valid speech detected, emitting activityStart');
        this.emit('activityStart');
        // Set speechStartTime to 0 to indicate we've already emitted the start event
        this.speechStartTime = 0;
      }
    }, 100); // Check every 100ms

    this.log('VAD monitoring started');
  }

  async start(): Promise<void> {
    this.log('start() called.');
    if (this._isActive) {
      this.log('Already active. Ignoring start call.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMsg = 'getUserMedia not supported by this browser.';
      this.log(`ERROR: ${errorMsg}`);
      this.emit('error', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      this.log('Attempting to get user media (microphone)...');
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.log('Microphone access granted.');

      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.log('Creating/Re-creating AudioContext for input.');
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: INPUT_AUDIO_SAMPLE_RATE,
        });
        this.log(`Input AudioContext created. State: ${this.audioContext.state}`);
      }

      if (this.audioContext.state === 'suspended') {
        this.log('Input AudioContext is suspended, attempting to resume...');
        await this.audioContext.resume();
        this.log(`Input AudioContext state after resume: ${this.audioContext.state}`);
      }

      if (this.audioContext.state !== 'running') {
        throw new Error(`Input AudioContext is not running. State: ${this.audioContext.state}. User interaction might be required.`);
      }

      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.log('MediaStreamSource created from microphone stream.');

      const bufferSize = 2048; // Approx 128ms at 16kHz
      this.scriptProcessorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
      this.log(`ScriptProcessorNode created with bufferSize: ${bufferSize}.`);

      let hasLoggedFirstChunk = false;
      this.scriptProcessorNode.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!this._isActive) { // Check internal active state
          // If no longer active, but onaudioprocess fires one last time, do nothing.
          return;
        }

        if (!hasLoggedFirstChunk) {
          this.log('ONAUDIOPROCESS: First audio chunk received and processing.');
          hasLoggedFirstChunk = true;
        }

        const inputData = e.inputBuffer.getChannelData(0); // Float32Array
        const pcm16Buffer = new ArrayBuffer(inputData.length * 2);
        const pcm16DataView = new DataView(pcm16Buffer);
        for (let i = 0; i < inputData.length; i++) {
          // Clamp values to [-1, 1] before scaling to Int16 range
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16DataView.setInt16(i * 2, s * 0x7FFF, true); // true for little-endian
        }

        // Emit both the raw PCM buffer and the base64 encoded version
        this.emit('rawData', pcm16Buffer);
        this.emit('data', pcm16ArrayBufferToBase64(pcm16Buffer));
      };
      this.log('onaudioprocess handler assigned to ScriptProcessorNode.');

      this.mediaStreamSource.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.audioContext.destination);
      this.log('MediaStreamSource connected to ScriptProcessorNode and destination.');

      // Setup VAD after everything else is set up
      this.setupVAD();

      this.setActiveState(true);
      this.log('Audio input stream started successfully.');
      // If VAD is disabled, immediately emit activityStart to indicate recording has begun
      if (!this.vadOptions.enabled) {
        this.emit('activityStart');
      }

    } catch (err) {
      const errorMsg = `Error starting audio input: ${err instanceof Error ? err.message : String(err)}`;
      this.log(`ERROR: ${errorMsg}`);
      this.emit('error', errorMsg);
      this.stop(); // Attempt to clean up resources on error
      throw err;
    }
  }

  stop(): void {
    this.log('stop() called.');
    if (!this._isActive && !this.mediaStream && !this.scriptProcessorNode && !this.mediaStreamSource) {
        this.log('Already stopped or not fully initialized. No resources to stop.');
        return;
    }

    // If VAD is enabled and we're still speaking, emit activity end
    if (this.vadOptions.enabled && this.isSpeaking) {
      this.log('VAD: Force ending activity due to stop() call');
      this.emit('activityEnd');
      this.isSpeaking = false;
    } else if (!this.vadOptions.enabled) {
      // If VAD is disabled, emit activityEnd to match the activityStart from start()
      this.emit('activityEnd');
    }

    // Clear VAD interval
    if (this.vadCheckInterval) {
      clearInterval(this.vadCheckInterval);
      this.vadCheckInterval = null;
      this.log('VAD monitoring stopped.');
    }

    this.setActiveState(false); // Set inactive first

    if (this.analyserNode) {
      try { this.analyserNode.disconnect(); } catch(e) { this.log(`Minor error disconnecting AnalyserNode: ${e}`); }
      this.analyserNode = null;
      this.log('AnalyserNode disconnected and nulled.');
    }

    if (this.scriptProcessorNode) {
      this.scriptProcessorNode.onaudioprocess = null; // Remove handler
      try { this.scriptProcessorNode.disconnect(); } catch(e) { this.log(`Minor error disconnecting SPN: ${e}`); }
      this.scriptProcessorNode = null;
      this.log('ScriptProcessorNode disconnected and nulled.');
    }
    if (this.mediaStreamSource) {
      try { this.mediaStreamSource.disconnect(); } catch(e) { this.log(`Minor error disconnecting MSS: ${e}`); }
      this.mediaStreamSource = null;
      this.log('MediaStreamSource disconnected and nulled.');
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
      this.log('MediaStream tracks stopped and nulled.');
    }

    // Reset VAD state
    this.isSpeaking = false;
    this.silenceStartTime = 0;
    this.speechStartTime = 0;

    this.log('Audio input stream processing stopped.');
  }

  // Allow updating VAD options at runtime
  updateVADOptions(options: Partial<VADOptions>): void {
    this.vadOptions = { ...this.vadOptions, ...options };
    this.log(`VAD options updated. Enabled: ${this.vadOptions.enabled}`);

    // If we're active, restart VAD monitoring with new settings
    if (this._isActive && this.vadOptions.enabled) {
      if (this.vadCheckInterval) {
        clearInterval(this.vadCheckInterval);
        this.vadCheckInterval = null;
      }
      this.monitorVAD();
    }
  }

  destroy(): void {
    this.log('destroy() called for full cleanup.');
    this.stop(); // Ensure all active processes are stopped and nodes disconnected

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
        .then(() => this.log('Input AudioContext explicitly destroyed.'))
        .catch(e => this.log(`Error destroying Input AudioContext: ${e}`));
    }
    this.audioContext = null;
    this.removeAllListeners();
    this.log('AudioInputManager destroyed and listeners removed.');
  }
}
