

// Elements
const dailyGoalInput = document.getElementById('dailyGoal');
const setGoalBtn = document.getElementById('setGoalBtn');
const writer = document.getElementById('writer');
const progressText = document.getElementById('progress-text');
const progressCircle = document.getElementById('progress-circle');
const writerArea = document.getElementById('writer');

let dailyGoal = 0;
let currentWords = 0;
let lastMilestone = 0;

// Load saved goal
if (localStorage.getItem('dailyGoal')) {
    dailyGoal = parseInt(localStorage.getItem('dailyGoal'), 10);
    dailyGoalInput.value = dailyGoal;
}

// Set new goal
setGoalBtn.addEventListener('click', () => {
    dailyGoal = parseInt(dailyGoalInput.value, 10) || 0;
    localStorage.setItem('dailyGoal', dailyGoal);
    updateProgress();
});

// Count words
writer.addEventListener('input', () => {
    const text = writer.value.trim();
    currentWords = text === '' ? 0 : text.split(/\s+/).length;
    updateProgress();
});

// Update ring and text
function updateProgress() {
    if (!dailyGoal) {
        progressText.textContent = '0%';
        progressCircle.style.setProperty('--progress-angle', '0deg');
        progressCircle.style.setProperty('--progress-color', '#e6e6e6');
        if (writerArea) {
            writerArea.style.setProperty('--pulse-strength', '4px');
        }
        lastMilestone = 0;
        return;
    }

    const pct = Math.min(100, Math.round((currentWords / dailyGoal) * 100));
    progressText.textContent = pct + '%';

    // Simple visual feedback
    const hue = pct * 1.2; // green-ish as it fills
    progressCircle.style.setProperty('--progress-angle', `${pct * 3.6}deg`);
    progressCircle.style.setProperty('--progress-color', `hsl(${hue}, 70%, 50%)`);
    if (writerArea) {
        const strength = 4 + pct * 0.25;
        writerArea.style.setProperty('--pulse-strength', `${strength}px`);
    }

    const milestone = Math.floor(pct / 10);
    if (milestone > lastMilestone && milestone > 0) {
        triggerConfettiBurst();
        lastMilestone = milestone;
    } else if (milestone < lastMilestone) {
        lastMilestone = milestone;
    }
}

function triggerConfettiBurst() {
    if (!writerArea) return;
    const rect = writerArea.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.className = 'confetti-burst';
    const padding = 90;
    const width = rect.width + padding * 2;
    const height = rect.height + padding * 2;
    burst.style.width = `${width}px`;
    burst.style.height = `${height}px`;
    burst.style.left = `${rect.left - padding + window.scrollX}px`;
    burst.style.top = `${rect.top - padding + window.scrollY}px`;

    const colors = ['#724cf9', '#5bc0be', '#0b6e4f', '#1c2541', '#0b132b'];
    const waves = [0, 150, 320, 520];
    const centerX = width / 2;
    const centerY = height / 2;
    const innerRadius = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);
    const outerRadius = innerRadius + padding;

    function emitWave(waveIndex) {
        const particleCount = 8 + Math.round(Math.random() * 3) + (waveIndex === waves.length - 1 ? 5 : 0);
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.className = 'confetti-particle';
            const angle = Math.random() * Math.PI * 2;
            const startRadius = innerRadius + 12 + Math.random() * (outerRadius - innerRadius);
            const startX = centerX + Math.cos(angle) * startRadius;
            const startY = centerY + Math.sin(angle) * startRadius;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            const burstDistance = 40 + Math.random() * 120;
            const driftX = Math.cos(angle) * burstDistance + (Math.random() - 0.5) * 40;
            const driftY = Math.sin(angle) * burstDistance - (30 + Math.random() * 90);
            particle.style.setProperty('--confetti-x', `${driftX}px`);
            particle.style.setProperty('--confetti-y', `${driftY}px`);
            particle.style.setProperty('--confetti-delay', `${Math.random() * 120}ms`);
            particle.style.setProperty('--confetti-duration', `${520 + Math.random() * 300}ms`);
            particle.style.setProperty('--confetti-angle', `${Math.random() * 360}deg`);
            particle.style.backgroundColor = colors[(waveIndex + i) % colors.length];
            burst.appendChild(particle);
        }
    }

    document.body.appendChild(burst);
    waves.forEach((delay, index) => {
        setTimeout(() => emitWave(index), delay);
    });

    const cleanupDelay = waves[waves.length - 1] + 1000;
    setTimeout(() => burst.remove(), cleanupDelay);
}
