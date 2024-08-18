document.addEventListener('DOMContentLoaded', function() {
    loadChatHistory();
    setupTheme();

    document.getElementById('send-btn').addEventListener('click', function() {
        let userInput = document.getElementById('user-input').value.trim();
        if (userInput) {
            addMessageToChat(userInput, 'user-message');
            document.getElementById('user-input').value = '';  // Clear input after sending
            processUserInput(userInput);
        }
    });

    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('send-btn').click();
        }
    });

    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    document.getElementById('clear-history-btn').addEventListener('click', function() {
        clearChatHistory();
    });
});

function processUserInput(userInput) {
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        let response = getBotResponse(userInput);
        addMessageToChat(response);
    }, 1000);
}

function getBotResponse(input) {
    const lowerInput = input.toLowerCase();
    const responses = {
        "hello": "Hello! How can I assist you today?",
        "help": "You can ask me to search the web, tell a joke, or perform specific tasks.",
        "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
        "open google": "Opening Google...",
        "open youtube": "Opening YouTube...",
    };

    if (lowerInput in responses) {
        if (lowerInput === "open google") {
            window.open("https://www.google.com", "_blank");
        } else if (lowerInput === "open youtube") {
            window.open("https://www.youtube.com", "_blank");
        }
        return responses[lowerInput];
    }

    searchWeb(input);
    return 'Searching the web for "' + input + '"...';
}

function searchWeb(query) {
    let searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
    window.open(searchUrl, '_blank');
}

function addMessageToChat(message, className = '') {
    const chatOutput = document.getElementById('chat-output');
    const messageElement = document.createElement('p');
    const timestamp = document.createElement('div');
    const now = new Date();

    timestamp.className = 'timestamp';
    timestamp.textContent = now.toLocaleTimeString();

    messageElement.textContent = message;
    if (className) {
        messageElement.classList.add(className);
    }

    messageElement.appendChild(timestamp);
    chatOutput.appendChild(messageElement);
    chatOutput.scrollTop = chatOutput.scrollHeight;  // Auto-scroll to the bottom

    saveChatHistory(message, className, timestamp.textContent);
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'block';
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

function saveChatHistory(message, className, timestamp) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ message, className, timestamp });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(entry => {
        addMessageToChat(entry.message, entry.className);
    });
}

function clearChatHistory() {
    localStorage.removeItem('chatHistory');
    document.getElementById('chat-output').innerHTML = '';
}

function setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}
