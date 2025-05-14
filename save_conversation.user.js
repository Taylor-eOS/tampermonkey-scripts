// ==UserScript==
// @name         Save Conversation
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Save the conversation as a .txt file
// @match        *chatgpt.com/*
// @match        *.deepseek.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function capitalizeRole(role) {
        if (role === 'user') return 'User';
        if (role === 'assistant') return 'Assistant';
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    function generateFileName(messages) {
        let pathParts = location.pathname.split('/').filter(Boolean);
        let threadId = pathParts[pathParts.length - 1] || 'conversation';
        let firstWords = messages[0].text.split(/\s+/).slice(0, 5).join(' ');
        let snippet = firstWords.toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '_')
            .slice(0, 30);
        return snippet;
    }

    function saveConversation() {
        const containers = document.querySelectorAll('[data-message-id]');
        const messages = [];
        containers.forEach(el => {
            const role = el.getAttribute('data-message-author-role');
            let content = el.querySelector('.whitespace-pre-wrap') || el.querySelector('.markdown');
            if (role && content) {
                let text = content.innerText.trim();
                messages.push({ role: capitalizeRole(role), text });
            }
        });
        if (!messages.length) {
            alert('No conversation found to save.');
            return;
        }
        const body = messages.map(m => `${m.role}:\n${m.text}`).join('\n\n---\n\n');
        const blob = new Blob([body], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateFileName(messages) + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function createDownloadButton() {
        if (document.getElementById('save-convo-button')) return;
        const btn = document.createElement('button');
        btn.id = 'save-convo-button';
        btn.title = 'Save conversation';
        btn.style.position = 'fixed';
        btn.style.top = '0';
        btn.style.left = '0';
        btn.style.width = '12px';
        btn.style.height = '30px';
        btn.style.backgroundColor = '#ececec';
        btn.style.borderRadius = '4px';
        btn.style.zIndex = 9999;
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', saveConversation);
        document.body.appendChild(btn);
    }

    const waitForBody = setInterval(() => {
        if (document.body && document.querySelector('[data-message-id]')) {
            clearInterval(waitForBody);
            createDownloadButton();
        }
    }, 500);
})();
