async function interactWithChatGPT(messages) {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey = "<YOUR_PUBLIC_PROXY_KEY>"; 
    // ⚠️ Never embed real OpenAI API key here.
    // Use your own backend proxy to inject the key securely.

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages,
        }),
    });

    const result = await response.json();
    console.log(result.choices[0].message.content);
    return result.choices[0].message.content;
}

// Example usage
const conversation = [
    { role: "system", content: "You are RODA, a helpful assistant." },
    { role: "user", content: "Who won the world series in 2020?" },
];
interactWithChatGPT(conversation);
