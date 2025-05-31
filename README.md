# Space Invaders - Futuristic Edition 🚀

A modern, futuristic take on the classic Space Invaders arcade game built with Next.js, TypeScript, and HTML5 Canvas.

## 🎮 Play Now

Visit the live demo: [Deploy on Vercel](#deployment)

## 🌟 Features

- **Classic Gameplay**: Authentic Space Invaders experience with modern enhancements
- **Futuristic Design**: Neon colors, glow effects, and sleek visuals
- **Complete Game Mechanics**:
  - Player movement and shooting
  - Multiple invader types (Squid, Crab, Octopus) with different point values
  - UFO bonus targets
  - Destructible bunkers for protection
  - Progressive difficulty with level advancement
  - Lives and scoring system
  - High score persistence
- **Responsive Controls**: Smooth keyboard controls with arrow keys and spacebar
- **Game States**: Menu, playing, paused, game over, and level complete screens

## 🎯 How to Play

- **Arrow Keys (← →)**: Move your spaceship left and right
- **Spacebar**: Fire bullets at invaders
- **P**: Pause/Resume the game
- **R**: Restart after game over
- **Enter**: Start game from menu

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MyTH-AI-JP/claude-code-test.git
cd claude-code-test
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📦 Deployment

### Deploy to Vercel

The easiest way to deploy this Space Invaders game is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MyTH-AI-JP/claude-code-test)

Or deploy manually:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Environment Variables

No environment variables are required for this game.

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: HTML5 Canvas
- **Deployment**: Vercel

## 📁 Project Structure

```
claude-code-test/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # App layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── SpaceInvaders.tsx # Main game component
│   ├── constants/
│   │   └── game.ts          # Game configuration
│   ├── types/
│   │   └── game.ts          # TypeScript interfaces
│   ├── hooks/
│   │   └── useGameLoop.ts   # Game loop hook
│   └── utils/
│       └── collision.ts     # Collision detection
├── public/                  # Static assets
├── package.json
└── README.md
```

## 🎮 Game Details

### Scoring
- **Octopus Invaders**: 10 points
- **Crab Invaders**: 20 points
- **Squid Invaders**: 30 points
- **UFO**: 50-300 points (random)

### Game Mechanics
- Invaders move horizontally and drop down when reaching screen edges
- Speed increases with each level
- Player has 3 lives
- Bunkers provide destructible cover
- UFO appears randomly for bonus points

## 🤝 Contributing

Feel free to open issues or submit pull requests for improvements!

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

Created with ❤️ by MyTH-AI-JP using Claude Code

---

Built with [Next.js](https://nextjs.org/) and deployed on [Vercel](https://vercel.com/)