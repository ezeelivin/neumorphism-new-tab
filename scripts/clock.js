// Clock and Date Module
const ClockManager = (() => {
    // Private variables
    let greetingDiv;
    let clockDateDiv;
    let clockDiv;
    let hourContainer;
    let minContainer;
    let secContainer;
    let showDateToggle;
    let showGreetingToggle;
    let showClockToggle;

    // Initialize DOM elements
    function _initializeElements() {
        greetingDiv = document.getElementById('greeting');
        clockDateDiv = document.getElementById('clock-date');
        clockDiv = document.querySelector('.analog.clock');
        hourContainer = document.querySelector('.hour-container');
        minContainer = document.querySelector('.min-container');
        secContainer = document.querySelector('.sec-container');
        showDateToggle = document.getElementById('showDateToggle');
        showGreetingToggle = document.getElementById('showGreetingToggle');
        showClockToggle = document.getElementById('showClockToggle');

        // Load saved toggle states
        const savedShowDate = localStorage.getItem('showDate') === 'true' || (showDateToggle && showDateToggle.checked);
        const savedShowGreeting = localStorage.getItem('showGreeting') === 'true' || (showGreetingToggle && showGreetingToggle.checked);
        const savedShowClock = localStorage.getItem('showClock') === 'true' || (showClockToggle && showClockToggle.checked);

        // Set initial states
        if (showDateToggle) {
            showDateToggle.checked = savedShowDate;
            if (!savedShowDate && clockDateDiv) {
                clockDateDiv.classList.add('hidden');
            }
        }

        if (showGreetingToggle) {
            showGreetingToggle.checked = savedShowGreeting;
            if (!savedShowGreeting && greetingDiv) {
                greetingDiv.classList.add('hidden');
            }
        }

        if (showClockToggle) {
            showClockToggle.checked = savedShowClock;
            if (!savedShowClock && clockDiv) {
                clockDiv.classList.add('hidden');
            }
        }
    }

    // Get greeting based on time of day
    function getGreeting(hour) {
        if (hour < 12) {
            return 'Good Morning';
        } else if (hour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    }

    // Get formatted date
    function getDate() {
        const now = new Date();
        const day = now.getDate();
        const weekday = now.toLocaleDateString(undefined, { weekday: 'short' });
        const month = now.toLocaleDateString(undefined, { month: 'short' });
        const year = now.getFullYear();
        
        return `${weekday}, ${day} ${month} ${year}`;
    }

    // Update time and date
    function updateTimeAndDate() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // Update analog clock
        if (hourContainer && minContainer && secContainer) {
            const hourDeg = (hour * 30) + (0.5 * minute);
            const minDeg = (minute * 6) + (0.1 * second);
            const secDeg = second * 6;

            hourContainer.style.transform = `rotate(${hourDeg}deg)`;
            minContainer.style.transform = `rotate(${minDeg}deg)`;
            secContainer.style.transform = `rotate(${secDeg}deg)`;
        }

        // Update greeting and date
        if (greetingDiv) {
            greetingDiv.innerText = getGreeting(hour);
        }
        if (clockDateDiv) {
            clockDateDiv.innerText = getDate();
        }
    }

    // Setup event listeners
    function _setupEventListeners() {
        // Handle date toggle change
        if (showDateToggle) {
            showDateToggle.addEventListener('change', () => {
                const isVisible = showDateToggle.checked;
                if (clockDateDiv) {
                    clockDateDiv.classList.toggle('hidden', !isVisible);
                }
                localStorage.setItem('showDate', isVisible);
            });
        }

        // Handle greeting toggle change
        if (showGreetingToggle) {
            showGreetingToggle.addEventListener('change', () => {
                const isVisible = showGreetingToggle.checked;
                if (greetingDiv) {
                    greetingDiv.classList.toggle('hidden', !isVisible);
                }
                localStorage.setItem('showGreeting', isVisible);
            });
        }

        // Handle clock toggle change
        if (showClockToggle) {
            showClockToggle.addEventListener('change', () => {
                const isVisible = showClockToggle.checked;
                if (clockDiv) {
                    clockDiv.classList.toggle('hidden', !isVisible);
                }
                localStorage.setItem('showClock', isVisible);
            });
        }
    }

    // Initialize clock
    function _initializeClock() {
        // Set initial values
        updateTimeAndDate();

        // Set up clock update interval
        setInterval(updateTimeAndDate, 1000);
    }

    // Public API
    return {
        init() {
            _initializeElements();
            _setupEventListeners();
            _initializeClock();
        },

        getGreeting,
        getDate,
        updateTimeAndDate
    };
})();

// Initialize the Clock module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ClockManager.init();
});