// /assets/script.js
// Handles UI, channels, input, file upload, speech recognition and calling ai.js

import { sendChatMessage, uploadImage, fetchHistory } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.querySelector(".chat-input button");
  const channels = Array.from(document.querySelectorAll(".channel"));
  const fileBtn = document.getElementById("upload-button");
  const hiddenFile = document.getElementById("file-input"); // ensure exists or create
  const micBtn = document.getElementById("mic-button");     // ensure exists or create

  // State
  let activeChannel = "general";

  // Helpers
  function createMessageElement(who, text, opts = {}) {
    const div = document.createElement("div");
    div.classList.add("message");
    if (who === "you") div.classList.add("user");
    const strong = `<strong>${who === "you" ? "You" : "RODA"}</strong>`;
    const time = `<span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
    const contentHTML = `<div class="message-content">${strong} ${opts.withTime ? time : ""}<div class="msg-text">${text}</div></div>`;
    div.innerHTML = contentHTML;
    return div;
  }

  function appendAndScroll(el) {
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Channel switching
  channels.forEach(c => {
    c.addEventListener("click", () => {
      channels.forEach(x => x.classList.remove("active"));
      c.classList.add("active");
      activeChannel = c.textContent.trim().replace(/^#\s*/, "") || "general";
      document.querySelector(".chat-header").textContent = `# ${activeChannel}`;
      // optionally load channel-specific history
      loadHistory();
    });
  });

  // send message
  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    appendAndScroll(createMessageElement("you", text, { withTime: true }));
    userInput.value = "";
    // show "typing"
    const typingEl = createMessageElement("RODA", "⏳ thinking...", { withTime: true });
    appendAndScroll(typingEl);

    try {
      const res = await sendChatMessage({ message: text, channel: activeChannel });
      // replace typing with actual reply
      typingEl.querySelector(".msg-text").textContent = res.reply || "No reply (empty)";
      if (res.attachments && res.attachments.length) {
        res.attachments.forEach(att => {
          if (att.type === "image" && att.url) {
            const img = document.createElement("img");
            img.src = att.url;
            img.style.maxWidth = "60%";
            img.style.borderRadius = "8px";
            typingEl.appendChild(img);
          }
        });
      }
    } catch (err) {
      typingEl.querySelector(".msg-text").textContent = "⚠️ Error: " + (err.message || err);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // File upload button (if present)
  if (fileBtn && hiddenFile) {
    fileBtn.addEventListener("click", () => hiddenFile.click());
    hiddenFile.addEventListener("change", async (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      appendAndScroll(createMessageElement("you", `📷 image: ${file.name}`, { withTime: true }));
      const uploading = createMessageElement("RODA", "Uploading image...", { withTime: true });
      appendAndScroll(uploading);
      try {
        const res = await uploadImage(file, { channel: activeChannel });
        uploading.querySelector(".msg-text").textContent = res.analysis || res.message || "Image uploaded";
        if (res.url) {
          const img = document.createElement("img");
          img.src = res.url;
          img.style.maxWidth = "60%";
          img.style.borderRadius = "8px";
          uploading.appendChild(img);
        }
      } catch (err) {
        uploading.querySelector(".msg-text").textContent = "Upload failed: " + err.message;
      }
    });
  }

  // Speech recognition
  if (micBtn) {
    let recognition;
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SR();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (ev) => {
        const text = ev.results[0][0].transcript;
        userInput.value = text;
        sendMessage();
      };
      recognition.onerror = (ev) => {
        console.warn("Speech error", ev);
      };
    } else {
      micBtn.disabled = true;
      micBtn.title = "Speech recognition not supported in this browser";
    }

    micBtn.addEventListener("click", () => {
      if (!recognition) return;
      recognition.start();
    });
  }

  // Load history (channel-specific)
  async function loadHistory() {
    try {
      const hist = await fetchHistory(activeChannel);
      // hist expected: [{timestamp, text, analysis, from}]
      chatMessages.innerHTML = "";
      hist.forEach(item => {
        const who = item.from === "user" ? "you" : "RODA";
        const el = createMessageElement(who === "you" ? "you" : "RODA", `${item.text}${item.analysis ? "\n\n" + item.analysis : ""}`, { withTime: true });
        appendAndScroll(el);
      });
    } catch (err) {
      console.warn("Failed to load history:", err);
    }
  }

  // Initial load
  loadHistory();

});
