import io from 'socket.io-client';

let tabVisibilityCount = 0;
let windowFocusCount = 0;
let copyCount = 0;
let pasteCount = 0;
let cutCount = 0;
let fullscreenCount = 0;
let fullscreenButton = null;

const socket = io('http://localhost:8000');
console.log(socket);

let typingStartTime = 0;
let typingCharacterCount = 0;
let typingInterval;

// Create a fullscreen toggle button
const createFullscreenButton = () => {
    // Don't create multiple buttons
    if (fullscreenButton) return;
    
    fullscreenButton = document.createElement('button');
    fullscreenButton.textContent = 'Toggle Fullscreen';
    fullscreenButton.style.position = 'fixed';
    fullscreenButton.style.bottom = '20px';
    fullscreenButton.style.right = '20px';
    fullscreenButton.style.zIndex = '9999';
    fullscreenButton.style.padding = '10px 15px';
    fullscreenButton.style.backgroundColor = '#4285f4';
    fullscreenButton.style.color = 'white';
    fullscreenButton.style.border = 'none';
    fullscreenButton.style.borderRadius = '4px';
    fullscreenButton.style.cursor = 'pointer';
    fullscreenButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    
    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            exitFullScreen();
        } else {
            goFullScreen();
            socket.emit('fullscreenChanged', { state: 'entered', socketId: socket.id });
        }
    });
    
    document.body.appendChild(fullscreenButton);
};

// Remove the fullscreen button
const removeFullscreenButton = () => {
    if (fullscreenButton && fullscreenButton.parentNode) {
        fullscreenButton.parentNode.removeChild(fullscreenButton);
        fullscreenButton = null;
    }
};

// Check if we should show the button automatically
const shouldShowButton = () => {
    // Show on example.com domains automatically
    const isExampleDomain = window.location.hostname.includes('example.com');
    return isExampleDomain;
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showFullscreenButton') {
        createFullscreenButton();
    } else if (message.action === 'hideFullscreenButton') {
        removeFullscreenButton();
    }
    return true;
});

// Add the button once the DOM is fully loaded if on example.com
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (shouldShowButton()) {
            createFullscreenButton();
        }
    });
} else {
    if (shouldShowButton()) {
        createFullscreenButton();
    }
}

const calculateTypingSpeed = () => {
    const typingTimeInMinutes = (Date.now() - typingStartTime) / 60000; 
    const wordsTyped = typingCharacterCount / 5; 
    const typingSpeed = Math.round(wordsTyped / typingTimeInMinutes);

    console.log(`Typing Speed: ${typingSpeed} words per minute`);
    socket.emit('typeSpeed', { speed: typingSpeed, socketId: socket.id });
    
    typingStartTime = Date.now();
    typingCharacterCount = 0;
};


const startTypingSpeedTracker = () => {
    typingStartTime = Date.now();
    typingCharacterCount = 0;

    typingInterval = setInterval(() => {
        calculateTypingSpeed();
    }, 20000); 
};

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        console.log('Tab is now inactive.');
        tabVisibilityCount++;
        socket.emit('tabVisibilityChanged', { state: 'inactive', count: tabVisibilityCount, socketId: socket.id });
    } else if (document.visibilityState === 'visible') {
        console.log('Tab is now active.');
        socket.emit('tabVisibilityChanged', { state: 'active' });
    }
});

window.addEventListener('focus', () => {
    console.log('Window is in focus.');
    socket.emit('windowFocusChanged', { state: 'focus' });
});

    window.addEventListener('blur', () => {
        console.log('Window lost focus.');
        windowFocusCount++;
        socket.emit('windowFocusChanged', { state: 'blur' , count : windowFocusCount , socketId : socket.id });
    });

    
    document.addEventListener('copy', async (e) => {
        try {
            const copiedContent = await navigator.clipboard.readText();
            console.log('Copied content:', copiedContent);
            copyCount++;
            socket.emit('copyEvent', { action: 'copy', content: copiedContent , count : copyCount , socketId : socket.id});
        } catch (err) {
            console.error('Failed to read clipboard content on copy:', err);
        }
    });

    
    document.addEventListener('paste', async (e) => {
        try {
            const pastedContent = await navigator.clipboard.readText();
            console.log('Pasted content:', pastedContent);
            pasteCount++;
            socket.emit('pasteEvent', { action: 'paste', content: pastedContent , count : pasteCount , socketId : socket.id});
        } catch (err) {
            console.error('Failed to read clipboard content on paste:', err);
        }
    });

    
    document.addEventListener('cut', async (e) => {
        try {
            const cutContent = await navigator.clipboard.readText();
            console.log('Cut content:', cutContent);
            cutCount++;
            socket.emit('cutEvent', { action: 'cut', content: cutContent , count : cutCount , socketId : socket.id});
        } catch (err) {
            console.error('Failed to read clipboard content on cut:', err);
        }
    });

    
    function goFullScreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

document.addEventListener("fullscreenchange", () => {
    try {
        if (document.fullscreenElement) {
            console.log("Entered fullscreen mode");
            socket.emit('fullscreenChanged', { state: 'entered', socketId: socket.id });
        } else {
            console.log("Exited fullscreen mode");
            fullscreenCount++;
            socket.emit('fullscreenChanged', { state: 'exited', count: fullscreenCount, socketId: socket.id });
        }
    } catch (error) {
        console.error("Error in fullscreenchange handler:", error);
    }
});

// Also add these alternative event listeners for better cross-browser support
document.addEventListener("webkitfullscreenchange", () => {
    try {
        if (document.webkitFullscreenElement) {
            console.log("Entered fullscreen mode (webkit)");
            socket.emit('fullscreenChanged', { state: 'entered', socketId: socket.id });
        } else {
            console.log("Exited fullscreen mode (webkit)");
            fullscreenCount++;
            socket.emit('fullscreenChanged', { state: 'exited', count: fullscreenCount, socketId: socket.id });
        }
    } catch (error) {
        console.error("Error in webkitfullscreenchange handler:", error);
    }
});

document.addEventListener("mozfullscreenchange", () => {
    try {
        if (document.mozFullScreenElement) {
            console.log("Entered fullscreen mode (moz)");
            socket.emit('fullscreenChanged', { state: 'entered', socketId: socket.id });
        } else {
            console.log("Exited fullscreen mode (moz)");
            fullscreenCount++;
            socket.emit('fullscreenChanged', { state: 'exited', count: fullscreenCount, socketId: socket.id });
        }
    } catch (error) {
        console.error("Error in mozfullscreenchange handler:", error);
    }
});

document.addEventListener("keydown", (event) => {
    
    typingCharacterCount++; 

    if (typingStartTime === 0) {
        startTypingSpeedTracker(); 
    }

    if (event.key === "F" && (event.ctrlKey || event.altKey)) {
        if (document.fullscreenElement) {
            exitFullScreen();
        } else {
            goFullScreen();
            socket.emit('fullscreenChanged', { state: 'entered', socketId: socket.id });
        }
    }

    if (event.key === "Escape" && document.fullscreenElement) {
        exitFullScreen();
    }
});
