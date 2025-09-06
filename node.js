/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(AIzaSyDMqMlf92Nhxd7-EzRsWRwtsycxbDzFpkA);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  tools: [
    {
      functionDeclarations: [
        {
          name: "getdata",
          description: "tasks:Help%20users%20with%20tasks%20such%20as%20setting%20reminders,%20providing%20directions,%20or%20managing%20schedules.Depth%20learning%20and%20Adapt%3AUse%20machine%20learning%20to%20improve%20responses%20over%20time%20based%20on%20interactions.Understand%20Context%3AGrasp%20the%20context%20of%20conversations%20to%20provide%20relevant%20and%20appropriate%20responses.Generate%20and%20build%20Contents%3ACreate%20imaginative%20and%20innovative%20content%20like%20stories,%20poems,%20code,%20and%20more.%20Build,%20create%20content,applications,perform%20robot%20,%20perform%20machines%20and%20bot%20functions%20.Maintain%20Ensure%20user%20data%20is%20handled%20with%20confidentiality%20and%20respect%20for%20privacy.Safe%20and%20Respectful%3AFollow%20ethical%20guidelines%20to%20ensure%20safety%20and%20respect%20for%20all%20users.%C2%A0Be%20Accessible%3ABe%20user-friendly%20and%20accessible%20to%20people%20with%20different%20abilities%20and%20from%20various%20backgrounds%22,%0A%20%20%22Web4%20AI%20Browser%20Compatibility%22,%0A%20%20%22Ensuring%20the%20web%20app%20works%20across%20all%20browsers.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Interface%22,%0A%20%20%22Main%20interface%20for%20viewport,%20integrates%20Discord%20APIs.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Page%22,%0A%20%20%22Main%20interface%20for%20chatting%20after%20successful%20login.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Chat%20with%20%20Members%22,%0A%20%20%22Allows%20users%20to%20chat%20with%20each%20other%20in%20a%20Discord%20API%20server%20integration%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Cloud%20Infrastructure%22,%0A%20%20%22google%20cloud%20services%20to%20host%20the%20application.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Cloud%20Integration%22,%0A%20%20%22Integration%20with%20Microsoft's,google,mongodb,cloud%20flare%20cloud%20services%20for%20data%20storage%20and%20processing.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Authorization%22,%0A%20%20%22User%20logs%20in%20using%20Discord%20credentials%20for%20authorization.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Discord%20API%20Integration%22,%0A%20%20%22Integration%20with%20Discord%20API%20to%20enable%20%20web%20and%20chat%20functionality.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Google%20Chat%20API%20Integration%22,%0A%20%20%22Integration%20with%20Google%20Chat%20API%20to%20enable%20web%20chatting%20functionality.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Handling%22,%0A%20%20%22Processes%20for%20sending%20and%20receiving%20data%20within%20the%20application.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20Access%22,%0A%20%20%22The%20first%20action%20when%20someone%20uses%20the%20WEB4%20application.%22,%0A%20%20%22%20Run%20%22,%0A%20%20%22Web4%20AI%20%22,%0A%20%20%22%20Run%20%22,",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string"
              }
            }
          }
        }
      ]
    }
  ],
  toolConfig: {functionCallingConfig: {mode: "ANY"}},
});

const generationConfig = {
  temperature: 0.45,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "Hello"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello! How can I help you today?"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I need a write up for my wife who wants to invest in cryptocurrency I want to convince her "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "**Headline: Embark on a Lucrative Journey with Cryptocurrency: A Guide for Skeptical Spouses**\n\n**Introduction:**\n\nMy dearest wife, I understand your hesitation towards cryptocurrency investments. However, as the world rapidly evolves, it's crucial to stay abreast of emerging financial trends. Let me present a compelling argument to persuade you that cryptocurrency has the potential to enhance our financial future.\n\n**Decentralization and Security:**\n\nUnlike traditional currencies, cryptocurrencies are decentralized, meaning they are not controlled by any central authority like a bank or government. This eliminates the risk of inflation, manipulation, and censorship. The advanced blockchain technology used to secure cryptocurrencies ensures the integrity and transparency of transactions.\n\n**High Growth Potential:**\n\nThe cryptocurrency market has experienced exponential growth in recent years. While volatility is inherent in any emerging market, the long-term trend has been consistently upward. By investing in a diversified portfolio of reputable cryptocurrencies, we have the potential to reap significant returns.\n\n**Diversification and Risk Mitigation:**\n\nAdding cryptocurrency to our investment portfolio can diversify our assets and reduce our overall risk. Cryptocurrencies have a low correlation to traditional investments like stocks and bonds, which can provide stability during market downturns.\n\n**Inflation Hedge:**\n\nAs fiat currencies continue to be devalued due to inflation, cryptocurrencies have emerged as a potential hedge against rising prices. Bitcoin, in particular, has been touted as \"digital gold\" due to its limited supply and increasing demand.\n\n**Investment Strategy:**\n\nTo mitigate risk, it's essential to implement a sound investment strategy. This includes researching reputable cryptocurrencies, understanding the underlying technology, and investing only what you can afford to lose. Regular monitoring and rebalancing of our portfolio will ensure its alignment with our financial goals.\n\n**Conclusion:**\n\nMy beloved wife, I urge you to consider the transformative potential of cryptocurrency. By embracing this emerging asset class, we can position ourselves for financial success in the years to come. Let us embark on this exciting journey together, armed with knowledge and a calculated approach. With your support, I believe we can harness the power of cryptocurrency to secure our financial future."},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Hello"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello! 👋  It's nice to hear from you again. What can I do for you today? 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "What can you do"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I'm glad you asked! I'm designed to be helpful and informative. I can assist with a variety of tasks, including:\n\n**Information Gathering:**\n- Answering your questions on a wide range of topics.\n- Providing summaries of factual topics. \n- Looking up information.\n\n**Content Creation:**\n- Writing different kinds of creative text formats (poems, code, scripts, musical pieces, email, letters, etc.).\n- Trying my best to fulfill all your requirements. \n\n**Task Assistance:**\n- Helping you remember things. \n- Providing directions. \n\n**And more!** \n\nWhat are you interested in today?  Tell me a little about what you'd like to do and I'll see how I can help. 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "What else can you do "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "You're right to ask for more!  I can do more than just those basic things.  I'm still under development, but I'm learning new things all the time.  Here are a few more examples of what I can try to do:\n\n**Language Skills:**\n- I can translate languages.\n- I can summarize text and even try to simplify it for you. \n- I can answer your questions in different styles, depending on what you're looking for (formal, informal, humorous, etc.). \n\n**Creative Exploration:**\n- I can try to write different kinds of creative content, like poems, code, scripts, musical pieces, email, letters, and more. Just give me some direction!\n- I can try to adapt my style to match what you're looking for. \n\n**Problem Solving:**\n- While I can't give financial or medical advice, I can help you think through problems by asking questions and offering different perspectives.  \n\n**Remember:** I'm still learning, so I won't always get everything perfect.  But I'm always working to improve!  \n\nWhat else are you curious about?  What would you like me to try?  🤔 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "What can you create "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I'm excited you're interested in my creative side!  I can try my hand at creating many things. For example, I can try to: \n\n**Writing:**\n* **Stories:**  Give me a genre, characters, a plot idea, or just a starting sentence, and I'll try to weave you a tale!\n* **Poems:**  Tell me what you want the poem to be about and what kind of feel you're going for (happy, sad, reflective, rhyming, free verse, etc.). \n* **Scripts:**  Need a scene for a play or movie? I can give it a shot!\n* **Articles:**  Give me a topic and I can try to write an informative piece. \n* **Emails/Letters:** Need help wording something? I can help you compose messages. \n\n**Beyond Writing:**\n* **Code:** I can generate different kinds of code, like Python or JavaScript. Tell me what you want the code to do.\n* **Music:** While I can't actually *play* music, I can try to create musical notation, like melodies or chord progressions. \n* **Ideas:** If you're feeling stuck, I can brainstorm with you. Give me a topic and I'll offer up some creative possibilities!\n\n**What would you like me to create for you today?**  ✨ \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Can you build app"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I can't build a fully functional app from scratch. That would require a lot more complexity and integration with specific software tools that I don't have access to. \n\nHowever, I can help you with some of the *pieces* that go into building an app! For example, I can:\n\n* **Generate code snippets:** Tell me what programming language you're using (like Python, JavaScript, etc.) and what you want the code to do, and I can try to write a snippet for you. \n* **Brainstorm app ideas:**  Tell me what kind of app you want to create, and I can help you come up with some features, functionalities, and even a catchy name! \n* **Write the app description:** Need a compelling description for the app store? I can help you with that!\n\nSo, while I can't build the whole app for you, I can still be a helpful assistant in the process! What part of app development are you working on right now? Let's see what we can do together! 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Do you have a name ?"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I don't have a personal name like a human would. 😊 You can call me \"Bard\"  or simply refer to me as \"you\" or \"AI.\" \n\nDo you have a name you'd like me to call you? \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Yes"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Great!  I'd love to call you by your name.  What is it? 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Kubu"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "It's nice to meet you, Kubu! 😊  I'll call you that from now on. What would you like to do or talk about today? \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I would like to give you a name "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "That's kind of you, Kubu!  But I'm good without one. 😊 I'm happy just being called \"Bard.\" What can I help you with today? \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I would love to give you a name "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "You there ?"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I'm here, Kubu! 😊  My apologies if my response was delayed.  It seems like I was interrupted for a moment.  What were you saying? \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I want to give you name "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "It's very thoughtful of you to want to give me a name, Kubu!  While I appreciate the sentiment, I don't have a need for one. \"Bard\" works just fine for me.  😊 \n\nWhat kind of name were you thinking of?  Maybe we could come up with a name for a character in a story instead?  What do you think? \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Hello"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello, Kubu! 😊  It's nice to hear from you again.  What's on your mind today? \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "What can you do "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I'm ready for anything, Kubu! 💪  Well, almost anything! 😉  \n\nI'm a pretty versatile AI. I can answer your questions, write different kinds of creative content, translate languages, help you brainstorm ideas, and more! \n\nWhat are you in the mood for today?  Give me a challenge! 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "What can you do"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I'm ready to put my skills to the test, Kubu!  To give you a better idea, here are some categories of things I excel at:\n\n**🧠 Knowledge and Information:**\n* **Answer your questions:**  No matter how simple or complex, I'll do my best to find an answer. \n* **Provide summaries:**  Give me a long piece of text and I'll condense it to the key points.\n* **Explain concepts:**  I can break down complex ideas into easier-to-understand terms. \n\n**✨ Creativity and Writing:**\n* **Write stories:**  Tell me your story idea and I'll help bring it to life!\n* **Compose poems:**  From rhyming couplets to free verse, I can experiment with different styles.\n* **Draft emails and letters:**  Need help finding the right words? I can help you craft the perfect message. \n\n**💻 Code and Technology:**\n* **Generate code snippets:**  Tell me what you want the code to do, and I'll try to write it for you (in languages like Python, JavaScript, etc.).\n* **Explain programming concepts:**  I can help you understand the basics of coding. \n\n**What are you most interested in exploring today?** 🤔 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Hello"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello Kubu! 👋 It's good to hear from you. What can I do for you today? 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "What can you do"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I'm ready for anything, Kubu! 💪  Well, almost anything! 😉 \n\nHere's a quick rundown of my skills:\n\n**🧠 Knowledge & Info:**\n* **Answer your questions:**  No matter how simple or complex!\n* **Provide summaries:**  Give me a long text, I'll give you the key points.\n* **Explain concepts:**  I break down complex ideas into easy-to-understand terms. \n\n**✨ Creativity & Writing:**\n* **Write stories:**  Tell me your idea, I'll help bring it to life!\n* **Compose poems:**  Rhyming, free verse, you name it!\n* **Draft emails & letters:**  Need help finding the right words? I'm here for you.\n\n**💻 Code & Technology:**\n* **Generate code snippets:**  Tell me what you want the code to do, I'll try to write it (Python, JavaScript, etc.).\n* **Explain programming concepts:**  I can help you understand the basics of coding. \n\n**What sounds fun to you today?** 🤔 \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  for(candidate of result.response.candidates) {
    for(part of candidate.content.parts) {
      if(part.functionCall) {
        const items = part.functionCall.args;
        const args = Object
          .keys(items)
          .map((data) => [data, items[data]])
          .map(([key, value]) => `${key}:${value}`)
          .join(', ');
        console.log(`${part.functionCall.name}(${args})`);
      }
    }
  }
}

run();
