// script.js

// DOM elements
const chatWidget = document.getElementById("chat-widget");
const chatBody = chatWidget.querySelector(".chat-body");
const chatInput = chatWidget.querySelector("input");
const sendButton = chatWidget.querySelector("button");

// Open Assistant
function launchAssistant() {
  chatWidget.classList.remove("hidden");
}

// Close Assistant
function closeAssistant() {
  chatWidget.classList.add("hidden");
}

// Render message in chat
function renderMessage(sender, text) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBody.appendChild(p);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle sending message
function handleSend() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Show user’s message
  renderMessage("You", userMessage);
  chatInput.value = "";

  // Pass to AI logic
  processAIMessage(userMessage);
}

// Events
sendButton.addEventListener("click", handleSend);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});
