

// Elements
const dailyGoalInput = document.getElementById('dailyGoal');
const setGoalBtn = document.getElementById('setGoalBtn');
const writer = document.getElementById('writer');
const progressText = document.getElementById('progress-text');
const progressCircle = document.getElementById('progress-circle');

let dailyGoal = 0;
let currentWords = 0;

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
        progressCircle.style.borderColor = '#ccc';
        return;
    }

    const pct = Math.min(100, Math.round((currentWords / dailyGoal) * 100));
    progressText.textContent = pct + '%';

    // Simple visual feedback
    const hue = pct * 1.2; // green-ish as it fills
    progressCircle.style.borderColor = `hsl(${hue}, 70%, 50%)`;
}