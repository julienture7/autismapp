# WonderChat - AI Voice Chat for Children with Autism

WonderChat is an AI voice chat application designed to help children with autism and other communication challenges practice and improve their social skills in a supportive, adaptive environment. The application uses Gemini API's Live features to provide real-time voice conversations.

## Features

- **Voice Chat**: Real-time voice conversations with an AI tutor using WebSockets
- **Text Chat**: Text-based communication for children who prefer typing
- **Multiple Profiles**: Create and manage profiles for different children
- **Progress Tracking**: Monitor improvement in communication skills
- **Custom AI Persona**: The AI adapts its communication style based on each child's specific needs

## Technology Stack

- **Frontend**: Next.js 15 with React 18, TypeScript, and Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: Google Gemini API's Live WebSocket feature
- **Voice Processing**: Web Audio API

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Google Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/autismapp.git
   cd autismapp
   ```

2. Install dependencies:
   ```
   bun install
   ```
   or
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (or create a new `.env` file)
   - Add your Google Gemini API key to the `.env` file:
     ```
     GOOGLE_GEMINI_API_KEY="your-api-key-here"
     ```

4. Set up the database:
   ```
   bunx prisma migrate dev
   bunx prisma db seed
   ```
   or
   ```
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the development server:
   ```
   bun run dev
   ```
   or
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Demo Account

You can use the following demo account to test the application:

- Email: `demo@example.com`
- Password: `password123`

## Using the Voice Chat

1. Log in to your account
2. Go to the Dashboard
3. Select a profile or create a new one
4. Click on "Start Chat" to begin a new session
5. Click the "Connect" button to establish a WebSocket connection
6. Click the "Start Listening" button to begin recording your voice
7. Speak naturally - the AI will respond in real-time
8. Use the text input option if you prefer typing

## Troubleshooting

### WebSocket Connection Issues

If you encounter issues connecting to the Gemini API WebSocket:

1. Ensure your API key is correctly set in the `.env` file
2. Check if you have reached your API usage limits
3. Try refreshing the page and reconnecting
4. Check browser console for detailed error messages

### Voice Input Issues

If voice input is not working:

1. Make sure you've granted the browser permission to use your microphone
2. Check if your microphone is properly connected and functioning
3. Try using a different browser (Chrome is recommended)
4. Ensure you're in a quiet environment with minimal background noise

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Google Gemini API for providing the AI capabilities
- Next.js team for the excellent framework
- All contributors and supporters of this project
