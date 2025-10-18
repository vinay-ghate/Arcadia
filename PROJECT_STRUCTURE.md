# Arcadia Games - Project Structure 🎮

This document outlines the structure and organization of the Arcadia Games project.

## 📁 Root Directory Structure

```
Arcadia/
├── 📄 index.html              # Main landing page
├── 📄 style.css               # Main theme styles
├── 📄 script.js               # Main page functionality
├── 📄 games.json              # Game metadata and configuration
├── 📄 common.css              # Shared UI components and styles
├── 📄 README.md               # Project overview
├── 📄 CONTRIBUTING.md         # Contribution guidelines
├── 📄 GAME_RULES.md           # Game development rules
├── 📄 PROJECT_STRUCTURE.md    # This file
├── 🎮 2048/                   # 2048 puzzle game
├── 🎮 ChainReaction/          # Chain Reaction strategy game
├── 🎮 Jigsaw/                 # Jigsaw puzzle game
├── 🎮 Schultetable/           # Schulte Table brain training
├── 🎮 Snake/                  # Classic Snake game
├── 🎮 Tetris/                 # Classic Tetris game
├── 🎮 TowerBlock/             # 3D Tower Block stacking game
└── 🎮 TowerHero/              # Tower Hero game
```

## 🎮 Individual Game Structure

Each game follows a consistent structure:

```
GameName/
├── 📄 index.html              # Main game HTML file
├── 📄 script.js               # Game logic and functionality
├── 📄 style.css               # Game-specific styles
├── 📄 README.md               # Game rules and documentation (optional)
└── 📁 assets/                 # Game assets (images, sounds, etc.) (optional)
```

## 🎨 Theme System

### Core Files
- **`common.css`**: Shared UI components, CSS variables, and common styles
- **`style.css`**: Main landing page styles and theme definitions

### CSS Variables (Theme Colors)
```css
:root {
    --bg-color: #1a1a2e;              /* Dark background */
    --primary-accent-color: #0f3460;   /* Blue accent */
    --secondary-accent-color: #e94560; /* Red accent */
    --text-color: #ffffff;             /* White text */
    --text-muted-color: #a7a9be;       /* Muted text */
    --border-radius: 16px;             /* Consistent border radius */
}
```

### Common Components
- **Back Button**: Consistent navigation back to main menu
- **Score Display**: Standardized score presentation
- **Game Buttons**: Uniform button styling
- **Overlays**: Game over, start screen, and instruction overlays
- **Footer**: Attribution and branding

## 📊 Game Configuration

### games.json Structure
```json
{
    "id": 1,
    "title": "Game Name",
    "description": "Brief game description",
    "url": "GameFolder/",
    "imageUrl": "https://example.com/image.jpg",
    "category": "Puzzle|Action|Strategy",
    "featured": true
}
```

### Categories
- **Puzzle**: Logic and problem-solving games
- **Action**: Fast-paced, reflex-based games  
- **Strategy**: Planning and tactical games

## 🔧 Technical Stack

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Styling with custom properties and modern features
- **Vanilla JavaScript**: Game logic and interactions
- **Web APIs**: Canvas, Audio, Local Storage, etc.

### External Libraries (Game-Specific)
- **Three.js**: 3D graphics (TowerBlock)
- **GSAP**: Animations (TowerBlock)
- **Tailwind CSS**: Utility-first styling (Snake, 2048)

### Browser Support
- Modern browsers with ES6+ support
- Mobile and desktop responsive design
- Touch and keyboard input support

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Considerations
- Touch-friendly controls
- Optimized performance
- Proper viewport handling
- Gesture support where appropriate

## 🎯 Development Workflow

### Adding a New Game
1. Create game folder following naming convention
2. Implement required files (index.html, script.js, style.css)
3. Include common.css for theme consistency
4. Add back button and score display
5. Update games.json with game metadata
6. Test on multiple devices and browsers
7. Create README.md with game rules (optional)

### Code Standards
- **HTML**: Semantic elements, proper indentation
- **CSS**: Use CSS variables, mobile-first approach
- **JavaScript**: Modern ES6+, clear naming, comments
- **Files**: kebab-case for folders, camelCase for JS

## 🚀 Performance Guidelines

### Optimization Targets
- **Load Time**: < 3 seconds on 3G
- **Frame Rate**: 60fps on modern devices
- **Bundle Size**: Keep individual games < 1MB
- **Memory Usage**: Efficient resource management

### Best Practices
- Optimize images and assets
- Minimize external dependencies
- Use efficient algorithms
- Clean up resources properly
- Test on various devices

## 🔄 Version Control

### Branch Strategy
- **main**: Production-ready code
- **feature/game-name**: New game development
- **fix/issue-description**: Bug fixes
- **docs/update-description**: Documentation updates

### Commit Convention
- `feat: add new tower block game`
- `fix: resolve mobile touch issues in snake`
- `docs: update contributing guidelines`
- `style: improve button hover effects`

## 📚 Documentation

### Required Documentation
- **README.md**: Project overview and setup
- **CONTRIBUTING.md**: How to contribute
- **GAME_RULES.md**: Development guidelines
- **PROJECT_STRUCTURE.md**: This file

### Optional Game Documentation
- Individual game README files
- API documentation for complex games
- Performance optimization notes

## 🎮 Game Categories Explained

### Puzzle Games
Focus on problem-solving, logic, and mental challenges
- Examples: 2048, Tetris, Jigsaw, Schulte Table
- Features: Progressive difficulty, hint systems, undo functionality

### Action Games  
Emphasize quick reflexes, timing, and hand-eye coordination
- Examples: Snake, Tower Block
- Features: Real-time gameplay, score systems, increasing speed

### Strategy Games
Require planning, tactical thinking, and decision-making
- Examples: Chain Reaction
- Features: Turn-based mechanics, multiple players, strategic depth

## 🔮 Future Enhancements

### Planned Features
- Sound effects and music system
- Achievement system
- Local high score persistence
- Multiplayer capabilities
- Progressive Web App (PWA) support
- Game analytics and metrics

### Technical Improvements
- Build system for optimization
- Automated testing framework
- Performance monitoring
- Accessibility enhancements
- Internationalization support

---

**This structure ensures consistency, maintainability, and scalability as the Arcadia Games collection grows!** 🎮✨