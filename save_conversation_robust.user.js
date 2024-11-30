// ==UserScript==
// @name         Save ChatGPT Conversation Robust
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Save ChatGPT conversation as a .txt file with better stability.
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Initialize the script
    const initialize = () => {
        // Remove existing button to prevent duplication
        const existingButton = document.getElementById('save-conversation-button');
        if (existingButton) existingButton.remove();

        // Create the download button
        const button = document.createElement('button');
        button.id = 'save-conversation-button';
        button.textContent = '💾 Save';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = 1000;

        button.addEventListener('click', saveConversation);
        document.body.appendChild(button);
    };

    // Observe page content changes to re-initialize
    const observePageChanges = () => {
        const observer = new MutationObserver(() => {
            if (!document.getElementById('save-conversation-button')) {
                initialize();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Save the conversation
    const saveConversation = () => {
        const messages = [];
        const messageContainers = document.querySelectorAll('[data-message-id]');

        messageContainers.forEach(msgElement => {
            const role = msgElement.getAttribute('data-message-author-role');

            // Try to find the content element for both user and assistant
            let contentElement = msgElement.querySelector('.whitespace-pre-wrap');
            if (!contentElement) {
                contentElement = msgElement.querySelector('.markdown');
            }

            if (role && contentElement) {
                const htmlContent = contentElement.innerHTML;

                let formattedText = htmlContent
                    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```')
                    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
                    .replace(/<li>([\s\S]*?)<\/li>/gi, '- $1')
                    .replace(/<p[^>]*>/gi, '')
                    .replace(/<\/p>/gi, '\n\n')
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .trim();

                formattedText = decodeHTMLEntities(formattedText);

                messages.push(`${capitalizeRole(role)}:\n${formattedText}`);
            }
        });

        if (messages.length > 0) {
            const blob = new Blob([messages.join('\n\n---\n\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'conversation.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('No conversation found to save.');
        }
    };

    // Decode HTML entities
    const decodeHTMLEntities = (text) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    };

    // Capitalize role
    const capitalizeRole = (role) => {
        if (role === 'user') {
            return 'User';
        } else if (role === 'assistant') {
            return 'Assistant';
        } else {
            return role.charAt(0).toUpperCase() + role.slice(1);
        }
    };

    // Initialize and observe page changes
    initialize();
    observePageChanges();
})();
