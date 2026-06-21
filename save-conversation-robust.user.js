// ==UserScript==
// @name         Save ChatGPT Conversation with Confirmation
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Save ChatGPT conversation with filename based on content and visual confirmation.
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const initialize = () => {
        const existingButton = document.getElementById('save-conversation-button');
        if (existingButton) existingButton.remove();

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
        button.style.transition = 'background-color 0.3s ease';

        button.addEventListener('click', saveConversation);
        document.body.appendChild(button);
    };

    const observePageChanges = () => {
        const observer = new MutationObserver(() => {
            if (!document.getElementById('save-conversation-button')) {
                initialize();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const saveConversation = () => {
        const messages = [];
        const messageContainers = document.querySelectorAll('[data-message-id]');
        let defaultFilename = 'conversation';

        messageContainers.forEach((msgElement, index) => {
            const role = msgElement.getAttribute('data-message-author-role');
            let contentElement = msgElement.querySelector('.whitespace-pre-wrap') || msgElement.querySelector('.markdown');

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

                if (index === 0) {
                    // Use the first few words of the conversation as the filename
                    defaultFilename = formattedText.split(/\s+/).slice(0, 5).join(' ').replace(/[^a-zA-Z0-9_\-]/g, '_') || 'conversation';
                }

                messages.push(`${capitalizeRole(role)}:\n${formattedText}`);
            }
        });

        if (messages.length > 0) {
            const blob = new Blob([messages.join('\n\n---\n\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${defaultFilename}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Confirmation animation
            const button = document.getElementById('save-conversation-button');
            if (button) {
                button.style.backgroundColor = '#28a745'; // Green to indicate success
                setTimeout(() => {
                    button.style.backgroundColor = '#007bff'; // Back to original color
                }, 1000);
            }
        } else {
            alert('No conversation found to save.');
        }
    };

    const decodeHTMLEntities = (text) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    };

    const capitalizeRole = (role) => {
        if (role === 'user') {
            return 'User';
        } else if (role === 'assistant') {
            return 'Assistant';
        } else {
            return role.charAt(0).toUpperCase() + role.slice(1);
        }
    };

    initialize();
    observePageChanges();
})();
