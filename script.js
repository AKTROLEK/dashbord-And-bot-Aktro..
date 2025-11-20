// Sound Effects - Using Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Generate a button click sound
    playClick() {
        if (!this.enabled) return;
        this.init();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Generate a notification sound
    playNotification() {
        if (!this.enabled) return;
        this.init();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Generate a success sound
    playSuccess() {
        if (!this.enabled) return;
        this.init();

        [523.25, 659.25, 783.99].forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = this.audioContext.currentTime + (index * 0.1);
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Notification System
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.badge = document.getElementById('notificationBadge');
        this.count = 0;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;

        this.container.appendChild(notification);
        this.count++;
        this.updateBadge();

        soundManager.playNotification();

        // Auto remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
                this.count--;
                this.updateBadge();
            }, 300);
        }, duration);
    }

    updateBadge() {
        this.badge.textContent = this.count;
        if (this.count > 0) {
            this.badge.style.background = 'var(--purple-3)';
        } else {
            this.badge.style.background = 'var(--purple-2)';
        }
    }
}

// Modal Manager
class ModalManager {
    constructor() {
        this.modal = document.getElementById('actionModal');
        this.modalBody = document.getElementById('modalBody');
        this.closeBtn = this.modal.querySelector('.modal-close');

        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open(content) {
        this.modalBody.innerHTML = content;
        this.modal.classList.remove('hidden');
        soundManager.playClick();
    }

    close() {
        this.modal.classList.add('hidden');
        soundManager.playClick();
    }
}

// Initialize managers
const soundManager = new SoundManager();
const notificationManager = new NotificationManager();
const modalManager = new ModalManager();

// Welcome Screen Handler
document.addEventListener('DOMContentLoaded', () => {
    const enterButton = document.getElementById('enterButton');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainDashboard = document.getElementById('mainDashboard');

    enterButton.addEventListener('click', () => {
        soundManager.playSuccess();
        welcomeScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
        
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            mainDashboard.classList.remove('hidden');
            
            // Show welcome notification
            notificationManager.show('Welcome to Aktro Dashboard! 🎮', 'success');
            
            // Show a quick tip after 2 seconds
            setTimeout(() => {
                notificationManager.show('Tip: All buttons sync with the bot features', 'info');
            }, 2000);
        }, 500);
    });

    // Add fadeOut animation to CSS dynamically if not present
    if (!document.querySelector('style[data-fade-out]')) {
        const style = document.createElement('style');
        style.setAttribute('data-fade-out', 'true');
        style.textContent = `
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: scale(0.95);
                }
            }
            @keyframes slideOutRight {
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Control Button Handlers
document.addEventListener('DOMContentLoaded', () => {
    const controlButtons = document.querySelectorAll('.control-button');

    controlButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            soundManager.playClick();
            const action = button.getAttribute('data-action');
            handleAction(action);
        });
    });
});

// Action Handler
function handleAction(action) {
    const actionHandlers = {
        credits: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">💰 Credit Adjustment</h2>
                <p style="margin-bottom: 1.5rem;">Add or deduct credits from streamers</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Streamer Name:</label>
                    <input type="text" id="streamerName" placeholder="Enter streamer name" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Credits Amount:</label>
                    <input type="number" id="creditAmount" placeholder="Enter amount (use - for deduction)" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <button onclick="submitCredits()" class="control-button" style="margin-top: 1rem;">
                    Submit
                </button>
            `;
            modalManager.open(content);
        },

        schedule: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">📅 Schedule Management</h2>
                <p style="margin-bottom: 1.5rem;">Set or update streaming schedules</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Streamer Name:</label>
                    <input type="text" id="scheduleStreamer" placeholder="Enter streamer name" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Schedule Date & Time:</label>
                    <input type="datetime-local" id="scheduleTime" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Duration (hours):</label>
                    <input type="number" id="scheduleDuration" placeholder="Enter duration" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <button onclick="submitSchedule()" class="control-button" style="margin-top: 1rem;">
                    Set Schedule
                </button>
            `;
            modalManager.open(content);
        },

        alerts: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">🔔 Send Alerts</h2>
                <p style="margin-bottom: 1.5rem;">Send notifications to streamers</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Alert Type:</label>
                    <select id="alertType" 
                            style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                   background: rgba(26, 11, 46, 0.6); color: white;">
                        <option>General Announcement</option>
                        <option>Stream Reminder</option>
                        <option>Performance Update</option>
                        <option>Credit Update</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Recipients:</label>
                    <select id="alertRecipients" 
                            style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                   background: rgba(26, 11, 46, 0.6); color: white;">
                        <option>All Streamers</option>
                        <option>Active Streamers</option>
                        <option>Specific Streamer</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Message:</label>
                    <textarea id="alertMessage" rows="4" placeholder="Enter your alert message" 
                              style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                     background: rgba(26, 11, 46, 0.6); color: white; resize: vertical;"></textarea>
                </div>
                
                <button onclick="submitAlert()" class="control-button" style="margin-top: 1rem;">
                    Send Alert
                </button>
            `;
            modalManager.open(content);
        },

        performance: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">📊 Performance Tracking</h2>
                <p style="margin-bottom: 1.5rem;">View streamer performance metrics</p>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">Top Performers This Week</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(168, 85, 247, 0.3);">
                            🥇 Streamer1 - 45 hours - 12,500 viewers
                        </li>
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(168, 85, 247, 0.3);">
                            🥈 Streamer2 - 38 hours - 9,800 viewers
                        </li>
                        <li style="padding: 0.5rem 0;">
                            🥉 Streamer3 - 32 hours - 8,200 viewers
                        </li>
                    </ul>
                </div>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px;">
                    <h3 style="margin-bottom: 0.5rem;">Overall Statistics</h3>
                    <p>Total Stream Hours: 432</p>
                    <p>Average Viewers: 8,500</p>
                    <p>Peak Concurrent Streams: 12</p>
                </div>
            `;
            modalManager.open(content);
        },

        bot: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">🤖 Bot Integration</h2>
                <p style="margin-bottom: 1.5rem;">Configure bot settings and sync features</p>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">Bot Status</h3>
                    <p style="color: #10b981;">✅ Connected and Online</p>
                    <p>Last Sync: Just now</p>
                </div>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">Synced Features</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem 0;">✅ Credit Management</li>
                        <li style="padding: 0.5rem 0;">✅ Schedule Management</li>
                        <li style="padding: 0.5rem 0;">✅ Alert System</li>
                        <li style="padding: 0.5rem 0;">✅ Performance Tracking</li>
                    </ul>
                </div>
                
                <button onclick="syncBot()" class="control-button">
                    Force Sync Now
                </button>
            `;
            modalManager.open(content);
        },

        settings: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">⚙️ Settings</h2>
                <p style="margin-bottom: 1.5rem;">Configure your dashboard preferences</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="soundToggle" ${soundManager.enabled ? 'checked' : ''} 
                               onchange="toggleSound()" 
                               style="margin-right: 0.5rem; width: 20px; height: 20px;">
                        <span>Enable Sound Effects</span>
                    </label>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="notificationToggle" checked 
                               style="margin-right: 0.5rem; width: 20px; height: 20px;">
                        <span>Enable Notifications</span>
                    </label>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Theme Intensity:</label>
                    <input type="range" min="1" max="10" value="7" 
                           style="width: 100%;">
                </div>
                
                <button onclick="saveSettings()" class="control-button" style="margin-top: 1rem;">
                    Save Settings
                </button>
            `;
            modalManager.open(content);
        }
    };

    if (actionHandlers[action]) {
        actionHandlers[action]();
    } else {
        notificationManager.show('Feature coming soon!', 'info');
    }
}

// Form Submission Handlers
function submitCredits() {
    const name = document.getElementById('streamerName').value;
    const amount = document.getElementById('creditAmount').value;

    if (!name || !amount) {
        notificationManager.show('Please fill all fields', 'error');
        return;
    }

    // 🔥 This is the connection to your bot on Railway!
    fetch("https://bot-and-dashbord-aktro-production.up.railway.app/credit/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Add any authorization header if your bot requires it
            // "Authorization": "Bearer YOUR_SECRET_TOKEN"
        },
        body: JSON.stringify({
            username: name,
            amount: Number(amount)
        })
    })
    .then(response => {
        if (!response.ok) {
            // If the server response is not OK, throw an error
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // This runs if the request was successful
        soundManager.playSuccess();
        notificationManager.show(`Successfully updated credits for ${name}!`, 'success');
        modalManager.close();
    })
    .catch(error => {
        // This runs if there was an error with the fetch operation
        notificationManager.show('API Error. Check bot logs on Railway.', 'error');
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function submitSchedule() {
    const streamer = document.getElementById('scheduleStreamer').value;
    const time = document.getElementById('scheduleTime').value;
    const duration = document.getElementById('scheduleDuration').value;

    if (streamer && time && duration) {
        soundManager.playSuccess();
        notificationManager.show(`Schedule set for ${streamer}!`, 'success');
        modalManager.close();
    } else {
        notificationManager.show('Please fill all fields', 'error');
    }
}

function submitAlert() {
    const type = document.getElementById('alertType').value;
    const recipients = document.getElementById('alertRecipients').value;
    const message = document.getElementById('alertMessage').value;

    if (message) {
        soundManager.playSuccess();
        notificationManager.show(`Alert sent to ${recipients}!`, 'success');
        modalManager.close();
    } else {
        notificationManager.show('Please enter a message', 'error');
    }
}

function syncBot() {
    soundManager.playClick();
    notificationManager.show('Syncing with bot...', 'info');
    
    setTimeout(() => {
        soundManager.playSuccess();
        notificationManager.show('Bot sync completed successfully!', 'success');
    }, 2000);
}

function toggleSound() {
    const enabled = soundManager.toggle();
    soundManager.playClick();
    notificationManager.show(`Sound effects ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function saveSettings() {
    soundManager.playSuccess();
    notificationManager.show('Settings saved successfully!', 'success');
    modalManager.close();
}

// Periodic notifications (simulate real-time updates)
setInterval(() => {
    const messages = [
        { text: 'Streamer went live!', type: 'info' },
        { text: 'New performance milestone reached!', type: 'success' },
        { text: 'Schedule reminder: Stream starting in 30 minutes', type: 'info' }
    ];
    
    // Randomly show notifications (10% chance every 30 seconds)
    if (Math.random() < 0.1 && !document.getElementById('welcomeScreen').classList.contains('hidden')) {
        return; // Don't show on welcome screen
    }
    
    if (Math.random() < 0.1) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        notificationManager.show(randomMessage.text, randomMessage.type);
    }
}, 30000);
