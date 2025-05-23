import React, { useState, useEffect } from 'react';
import { VoiceChat } from './voice-chat';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { getSystemInstructions } from '@/lib/gemini';

interface ChatInterfaceProps {
  profileId: string;
  profileName: string;
  profileType: string;
  sessionId?: string;
  apiKey?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

export function ChatInterface({
  profileId,
  profileName,
  profileType,
  sessionId,
  apiKey = ''
}: ChatInterfaceProps) {
  const [activeTab, setActiveTab] = useState<string>('voice');
  const [systemInstructions, setSystemInstructions] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Generate system instructions based on profile type
  useEffect(() => {
    const instructions = getSystemInstructions(profileType, profileName);
    setSystemInstructions(instructions);
  }, [profileType, profileName]);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi ${profileName}! I'm WonderChat. How are you feeling today?`
      }
    ]);
  }, [profileName]);

  // Handler for new messages from VoiceChat
  const handleMessageReceived = (message: Message | string) => {
    if (typeof message === 'string') {
      // Convert string message to Message object
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: message
      };
      setMessages(prev => [...prev, newMessage]);
    } else {
      // Already a Message object
      setMessages(prev => [...prev, message]);
    }
    // Here we could save messages to the database
    // console.log("Received message:", message);
  };

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <Tabs defaultValue="voice" className="flex flex-col h-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chat with {profileName}</h2>
            <TabsList>
              <TabsTrigger value="voice">Voice Chat</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="voice" className="flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Conversation history */}
              <div className="flex-1 overflow-y-auto mb-4 p-2 bg-muted rounded">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 max-w-[80%] ${
                      message.role === 'user' ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.audioUrl && (
                      <audio
                        src={message.audioUrl}
                        controls
                        className="mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* VoiceChat input area */}
              <VoiceChat
                profileId={profileId}
                profileName={profileName}
                profileType={profileType}
                systemInstructions={systemInstructions}
                onMessageReceived={handleMessageReceived}
                apiKey={apiKey}
              />
            </div>
          </TabsContent>

          <TabsContent value="info">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Name: {profileName}<br />
                  Type: {profileType}<br />
                  Profile ID: {profileId}<br />
                  {sessionId && `Session ID: ${sessionId}`}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">System Instructions</h3>
                <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">
                  {systemInstructions}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Tips for Conversation</h3>
                <ul className="text-sm text-gray-500 mt-1 list-disc pl-5 space-y-1">
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Wait for WonderChat to finish speaking before responding</li>
                  <li>Use the text input if you prefer typing over speaking</li>
                  <li>Press the "Connect" button to start a new conversation</li>
                  <li>You can press "Disconnect" at any time to end the session</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ChatInterface;
