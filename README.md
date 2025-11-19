# Aktro Dashboard & Bot - Streamer Management Platform

A beautiful, feature-rich dashboard for managing streamers with full bot integration. Features a dynamic purple-toned background, unified controls, and real-time notifications.

## ✨ Features

### 🌟 Welcome Screen
- Elegant welcome screen with animated purple gradient background
- Smooth entry animation with sound effects
- Eye-catching title with glow effects

### 🎨 Dynamic Purple Background
- Continuously shifting purple gradient (dark purple → violet → lavender)
- Animated particle effects for depth
- Gamer-friendly aesthetic that changes throughout the day
- Smooth 15-second gradient animation cycle

### 🕹️ Unified Dashboard Controls

All dashboard features match bot functionality for consistency:

1. **💰 Credit Adjustment**
   - Add or deduct streamer credits
   - Easy-to-use modal interface
   - Instant feedback with notifications

2. **📅 Schedule Management**
   - Set streaming schedules
   - Manage date, time, and duration
   - Synchronized with bot

3. **🔔 Send Alerts**
   - Send notifications to streamers
   - Multiple alert types (announcements, reminders, updates)
   - Target all streamers or specific individuals

4. **📊 Performance Tracking**
   - View top performers
   - Monitor streaming hours
   - Track viewer statistics
   - Overall platform metrics

5. **🤖 Bot Integration**
   - Real-time bot status display
   - Shows synced features
   - Force sync capability
   - Connected/Online status indicator

6. **⚙️ Settings**
   - Toggle sound effects
   - Enable/disable notifications
   - Adjust theme intensity
   - Persistent preferences

### 🔔 Notification System
- Toast-style notifications in top-right corner
- Different types: success, error, info, warning
- Auto-dismiss after 5 seconds
- Slide-in animation
- Notification badge counter in header

### 🎵 Sound Effects
- Light button click sounds using Web Audio API
- Success confirmation sounds (musical)
- Notification alert sounds
- Toggle on/off in settings
- Non-intrusive and pleasant

### 📊 Quick Stats Dashboard
- Active streamers count
- Currently live streamers
- Total credits in system
- Pending alerts

### 🎨 Additional Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Glassmorphism UI**: Backdrop blur effects for modern look
- **Smooth Animations**: Fade, slide, scale, and pulse effects
- **Custom Scrollbar**: Purple-themed scrollbar
- **Footer**: Help, documentation, and support links

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AKTROLEK/dashbord-And-bot-Aktro..git
cd dashbord-And-bot-Aktro..
```

2. Open `index.html` in your web browser, or serve it with a local web server:
```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (with http-server)
npx http-server -p 8080
```

3. Navigate to `http://localhost:8080` in your browser

### File Structure

```
dashbord-And-bot-Aktro../
├── index.html       # Main HTML structure
├── styles.css       # All styling and animations
├── script.js        # JavaScript functionality
├── README.md        # Documentation
└── LICENSE          # License file
```

## 💻 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Advanced animations, gradients, and glassmorphism
- **Vanilla JavaScript**: No frameworks required
- **Web Audio API**: For sound effects

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Modern browsers with ES6 support required.

### Key CSS Features
- CSS Grid for responsive layouts
- Keyframe animations for smooth transitions
- Custom properties (CSS variables) for theming
- Backdrop filters for glassmorphism
- Gradient animations

### Key JavaScript Features
- Class-based architecture
- Sound Manager for audio
- Notification Manager for alerts
- Modal Manager for popups
- Event-driven interactions

## 🎮 Usage

### Navigation
1. Click "Enter Dashboard" on the welcome screen
2. Explore the six main control cards
3. Click any button to open the corresponding modal
4. Fill in forms and submit actions
5. Receive instant feedback via notifications

### Bot Sync
- All dashboard actions are designed to sync with the bot
- Bot status shown in Bot Integration modal
- Force sync available if needed
- Features marked with checkmarks are synced

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --purple-1: #6a0dad;
    --purple-2: #8b5cf6;
    --purple-3: #a855f7;
    --purple-4: #c084fc;
    --purple-5: #d8b4fe;
}
```

### Animations
Adjust animation speeds in `styles.css`:
```css
animation: gradientShift 15s ease infinite;  /* Background gradient */
animation: pulse 2s ease-in-out infinite;     /* Button pulse */
```

### Sound Effects
Toggle sounds in Settings modal or modify in `script.js`:
```javascript
soundManager.enabled = true/false;
```

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: Full grid layout with 3 columns
- **Tablet**: 2-column layout
- **Mobile**: Single column, stacked layout

## 🔒 Security Notes

- This is a frontend-only demo
- No actual backend connections
- Bot integration is placeholder
- Implement proper authentication before production use
- Add API endpoints for real functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**AKTROLEK**

## 🙏 Acknowledgments

- Design inspired by modern gaming dashboards
- Purple color scheme for gamer aesthetic
- Built with ❤️ for the streaming community

---

© 2025 Aktro Dashboard - All Rights Reserved