# 🧠 Memory Matching Game

A modern, interactive memory matching game built with React, TypeScript, and a full-stack architecture. Test your memory skills by matching pairs of colorful emoji symbols across multiple difficulty levels!

![Game Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=Memory+Matching+Game)

## ✨ Features

### 🎮 Core Gameplay

- **3 Difficulty Levels**: Easy (8×8), Medium (10×10), Hard (12×12)
- **Dynamic Pair Generation**: 32, 50, and 72 unique pairs respectively
- **Real-time Scoring**: Points based on moves and completion time
- **Progress Tracking**: Visual progress bar and live statistics
- **Pause/Resume**: Stop and continue games at any time
- **Reset Functionality**: Restart games instantly

### 🎨 Visual Experience

- **Smooth Animations**: GSAP-powered tile flips and transitions
- **Beautiful UI**: Glassmorphism design with gradient backgrounds
- **Responsive Design**: Optimized for desktop and mobile devices
- **Rich Symbols**: 48+ unique emoji symbols for matching pairs
- **Color-coded Difficulty**: Visual indicators for each level

### 🔊 Audio System

- **Sound Effects**: Hit sounds and success chimes
- **Background Music**: Optional ambient audio
- **Audio Controls**: Mute/unmute functionality

### 🏆 Scoring & Records

- **High Score Tracking**: Persistent leaderboards per difficulty
- **Detailed Statistics**: Moves, time, date, and score tracking
- **Top 10 Records**: Best performances saved locally
- **Smart Scoring**: `10000 - (moves × 50) - (time × 10)`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or use Neon for serverless)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd memory-matching-game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file in root directory
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Set up the database**

   ```bash
   npm run db:push
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run check        # TypeScript type checking

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database
```

## 🏗️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Zustand** - Lightweight state management
- **GSAP** - Professional animations
- **Lucide React** - Beautiful icons

### Backend

- **Express.js** - Node.js web framework
- **TypeScript** - Server-side type safety
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Primary database
- **Neon** - Serverless PostgreSQL hosting

### Development Tools

- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **TSX** - TypeScript execution

## 📁 Project Structure

```
memory-matching-game/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── MemoryGame.tsx    # Main game component
│   │   │   ├── GameTile.tsx      # Individual tile
│   │   │   ├── GameStats.tsx     # Statistics display
│   │   │   ├── HighScoreBoard.tsx # Leaderboard
│   │   │   ├── LevelSelector.tsx  # Difficulty selection
│   │   │   └── ui/               # 40+ UI components
│   │   ├── lib/
│   │   │   ├── stores/           # Zustand state stores
│   │   │   ├── gameUtils.ts      # Game logic
│   │   │   └── utils.ts          # Utilities
│   │   └── App.tsx               # Main app component
│   └── public/            # Static assets
│       ├── sounds/        # Audio files
│       ├── textures/      # Images
│       └── geometries/    # 3D models
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database interface
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
└── Configuration files   # Various configs
```

## 🎯 How to Play

1. **Choose Difficulty**: Select Easy, Medium, or Hard level
2. **Start Game**: Click "Start Game" to begin
3. **Find Pairs**: Click tiles to flip them and find matching symbols
4. **Complete Level**: Match all pairs to finish
5. **Beat Records**: Try to achieve the best time and fewest moves!

### Scoring System

- **Base Score**: 10,000 points
- **Move Penalty**: -50 points per move
- **Time Penalty**: -10 points per second
- **Final Score**: `max(0, 10000 - (moves × 50) - (time × 10))`

## 🎨 Customization

### Adding New Symbols

Edit `client/src/lib/gameUtils.ts`:

```typescript
const SYMBOLS = ["🎯", "🎪", "🎨" /* add your symbols here */];
```

### Modifying Difficulty Levels

Update `client/src/App.tsx`:

```typescript
export const GAME_LEVELS: GameLevel[] = [
  { name: "Easy", size: 8, pairs: 32 },
  // Add or modify levels here
];
```

### Styling Changes

- Global styles: `client/src/index.css`
- Component styles: Use Tailwind classes
- Theme colors: `tailwind.config.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

- **Netlify**: Connect repo and set build command
- **Railway**: Deploy with database included
- **DigitalOcean**: Use App Platform

### Environment Variables

```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Test on multiple devices/browsers
- Maintain responsive design
- Ensure accessibility compliance

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**

```bash
# Check your DATABASE_URL format
DATABASE_URL=postgresql://username:password@hostname:port/database
```

**Build Errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Audio Not Playing**

- Check browser autoplay policies
- Ensure audio files are in `client/public/sounds/`
- Verify file formats (MP3 recommended)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **GSAP** for smooth animations
- **Tailwind CSS** for rapid styling
- **Vite** for fast development experience
- **Drizzle ORM** for type-safe database operations

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/memory-matching-game/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Made with ❤️ and TypeScript**

_Happy matching! 🎯_
