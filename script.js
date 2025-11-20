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
            notification.style.animation = 'slideOutLeft 0.3s ease-out';
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
            notificationManager.show('مرحباً بك في لوحة تحكم Aktro! 🎮', 'success');
            
            // Show a quick tip after 2 seconds
            setTimeout(() => {
                notificationManager.show('نصيحة: جميع الأزرار متزامنة مع ميزات البوت', 'info');
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
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">💰 تعديل الرصيد</h2>
                <p style="margin-bottom: 1.5rem;">إضافة أو خصم الرصيد من الستريمرز</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">اسم الستريمر:</label>
                    <input type="text" id="streamerName" placeholder="أدخل اسم الستريمر" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">كمية الرصيد:</label>
                    <input type="number" id="creditAmount" placeholder="أدخل الكمية (استخدم - للخصم)" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <button onclick="submitCredits()" class="control-button" style="margin-top: 1rem;">
                    إرسال
                </button>
            `;
            modalManager.open(content);
        },

        schedule: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">📅 إدارة الجداول</h2>
                <p style="margin-bottom: 1.5rem;">تعيين أو تحديث جداول البث</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">اسم الستريمر:</label>
                    <input type="text" id="scheduleStreamer" placeholder="أدخل اسم الستريمر" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">تاريخ ووقت الجدول:</label>
                    <input type="datetime-local" id="scheduleTime" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">المدة (بالساعات):</label>
                    <input type="number" id="scheduleDuration" placeholder="أدخل المدة" 
                           style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                  background: rgba(26, 11, 46, 0.6); color: white;">
                </div>
                
                <button onclick="submitSchedule()" class="control-button" style="margin-top: 1rem;">
                    تعيين الجدول
                </button>
            `;
            modalManager.open(content);
        },

        alerts: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">🔔 إرسال تنبيهات</h2>
                <p style="margin-bottom: 1.5rem;">إرسال إشعارات للستريمرز</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">نوع التنبيه:</label>
                    <select id="alertType" 
                            style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                   background: rgba(26, 11, 46, 0.6); color: white;">
                        <option>إعلان عام</option>
                        <option>تذكير بالبث</option>
                        <option>تحديث الأداء</option>
                        <option>تحديث الرصيد</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">المستلمون:</label>
                    <select id="alertRecipients" 
                            style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                   background: rgba(26, 11, 46, 0.6); color: white;">
                        <option>كل الستريمرز</option>
                        <option>الستريمرز النشطون</option>
                        <option>ستريمر محدد</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">الرسالة:</label>
                    <textarea id="alertMessage" rows="4" placeholder="أدخل رسالة التنبيه" 
                              style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px solid var(--purple-2); 
                                     background: rgba(26, 11, 46, 0.6); color: white; resize: vertical;"></textarea>
                </div>
                
                <button onclick="submitAlert()" class="control-button" style="margin-top: 1rem;">
                    إرسال التنبيه
                </button>
            `;
            modalManager.open(content);
        },

        performance: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">📊 متابعة الأداء</h2>
                <p style="margin-bottom: 1.5rem;">عرض مقاييس أداء الستريمرز</p>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">أفضل أداء هذا الأسبوع</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(168, 85, 247, 0.3);">
                            🥇 ستريمر1 - 45 ساعة - 12,500 مشاهد
                        </li>
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(168, 85, 247, 0.3);">
                            🥈 ستريمر2 - 38 ساعة - 9,800 مشاهد
                        </li>
                        <li style="padding: 0.5rem 0;">
                            🥉 ستريمر3 - 32 ساعة - 8,200 مشاهد
                        </li>
                    </ul>
                </div>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px;">
                    <h3 style="margin-bottom: 0.5rem;">الإحصائيات العامة</h3>
                    <p>إجمالي ساعات البث: 432</p>
                    <p>متوسط المشاهدين: 8,500</p>
                    <p>ذروة البث المتزامن: 12</p>
                </div>
            `;
            modalManager.open(content);
        },

        bot: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">🤖 تكامل البوت</h2>
                <p style="margin-bottom: 1.5rem;">ضبط إعدادات البوت ومزامنة الميزات</p>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">حالة البوت</h3>
                    <p style="color: #10b981;">✅ متصل ويعمل</p>
                    <p>آخر مزامنة: الآن</p>
                </div>
                
                <div style="background: rgba(138, 43, 226, 0.2); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">الميزات المتزامنة</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem 0;">✅ إدارة الرصيد</li>
                        <li style="padding: 0.5rem 0;">✅ إدارة الجداول</li>
                        <li style="padding: 0.5rem 0;">✅ نظام التنبيهات</li>
                        <li style="padding: 0.5rem 0;">✅ متابعة الأداء</li>
                    </ul>
                </div>
                
                <button onclick="syncBot()" class="control-button">
                    مزامنة قسرية الآن
                </button>
            `;
            modalManager.open(content);
        },

        settings: () => {
            const content = `
                <h2 style="color: var(--purple-4); margin-bottom: 1rem;">⚙️ الإعدادات</h2>
                <p style="margin-bottom: 1.5rem;">ضبط تفضيلات لوحة التحكم</p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="soundToggle" ${soundManager.enabled ? 'checked' : ''} 
                               onchange="toggleSound()" 
                               style="margin-left: 0.5rem; width: 20px; height: 20px;">
                        <span>تفعيل المؤثرات الصوتية</span>
                    </label>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="notificationToggle" checked 
                               style="margin-left: 0.5rem; width: 20px; height: 20px;">
                        <span>تفعيل الإشعارات</span>
                    </label>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">كثافة المظهر:</label>
                    <input type="range" min="1" max="10" value="7" 
                           style="width: 100%;">
                </div>
                
                <button onclick="saveSettings()" class="control-button" style="margin-top: 1rem;">
                    حفظ الإعدادات
                </button>
            `;
            modalManager.open(content);
        }
    };

    if (actionHandlers[action]) {
        actionHandlers[action]();
    } else {
        notificationManager.show('الميزة ستتوفر قريباً!', 'info');
    }
}

// Form Submission Handlers
function submitCredits() {
    const name = document.getElementById('streamerName').value;
    const amount = document.getElementById('creditAmount').value;

    if (!name || !amount) {
        notificationManager.show('الرجاء ملء جميع الحقول', 'error');
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
            throw new Error(`استجابة الشبكة غير صالحة: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // This runs if the request was successful
        soundManager.playSuccess();
        notificationManager.show(`تم تحديث الرصيد لـ ${name} بنجاح!`, 'success');
        modalManager.close();
    })
    .catch(error => {
        // This runs if there was an error with the fetch operation
        notificationManager.show('خطأ في الاتصال بالبوت. تحقق من السجلات على Railway.', 'error');
        console.error('حدثت مشكلة في عملية الاتصال:', error);
    });
}

function submitSchedule() {
    const streamer = document.getElementById('scheduleStreamer').value;
    const time = document.getElementById('scheduleTime').value;
    const duration = document.getElementById('scheduleDuration').value;

    if (streamer && time && duration) {
        soundManager.playSuccess();
        notificationManager.show(`تم تعيين الجدول لـ ${streamer}!`, 'success');
        modalManager.close();
    } else {
        notificationManager.show('الرجاء ملء جميع الحقول', 'error');
    }
}

function submitAlert() {
    const type = document.getElementById('alertType').value;
    const recipients = document.getElementById('alertRecipients').value;
    const message = document.getElementById('alertMessage').value;

    if (message) {
        soundManager.playSuccess();
        notificationManager.show(`تم إرسال التنبيه إلى ${recipients}!`, 'success');
        modalManager.close();
    } else {
        notificationManager.show('الرجاء إدخال رسالة', 'error');
    }
}

function syncBot() {
    soundManager.playClick();
    notificationManager.show('جارٍ المزامنة مع البوت...', 'info');
    
    setTimeout(() => {
        soundManager.playSuccess();
        notificationManager.show('اكتملت مزامنة البوت بنجاح!', 'success');
    }, 2000);
}

function toggleSound() {
    const enabled = soundManager.toggle();
    soundManager.playClick();
    notificationManager.show(`تم ${enabled ? 'تفعيل' : 'تعطيل'} المؤثرات الصوتية`, 'info');
}

function saveSettings() {
    soundManager.playSuccess();
    notificationManager.show('تم حفظ الإعدادات بنجاح!', 'success');
    modalManager.close();
}

// Periodic notifications (simulate real-time updates)
setInterval(() => {
    const messages = [
        { text: 'أحد الستريمرز بدأ بث مباشر!', type: 'info' },
        { text: 'تم تحقيق إنجاز جديد في الأداء!', type: 'success' },
        { text: 'تذكير بالجدول: البث سيبدأ خلال 30 دقيقة', type: 'info' }
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
