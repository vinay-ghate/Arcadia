# Game Rules & Guidelines 🎮

This document outlines the rules and guidelines for all games in the Arcadia collection.

## 🎯 Universal Game Rules

### 1. Navigation
- **Back Button**: Every game must have a clearly visible back button to return to the main menu
- **Consistent Placement**: Back button should be in the top-left corner
- **Always Accessible**: Players should never be "trapped" in a game

### 2. Scoring System
- **Clear Display**: Score should be prominently displayed during gameplay
- **Final Score**: Show final score on game over screen
- **Local Storage**: Consider saving high scores locally (optional)

### 3. Game States
Every game should handle these states:
- **Loading**: Initial game setup
- **Ready/Start**: Waiting for player to begin
- **Playing**: Active gameplay
- **Paused**: Game temporarily stopped (if applicable)
- **Game Over**: End of game with restart option

### 4. Controls
- **Keyboard Support**: Implement keyboard controls where appropriate
- **Touch Support**: Ensure mobile/touch devices work properly
- **Clear Instructions**: Display control instructions to players
- **Accessibility**: Consider users with different abilities

### 5. Performance
- **Smooth Gameplay**: Maintain consistent frame rates
- **Responsive Design**: Work on various screen sizes
- **Fast Loading**: Minimize initial load time
- **Memory Management**: Clean up resources properly

## 🎨 Visual Guidelines

### 1. Theme Consistency
- Use the common CSS variables for colors
- Follow the dark theme aesthetic
- Maintain consistent typography
- Use provided UI components

### 2. Color Scheme
```css
Primary Background: #1a1a2e
Primary Accent: #0f3460
Secondary Accent: #e94560
Text Color: #ffffff
Muted Text: #a7a9be
```

### 3. Typography
- **Primary Font**: Poppins (weights: 400, 600, 700)
- **Fallback**: Sans-serif system fonts
- **Hierarchy**: Use font weights and sizes to create clear hierarchy

### 4. Animations
- **Smooth Transitions**: Use CSS transitions for state changes
- **Feedback**: Provide visual feedback for user interactions
- **Performance**: Keep animations lightweight and smooth

## 🎮 Specific Game Categories

### Puzzle Games
- **Progressive Difficulty**: Start easy, gradually increase challenge
- **Hint System**: Consider providing hints for stuck players
- **Undo Function**: Allow players to undo moves when possible
- **Clear Objectives**: Make goals obvious to players

### Action Games
- **Responsive Controls**: Ensure controls feel immediate and precise
- **Visual Feedback**: Clear indication of hits, misses, power-ups
- **Difficulty Curve**: Balanced progression of challenge
- **Lives/Health**: Clear indication of player status

### Strategy Games
- **Turn Indicators**: Clear whose turn it is (if applicable)
- **Move Validation**: Prevent invalid moves with clear feedback
- **Game State**: Always show current game status
- **Time Limits**: If timed, show remaining time clearly

### Arcade Games
- **High Score**: Track and display high scores
- **Power-ups**: Clear visual indication of special items
- **Lives System**: Show remaining lives/attempts
- **Combo System**: Reward consecutive successes

## 📱 Mobile Considerations

### 1. Touch Controls
- **Large Touch Targets**: Minimum 44px for touch elements
- **Gesture Support**: Implement swipe, tap, and hold where appropriate
- **Prevent Zoom**: Disable pinch-to-zoom during gameplay
- **Orientation**: Consider both portrait and landscape modes

### 2. Performance
- **Optimize for Mobile**: Test on actual mobile devices
- **Battery Efficiency**: Avoid unnecessary animations or calculations
- **Network Usage**: Minimize external resource loading

### 3. Screen Sizes
- **Responsive Layout**: Adapt to different screen sizes
- **Safe Areas**: Consider device notches and safe areas
- **Readable Text**: Ensure text is legible on small screens

## 🔧 Technical Requirements

### 1. File Structure
```
GameName/
├── index.html      # Main game file
├── script.js       # Game logic
├── style.css       # Game-specific styles
└── README.md       # Game documentation (optional)
```

### 2. HTML Requirements
- **DOCTYPE**: Always include `<!DOCTYPE html>`
- **Meta Tags**: Include viewport and charset meta tags
- **Semantic HTML**: Use appropriate HTML5 semantic elements
- **Accessibility**: Include alt text, ARIA labels where needed

### 3. CSS Requirements
- **Common Styles**: Include `../common.css`
- **CSS Variables**: Use provided CSS custom properties
- **Mobile First**: Write CSS with mobile-first approach
- **Vendor Prefixes**: Include when necessary for compatibility

### 4. JavaScript Requirements
- **Modern ES6+**: Use modern JavaScript features
- **Error Handling**: Implement proper error handling
- **Performance**: Optimize for smooth gameplay
- **Clean Code**: Use clear variable names and comments

## 🎯 Game Quality Checklist

Before submitting a game, ensure:

### Functionality
- [ ] Game loads without errors
- [ ] All controls work as expected
- [ ] Game over conditions work properly
- [ ] Restart functionality works
- [ ] Back button returns to main menu

### Visual Design
- [ ] Follows Arcadia theme
- [ ] Responsive on different screen sizes
- [ ] Smooth animations and transitions
- [ ] Clear visual hierarchy
- [ ] Consistent with other games

### User Experience
- [ ] Instructions are clear
- [ ] Controls are intuitive
- [ ] Feedback is immediate and clear
- [ ] Game is fun and engaging
- [ ] Difficulty progression is balanced

### Technical
- [ ] No console errors
- [ ] Good performance on mobile
- [ ] Proper file structure
- [ ] Clean, commented code
- [ ] Follows coding standards

## 🚀 Advanced Features (Optional)

### 1. Local Storage
- Save high scores
- Remember user preferences
- Store game progress

### 2. Sound Effects
- Use Web Audio API
- Provide mute option
- Keep file sizes small

### 3. Multiplayer
- Local multiplayer (same device)
- Turn-based gameplay
- Clear player indicators

### 4. Achievements
- Track player accomplishments
- Visual achievement notifications
- Progress indicators

## 📊 Analytics & Feedback

### 1. User Feedback
- Consider adding feedback mechanisms
- Track common user issues
- Iterate based on player behavior

### 2. Performance Monitoring
- Monitor frame rates
- Track loading times
- Identify bottlenecks

---

**Remember**: These are guidelines to ensure consistency and quality across all Arcadia games. The goal is to create an amazing gaming experience while maintaining the fun, creative spirit of vibe coding! 🎮✨