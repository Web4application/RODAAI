// ai.js

async function processAIMessage(message) {
  // For now, just echo back with some extra context
  // Replace this with your backend API call later
  renderMessage("RODA", "Thinking... 🤔");

  setTimeout(() => {
    // Example logic
    let reply;

    if (message.toLowerCase().includes("hello")) {
      reply = "Hi there 👋, how can I support your Web4 or blockchain project today?";
    } else if (message.toLowerCase().includes("blockchain")) {
      reply = "Blockchain tasks? I can help with smart contracts, deployment, and token logic ⚡.";
    } else if (message.toLowerCase().includes("web4")) {
      reply = "Web4 is about decentralization + intelligence. I can help you integrate AI, IoT, and blockchain 🚀.";
    } else {
      reply = `You said: "${message}". I'm ready to dive deeper, just be specific.`;
    }

    // Clear "thinking" and render AI message
    chatBody.lastChild.remove();
    renderMessage("RODA", reply);
  }, 1200); // mimic delay
}
