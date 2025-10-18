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

- **Theme Consistency**: Use our common CSS variables and components
- **Back Button**: Always include a way to return to the main menu
- **Responsive Design**: Games should work on both desktop and mobile
- **Performance**: Keep it lightweight and fast
- **Accessibility**: Consider users with different abilities

### 3. Using Common Components

We provide `common.css` with reusable components:

```html
<!-- Back button -->
<a href="../" class="back-button">Back to Menu</a>

<!-- Score display -->
<div class="score-display">
    <div class="label">Score</div>
    <div class="value">0</div>
</div>

<!-- Game buttons -->
<button class="game-button">Start Game</button>

<!-- Game over overlay -->
<div class="game-over-overlay">
    <h2>Game Over!</h2>
    <!-- content -->
</div>
```

### 4. CSS Variables

Use our theme variables for consistency:

```css
:root {
    --bg-color: #1a1a2e;
    --primary-accent-color: #0f3460;
    --secondary-accent-color: #e94560;
    --text-color: #ffffff;
    --text-muted-color: #a7a9be;
    --border-radius: 16px;
    /* ... more variables in common.css */
}
```

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