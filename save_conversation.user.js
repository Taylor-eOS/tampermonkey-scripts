// ==UserScript==
// @name         Save Conversation
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Save the conversation as a .txt file
// @match        *chatgpt.com/*
// @match        *.deepseek.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const createDownloadButton = () => {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.top = '0px';
        button.style.left = '0px';
        button.style.width = '12px';
        button.style.height = '12px';
        button.style.backgroundColor = '#ececec';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.zIndex = 1000;
        button.style.cursor = 'pointer';
        button.addEventListener('click', saveConversation);
        document.body.appendChild(button);
    };
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

    window.addEventListener('load', createDownloadButton);
})();
