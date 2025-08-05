/**
 * Chatbot IHM - Script de chargement
 * Ce script permet de charger facilement le chatbot sur n'importe quelle page web.
 */

;(() => {
  // Fonction pour charger le contenu du chatbot
  function loadChatbot() {
    // Charger le CSS du chatbot
    const chatbotStyles = document.createElement("style")
    chatbotStyles.textContent = `
      /* Styles du chatbot avec Grid */
      .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .chatbot-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00bcd4, #3f51b5);
        color: #fff;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px rgba(0, 188, 212, 0.3);
        transition: all 0.3s ease;
        z-index: 999;
      }

      .chatbot-toggle:hover {
        background: linear-gradient(135deg, #3f51b5, #00bcd4);
        transform: translateY(-3px) scale(1.03);
        box-shadow: 0 15px 30px rgba(0, 188, 212, 0.4);
      }

      .chatbot-box {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 280px;
        height: 400px;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        display: grid;
        grid-template-rows: auto 1fr auto;
        overflow: hidden;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px) scale(0.9);
        pointer-events: none;
      }

      .chatbot-box.active {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      .chatbot-header {
        padding: 15px;
        background: linear-gradient(135deg, #00bcd4, #3f51b5);
        color: #fff;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .chatbot-header h3 {
        margin: 0;
        font-weight: 500;
        font-size: 16px; /* Réduit de la taille par défaut */
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 20px; /* Réduit de 24px à 20px */
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }

      .chatbot-messages {
        padding: 15px; /* Réduit de 20px à 15px */
        overflow-y: auto;
        display: grid;
        grid-auto-rows: max-content;
        gap: 12px; /* Réduit de 15px à 12px */
        align-content: start;
      }

      .message {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px; /* Réduit de 10px à 8px */
        max-width: 85%; /* Augmenté de 80% à 85% pour utiliser plus d'espace */
      }

      .bot-message {
        justify-self: start;
      }

      .user-message {
        justify-self: end;
        grid-template-columns: 1fr auto;
      }

      .avatar {
        width: 30px; /* Réduit de 35px à 30px */
        height: 30px; /* Réduit de 35px à 30px */
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 14px; /* Réduit de 16px à 14px */
      }

      .bot-avatar {
        background-color: #f0f4ff;
      }

      .user-avatar {
        background: linear-gradient(135deg, #6e8efb, #a777e3);
        color: white;
      }

      .message-content {
        padding: 10px 12px; /* Réduit de 12px 15px à 10px 12px */
        border-radius: 15px; /* Réduit de 18px à 15px */
        font-size: 13px; /* Réduit de 14px à 13px */
        line-height: 1.4;
        align-self: center;
      }

      .bot-message .message-content {
        background-color: #f0f4ff;
        border-top-left-radius: 5px;
      }

      .user-message .message-content {
        background: linear-gradient(135deg, #6e8efb, #a777e3);
        color: white;
        border-top-right-radius: 5px;
      }

      .chatbot-input-container {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px; /* Réduit de 10px à 8px */
        padding: 12px; /* Réduit de 15px à 12px */
        border-top: 1px solid #eaeaea;
        background-color: #f9f9f9;
      }

      #chatbot-input {
        padding: 10px 12px; /* Réduit de 12px 15px à 10px 12px */
        border: 1px solid #ddd;
        border-radius: 20px; /* Réduit de 25px à 20px */
        outline: none;
        font-size: 13px; /* Réduit de 14px à 13px */
        transition: border 0.3s ease;
      }

      #chatbot-input:focus {
        border-color: #a777e3;
      }

      #chatbot-send {
        background: linear-gradient(135deg, #6e8efb, #a777e3);
        color: white;
        border: none;
        width: 35px; /* Réduit de 40px à 35px */
        height: 35px; /* Réduit de 40px à 35px */
        border-radius: 50%;
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: all 0.3s ease;
      }

      #chatbot-send:hover {
        transform: scale(1.1);
      }

      #chatbot-send svg {
        width: 16px; /* Réduit de 18px à 16px */
        height: 16px; /* Réduit de 18px à 16px */
      }

      .typing-indicator {
        display: grid;
        grid-template-columns: repeat(3, 6px); /* Réduit de 8px à 6px */
        gap: 4px; /* Réduit de 5px à 4px */
        padding: 10px 12px; /* Réduit de 12px 15px à 10px 12px */
        background-color: #f0f4ff;
        border-radius: 15px; /* Réduit de 18px à 15px */
        border-top-left-radius: 5px;
        justify-content: start;
      }

      .typing-indicator span {
        height: 6px; /* Réduit de 8px à 6px */
        background-color: #a777e3;
        border-radius: 50%;
        display: block;
        animation: typing 1.3s infinite ease-in-out;
      }

      .typing-indicator span:nth-child(1) {
        animation-delay: 0s;
      }

      .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-4px); /* Réduit de -5px à -4px */
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .message {
        animation: fadeIn 0.3s ease forwards;
      }

      .suggestions-container {
        display: grid;
        gap: 6px; /* Réduit de 8px à 6px */
      }

      .suggestions-list {
        display: grid;
        gap: 4px; /* Réduit de 5px à 4px */
        padding-left: 15px; /* Réduit de 20px à 15px */
        margin-top: 6px; /* Réduit de 8px à 6px */
        margin-bottom: 0;
      }

      .suggestion-item {
        cursor: pointer;
        color: #6e8efb;
        transition: color 0.2s ease;
        font-size: 12px; /* Réduit de la taille par défaut */
      }

      .suggestion-item:hover {
        color: #a777e3;
        text-decoration: underline;
      }
    `
    document.head.appendChild(chatbotStyles)

    // Créer la structure HTML du chatbot
    const chatbotHTML = `
      <div class="chatbot-container">
        <div class="chatbot-toggle" id="chatbot-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chatbot-icon">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>

        <div class="chatbot-box" id="chatbot-box">
          <div class="chatbot-header">
            <h3>Assistant Virtuel</h3>
            <button class="close-btn" id="chatbot-close">×</button>
          </div>
          
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="message bot-message">
              <div class="avatar bot-avatar">🤖</div>
              <div class="message-content">Bonjour ! Comment puis-je vous aider aujourd'hui ?</div>
            </div>
          </div>
          
          <div class="chatbot-input-container">
            <input type="text" id="chatbot-input" placeholder="Écrivez votre message ici..." />
            <button id="chatbot-send">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `

    // Ajouter le HTML du chatbot au document
    const chatbotContainer = document.createElement("div")
    chatbotContainer.innerHTML = chatbotHTML
    document.body.appendChild(chatbotContainer.firstElementChild)

    // Initialiser le chatbot
    initChatbot()
  }

  // Fonction d'initialisation du chatbot
  function initChatbot() {
    // Éléments du DOM
    const chatbotToggle = document.getElementById("chatbot-toggle")
    const chatbotBox = document.getElementById("chatbot-box")
    const chatbotClose = document.getElementById("chatbot-close")
    const chatbotMessages = document.getElementById("chatbot-messages")
    const chatbotInput = document.getElementById("chatbot-input")
    const chatbotSend = document.getElementById("chatbot-send")

    // Réponses prédéfinies du chatbot
    const botResponses = [
      "Je suis là pour vous aider. Que souhaitez-vous savoir ?",
      "Bien sûr, je peux vous aider avec ça !",
      "Pouvez-vous me donner plus de détails ?",
      "Voici une solution possible à votre problème...",
      "N'hésitez pas à me poser d'autres questions !",
      "Je recherche cette information pour vous...",
      "Merci pour votre question. Voici ce que je peux vous dire à ce sujet...",
      "C'est une excellente question !",
      "Je comprends votre préoccupation. Voici ce que je suggère...",
    ]

    // Fonction pour ouvrir/fermer le chatbot
    chatbotToggle.addEventListener("click", () => {
      chatbotBox.classList.toggle("active")
    })

    chatbotClose.addEventListener("click", () => {
      chatbotBox.classList.remove("active")
    })

    // Fonction pour ajouter un message
    function addMessage(content, isUser = false) {
      const messageDiv = document.createElement("div")
      messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`

      const avatar = document.createElement("div")
      avatar.className = `avatar ${isUser ? "user-avatar" : "bot-avatar"}`
      avatar.textContent = isUser ? "👤" : "🤖"

      const messageContent = document.createElement("div")
      messageContent.className = "message-content"
      messageContent.textContent = content

      if (isUser) {
        messageDiv.appendChild(messageContent)
        messageDiv.appendChild(avatar)
      } else {
        messageDiv.appendChild(avatar)
        messageDiv.appendChild(messageContent)
      }

      chatbotMessages.appendChild(messageDiv)
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight
    }

    // Fonction pour afficher l'indicateur de typing
    function showTypingIndicator() {
      const typingDiv = document.createElement("div")
      typingDiv.className = "message bot-message"
      typingDiv.id = "typing-indicator"

      const avatar = document.createElement("div")
      avatar.className = "avatar bot-avatar"
      avatar.textContent = "🤖"

      const typingIndicator = document.createElement("div")
      typingIndicator.className = "typing-indicator"

      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span")
        typingIndicator.appendChild(dot)
      }

      typingDiv.appendChild(avatar)
      typingDiv.appendChild(typingIndicator)

      chatbotMessages.appendChild(typingDiv)
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight
    }

    // Fonction pour supprimer l'indicateur de typing
    function removeTypingIndicator() {
      const typingIndicator = document.getElementById("typing-indicator")
      if (typingIndicator) {
        typingIndicator.remove()
      }
    }

    // Fonction pour obtenir une réponse du bot
    function getBotResponse(userMessage) {
      // Logique simple de réponse basée sur des mots-clés
      userMessage = userMessage.toLowerCase()

      if (userMessage.includes("bonjour") || userMessage.includes("salut")) {
        return "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
      } else if (userMessage.includes("merci")) {
        return "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?"
      } else if (userMessage.includes("aide") || userMessage.includes("help")) {
        return "Je suis là pour vous aider. Posez-moi une question spécifique et je ferai de mon mieux pour y répondre."
      } else if (userMessage.includes("fonctionnalité") || userMessage.includes("feature")) {
        return "Notre site offre plusieurs fonctionnalités intéressantes. Quelle fonctionnalité vous intéresse particulièrement ?"
      } else if (userMessage.includes("contact")) {
        return "Vous pouvez nous contacter par email à contact@example.com, par téléphone au 01 23 45 67 89, ou accéder directement à notre page Contact pour nous envoyer un message via notre formulaire."
      } else if (userMessage.includes("prix") || userMessage.includes("tarif")) {
        return "Nos tarifs varient selon les services. Pourriez-vous préciser quel service vous intéresse ?"
      } else {
        // Réponse aléatoire si aucun mot-clé n'est détecté
        return botResponses[Math.floor(Math.random() * botResponses.length)]
      }
    }

    // Fonction pour envoyer un message
    function sendMessage() {
      const userMessage = chatbotInput.value.trim()

      if (userMessage !== "") {
        // Ajouter le message de l'utilisateur
        addMessage(userMessage, true)
        chatbotInput.value = ""

        // Afficher l'indicateur de typing
        showTypingIndicator()

        // Simuler un délai de réponse
        setTimeout(
          () => {
            // Supprimer l'indicateur de typing
            removeTypingIndicator()

            // Obtenir et afficher la réponse du bot
            const botResponse = getBotResponse(userMessage)
            addMessage(botResponse)
          },
          1000 + Math.random() * 1000,
        ) // Délai aléatoire entre 1 et 2 secondes
      }
    }

    // Événement pour envoyer un message
    chatbotSend.addEventListener("click", sendMessage)

    chatbotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    })

    // Fonction pour ajouter des suggestions de questions
    function addSuggestions() {
      const suggestions = [
        "Comment puis-je vous aider ?",
        "Quelles sont vos fonctionnalités ?",
        "Comment vous contacter ?",
      ]

      const suggestionsDiv = document.createElement("div")
      suggestionsDiv.className = "message bot-message"

      const avatar = document.createElement("div")
      avatar.className = "avatar bot-avatar"
      avatar.textContent = "🤖"

      const suggestionsContent = document.createElement("div")
      suggestionsContent.className = "message-content suggestions-container"
      suggestionsContent.innerHTML = "Voici quelques questions que vous pourriez me poser :"

      const suggestionsList = document.createElement("ul")
      suggestionsList.className = "suggestions-list"

      suggestions.forEach((suggestion) => {
        const item = document.createElement("li")
        item.className = "suggestion-item"
        item.textContent = suggestion

        item.addEventListener("click", () => {
          chatbotInput.value = suggestion
          sendMessage()
        })

        suggestionsList.appendChild(item)
      })

      suggestionsContent.appendChild(suggestionsList)
      suggestionsDiv.appendChild(avatar)
      suggestionsDiv.appendChild(suggestionsContent)

      chatbotMessages.appendChild(suggestionsDiv)
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight
    }

    // Ajouter des suggestions après un court délai
    setTimeout(addSuggestions, 1000)
  }

  // Charger le chatbot quand la page est complètement chargée
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadChatbot)
  } else { 
    loadChatbot()
  } 
})()
