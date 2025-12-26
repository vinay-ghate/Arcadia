# Contributing to Arcadia Games 🎮

Welcome to Arcadia! We're excited that you want to contribute to our collection of browser-based games. This is a "vibe coding" project - we prioritize fun, creativity, and good vibes over rigid processes.

## 🌟 What is Vibe Coding?

Vibe coding is about:
- **Having fun** while creating awesome games
- **Experimenting** with new ideas and technologies
- **Learning** from each other in a supportive environment
- **Creating** games that bring joy to players
- **Keeping it simple** - no over-engineering or complex processes

## 🎯 How to Contribute

### 1. Adding a New Game

Each game should follow our established structure:

```
YourGameName/
├── index.html      # Main game file
├── script.js       # Game logic
├── style.css       # Game-specific styles
└── README.md       # Game rules and info (optional)
```

### 2. Game Requirements

**See [docs/RULE.md](docs/RULE.md) for complete development guidelines.**

**Core Requirements:**
- **Navigation**: Must have a way to return to main menu (use GameManager or manual back button)
- **Responsive**: Should work on desktop and mobile devices
- **Quality**: No console errors, smooth performance

**Flexible Choices:**
- **UI Libraries**: Use any library you want (Tailwind, Bootstrap, Material UI, or vanilla CSS)
- **Frameworks**: React, Vue, Svelte, or plain JavaScript - your choice!
- **Styling**: Match Arcadia theme or create your own unique style
- **Tools**: Use build tools or keep it simple with plain HTML/CSS/JS

**Recommended (but optional):**
- Use `common.css` for consistent dark theme
- Use `GameManager` for automatic home button and score display
- Follow accessibility best practices

### 3. Using GameManager (Recommended)

GameManager provides automatic home button, score display, and game over overlay:

```html
<script src="../../game-manager.js"></script>
```

```javascript
const gameManager = new GameManager({
    gameId: 'your-game',
    title: 'Your Game'
});

// Use these methods:
gameManager.setScore(100);
gameManager.showGameOver();
```

**See [docs/RULE.md](docs/RULE.md) for complete API documentation.**

### 4. Styling - Your Choice!

**Option A: Use Arcadia Theme (Recommended)**
```html
<link rel="stylesheet" href="../../common.css">
```

**Option B: Use Any UI Library**
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Material UI, Chakra UI, or any other library! -->
```

**See [docs/RULE.md](docs/RULE.md) for theming guidelines and examples.**

## 🚀 Getting Started

1. **Fork the repository**
2. **Create a new branch** for your game: `git checkout -b add-awesome-game`
3. **Create your game folder** following the structure above
4. **Include common.css** in your HTML: `<link rel="stylesheet" href="../common.css">`
5. **Test your game** on different devices and browsers
6. **Update games.json** to include your game in the main menu
7. **Submit a pull request** with a fun description!

## 📝 Code Style

We keep it relaxed but consistent:

- **HTML**: Use semantic elements, proper indentation
- **CSS**: Use our CSS variables, mobile-first approach
- **JavaScript**: Modern ES6+, clear variable names, comments for complex logic
- **Files**: Use kebab-case for folders, camelCase for JavaScript

## 🎮 Game Ideas

Need inspiration? Here are some ideas:
- Classic arcade games (Pac-Man, Frogger, Asteroids)
- Puzzle games (Sudoku, Match-3, Word games)
- Strategy games (Tower Defense, Chess variants)
- Creative games (Drawing, Music creation)
- Experimental games (Physics simulations, Art generators)

## 🐛 Bug Reports

Found a bug? No worries! Open an issue with:
- **Game name** where the bug occurs
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Browser and device** info
- **Screenshots** if helpful

## 💡 Feature Requests

Have a cool idea? We'd love to hear it! Open an issue with:
- **Clear description** of the feature
- **Why it would be awesome** for players
- **Any implementation ideas** you have

## 🎨 Design Guidelines

- **Keep it fun**: Games should be enjoyable and engaging
- **Visual consistency**: Follow our dark theme with accent colors
- **Smooth animations**: Use CSS transitions for better UX
- **Clear feedback**: Players should understand what's happening
- **Progressive difficulty**: Start easy, get challenging

## 🤝 Community Guidelines

- **Be kind and respectful** to all contributors
- **Help newcomers** learn and improve
- **Share knowledge** and cool techniques
- **Celebrate creativity** and unique approaches
- **Have fun!** This is about enjoying the process

## 📚 Resources

- **[docs/RULE.md](docs/RULE.md)** - Complete game development guidelines
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [CSS-Tricks](https://css-tricks.com/) - CSS tips and techniques
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [Game Development Resources](https://github.com/ellisonleao/magictools) - Tools and libraries

## 🏆 Recognition

All contributors are celebrated! Your games will be featured in Arcadia with proper attribution. We believe in giving credit where credit is due.

## 📞 Questions?

- Open an issue for technical questions
- Check existing games for examples
- Don't be afraid to experiment!

---

**Remember**: This is vibe coding! Focus on learning, having fun, and creating something awesome. Perfect code is less important than creative, working games that people enjoy playing.

Happy coding! 🎮✨