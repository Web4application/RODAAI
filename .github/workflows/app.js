document.addEventListener('DOMContentLoaded', (event) => {
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');

function sendMessage() {
const userMessage = userInput.value;
if (userMessage.trim() === "") return;

// Display user's message
const userMessageElement = document.createElement('div');
userMessageElement.className = 'user-message';
userMessageElement.textContent = userMessage;
chatbox.appendChild(userMessageElement);

// Clear the input field
userInput.value = "";

// Simulate AI response
getAIResponse(userMessage);
}

function getAIResponse(message) {
// Simulate a delay for AI response
setTimeout(() => {
const aiMessage = `AI says: ${message}`;
const aiMessageElement = document.createElement('div');
aiMessageElement.className = 'ai-message';
aiMessageElement.textContent = aiMessage;
chatbox.appendChild(aiMessageElement);

// Scroll to the bottom of the chatbox
chatbox.scrollTop = chatbox.scrollHeight;
}, 1000);
}

// Attach sendMessage function to the button
document.querySelector('button').addEventListener('click', sendMessage);

// Allow pressing Enter to send message
userInput.addEventListener('keypress', (event) => {
if (event.key === 'Enter') {
sendMessage();
}
});
});
