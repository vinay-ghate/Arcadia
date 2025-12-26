# Arcadia Game Development Rules

> **Philosophy**: Create amazing games with freedom and creativity. Use any tools, libraries, or approaches that help you build the best experience!

## 🎯 Core Principles

1. **Quality Over Constraints** - Build great games however you want
2. **Player Experience First** - Focus on fun, engaging gameplay
3. **Consistency Where It Matters** - Follow basic structure and navigation patterns
4. **Freedom to Innovate** - Experiment with any UI library, framework, or technology

---

## 📁 Project Structure

```
games/
└── YourGame/
    ├── index.html      # Main HTML file
    ├── style.css       # Styles (or use UI library)
    ├── script.js       # Game logic
    ├── assets/         # Images, sounds, etc. (optional)
    └── README.md       # Game documentation (optional)
```

---

## 🎨 UI & Styling - Your Choice!

### Option 1: Vanilla CSS (Minimalistic)
Use our `common.css` for a consistent dark theme:
```html
<link rel="stylesheet" href="../../common.css">
<link rel="stylesheet" href="style.css">
```

### Option 2: UI Libraries (Recommended for Complex Games)
Use **any** UI library you prefer:
- **Tailwind CSS** - Utility-first CSS
- **Bootstrap** - Component library
- **Material UI** - Google's design system
- **Chakra UI** - Accessible components
- **Any other library** - Your choice!

**Example with Tailwind:**
```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="../../common.css"> <!-- For theme variables -->
```

### Theme Integration (Optional but Recommended)

If you want to match Arcadia's dark theme:
```css
/* Available CSS variables from common.css */
--bg-color: #1a1a2e
--primary-accent-color: #0f3460
--secondary-accent-color: #e94560
--text-color: #ffffff
--text-muted-color: #a7a9be
```

**But feel free to use your own color scheme!**

---

## 🎮 Required Features

### 1. Navigation (REQUIRED)
Every game **must** have a way to return to the main menu:

**Option A: Use GameManager (Recommended)**
```javascript
// Automatically creates home button
const gameManager = new GameManager({
    gameId: 'your-game',
    title: 'Your Game'
});
```

**Option B: Manual Back Button**
```html
<a href="../../index.html" class="back-button">Back to Menu</a>
```

### 2. Game States (Recommended)
Handle these states for better UX:
- **Ready/Start** - Waiting for player to begin
- **Playing** - Active gameplay
- **Paused** - Game temporarily stopped (optional)
- **Game Over** - End of game with restart option

### 3. Responsive Design (Recommended)
- Test on mobile and desktop
- Ensure touch controls work on mobile
- Adapt layout to different screen sizes

---

## 🛠️ GameManager API (Optional but Helpful)

GameManager provides common functionality automatically:

### Setup
```html
<script src="../../game-manager.js"></script>
```

```javascript
const gameManager = new GameManager({
    gameId: 'your-game',
    title: 'Your Game'
});
```

### Methods
```javascript
// Score management
gameManager.setScore(100);      // Set score to specific value
gameManager.addScore(10);       // Add points to current score
gameManager.resetScore();       // Reset score to 0

// Game over handling
gameManager.showGameOver();     // Show game over overlay
gameManager.hideGameOver();     // Hide game over overlay
```

### Automatic Features
- ✅ Home button (top-left with house icon)
- ✅ Score display (top-right)
- ✅ Game over overlay with restart/home buttons

---

## 💻 Technology Stack - Your Choice!

### JavaScript
- **Vanilla JS** - Simple and fast
- **React** - Component-based UI
- **Vue** - Progressive framework
- **Svelte** - Compiled framework
- **Any framework** - Use what you know!

### Graphics & Animation
- **Canvas API** - 2D graphics
- **WebGL/Three.js** - 3D graphics
- **Phaser** - Game framework
- **PixiJS** - 2D rendering
- **GSAP** - Animation library
- **Any library** - Your choice!

### Build Tools (Optional)
- **Vite** - Fast build tool
- **Webpack** - Module bundler
- **Parcel** - Zero-config bundler
- **None** - Plain HTML/CSS/JS works great!

---

## 📋 Quality Checklist

Before submitting your game:

### Functionality
- [ ] Game loads without errors
- [ ] All controls work as expected
- [ ] Game over conditions work properly
- [ ] Restart functionality works
- [ ] **Home/back button returns to main menu** (REQUIRED)

### User Experience
- [ ] Instructions are clear
- [ ] Controls are intuitive
- [ ] Feedback is immediate and clear
- [ ] Game is fun and engaging

### Technical
- [ ] No console errors
- [ ] Works on mobile devices
- [ ] Reasonable performance
- [ ] Clean, readable code

### SEO (Recommended)
- [ ] Include meta description
- [ ] Add relevant keywords
- [ ] Use semantic HTML

---

## 🎯 Game Categories & Guidelines

### Puzzle Games
- Progressive difficulty
- Clear objectives
- Hint system (optional)
- Undo function (optional)

### Action Games
- Responsive controls
- Visual feedback
- Balanced difficulty curve
- Lives/health indicators

### Strategy Games
- Turn indicators
- Move validation
- Clear game state
- Time limits (if applicable)

### Arcade Games
- High score tracking
- Power-ups with clear visuals
- Lives system
- Combo/streak rewards

---

## 📱 Mobile Considerations

### Touch Controls
- Large touch targets (minimum 44px)
- Gesture support (swipe, tap, hold)
- Prevent accidental zoom during gameplay
- Consider both portrait and landscape

### Performance
- Test on actual mobile devices
- Optimize for battery efficiency
- Minimize external resource loading
- Keep file sizes reasonable

---

## 🚀 Advanced Features (Optional)

### Local Storage
```javascript
// Save high scores
localStorage.setItem('highScore', score);
const highScore = localStorage.getItem('highScore');
```

### Sound Effects
- Use Web Audio API
- Provide mute option
- Keep file sizes small

### Multiplayer
- Local multiplayer (same device)
- Turn-based gameplay
- Clear player indicators

### Achievements
- Track accomplishments
- Visual notifications
- Progress indicators

---

## 📝 Adding Your Game to Arcadia

1. **Create your game** in `games/YourGame/`
2. **Test thoroughly** on different devices
3. **Update `games.json`** to register your game:

```json
{
    "id": "your-game",
    "name": "Your Game",
    "description": "Brief description",
    "category": "puzzle",
    "thumbnail": "games/YourGame/thumbnail.png",
    "path": "games/YourGame/index.html",
    "difficulty": "medium",
    "players": "1"
}
```

4. **Submit a pull request** with a fun description!

---

## 🎨 Design Philosophy

### Minimalistic Approach
- Clean, uncluttered interfaces
- Focus on gameplay, not decoration
- Clear visual hierarchy
- Smooth, purposeful animations

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Readable text sizes and contrast

### Performance
- Fast loading times
- Smooth animations (60fps)
- Efficient resource usage
- Proper memory management

---

## 📚 Examples & References

### Simple Games (Vanilla JS)
- `games/GuessTheNumber/` - Basic structure
- `games/RockPaperScissors/` - Simple logic

### Medium Complexity (Canvas/Libraries)
- `games/Snake/` - Canvas-based game
- `games/Tetris/` - Tailwind CSS + Canvas

### Complex Games (3D/Advanced)
- `games/TowerBlock/` - Three.js 3D game
- `games/ChainReaction/` - Advanced interactions

---

## 🤝 Community & Support

### Need Help?
- Check existing games for examples
- Review `common.css` for available styles
- Open an issue for questions
- Experiment and have fun!

### Contributing
See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- How to submit games
- Code style guidelines
- Community standards
- Pull request process

---

## ⚡ Quick Start Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Game - Arcadia</title>
    
    <!-- Optional: Use common.css for theme -->
    <link rel="stylesheet" href="../../common.css">
    
    <!-- Optional: Use any UI library -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Your styles -->
    <link rel="stylesheet" href="style.css">
    
    <!-- Optional: GameManager for home button & score -->
    <script src="../../game-manager.js"></script>
</head>
<body>
    <!-- Your game content -->
    
    <script src="script.js"></script>
</body>
</html>
```

```javascript
// script.js
// Optional: Initialize GameManager
const gameManager = new GameManager({
    gameId: 'your-game',
    title: 'Your Game'
});

// Your game logic here
class YourGame {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize game
    }
    
    updateScore(score) {
        gameManager.setScore(score);
    }
    
    gameOver() {
        gameManager.showGameOver();
    }
}

// Start game
document.addEventListener('DOMContentLoaded', () => {
    new YourGame();
});
```

---

## 🎯 Remember

- **Quality > Constraints** - Build the best game you can
- **Player Experience First** - Make it fun and engaging
- **Use Any Tools** - Libraries, frameworks, whatever works
- **Be Creative** - Experiment and innovate
- **Have Fun** - Enjoy the process!

**The only hard rule: Include a way to return to the main menu!**

Everything else is a guideline to help you create amazing games. 🎮✨
