// ==UserScript==
// @name         Save Conversation
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Save the conversation as a .txt file
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('SaveConv: Script injected');

    function capitalizeRole(role) {
        if (role === 'user') return 'User';
        if (role === 'assistant') return 'Assistant';
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    function generateFileName(messages) {
        let raw = (document.querySelector('title') || {}).textContent;
        if (raw) {
            let name = raw.replace(/ - Grok$/i, '').trim().slice(0, 40);
            return name || 'conversation';
        }
        let firstWords = messages[0].text.split(/\s+/).slice(0, 5).join(' ');
        let snippet = firstWords.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '_').slice(0, 30);
        return snippet || 'conversation';
    }

    async function loadFullConversation() {
        console.log('SaveConv: Starting full load scroll');
        let scrollAttempts = 0;
        let lastHeight = document.body.scrollHeight;
        let unchanged = 0;
        const maxAttempts = 20;
        const delay = 800;
        while (scrollAttempts < maxAttempts && unchanged < 3) {
            window.scrollTo(0, 0);
            await new Promise(resolve => setTimeout(resolve, 300));
            const newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) {
                unchanged++;
            } else {
                unchanged = 0;
                lastHeight = newHeight;
            }
            scrollAttempts++;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('SaveConv: Full load complete, height:', document.body.scrollHeight);
    }

    async function saveConversation() {
        if (isExporting) {
            console.log('SaveConv: Export already in progress');
            return;
        }
        isExporting = true;
        console.log('SaveConv: Save clicked');
        await loadFullConversation();
        const messageContainers = document.querySelectorAll(
            'div[class*="flex flex-col"][class*="items-"], ' +
            '[data-testid*="message"], ' +
            'div[role="row"]'
        );
        console.log('SaveConv: Found', messageContainers.length, 'potential message containers');
        const messages = [];
        let processedTexts = new Set();
        messageContainers.forEach(el => {
            if (el.tagName === 'TEXTAREA' || el.querySelector('textarea') || el.closest('.query-bar')) {
                return;
            }
            let role = el.classList.contains('items-start') ? 'assistant' : 'user';
            if (!el.classList.contains('items-start') && !el.classList.contains('items-end')) {
                role = el.getAttribute('data-role') || (el.innerText.includes('Grok:') ? 'assistant' : 'user');
            }
            let contentEl = el.querySelector('div.response-content-markdown, div.markdown, div.prose[dir="auto"], p.break-words[dir="auto"], div.message-bubble[dir="auto"]');
            let text = (contentEl ? contentEl.textContent : el.textContent).trim();
            if (role === 'assistant') {
                text = text.split('\n').filter(line => !line.trim().startsWith('Thought for')).join('\n').trim();
            }
            const uiArtifacts = ['Collapse', 'Wrap', 'Copy'];
            text = text.split('\n').filter(line => {
                const trimmed = line.trim();
                return !uiArtifacts.includes(trimmed);
            }).join('\n').trim();
            if (text.length > 20 && text.length < 20000 && !processedTexts.has(text)) {
                processedTexts.add(text);
                messages.push({ role: capitalizeRole(role), text });
            }
        });
        console.log('SaveConv: Extracted', messages.length, 'messages');
        if (!messages.length) {
            alert('No conversation found. Scroll up in chat and try again. Check console for details.');
            isExporting = false;
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
        console.log('SaveConv: Export complete');
        isExporting = false;
    }

    function createDownloadButton() {
        if (document.getElementById('save-conv-button')) return;
        console.log('SaveConv: Creating button');
        const btn = document.createElement('button');
        btn.id = 'save-conv-button';
        btn.title = 'Save conversation';
        btn.style.position = 'fixed';
        btn.style.top = '2px';
        btn.style.left = '2px';
        btn.style.width = '21px';
        btn.style.height = '21px';
        btn.style.backgroundColor = '#ececec';
        btn.style.borderRadius = '3px';
        btn.style.zIndex = '10000';
        btn.style.cursor = 'pointer';
        btn.style.border = 'none';
        btn.style.fontSize = '10px';
        btn.innerHTML = '📄';
        btn.addEventListener('click', saveConversation);
        document.body.appendChild(btn);
        console.log('SaveConv: Button created and appended');
    }

    let isExporting = false;
    console.log('SaveConv: Waiting for body');
    const waitForBody = setInterval(() => {
        if (document.body) {
            clearInterval(waitForBody);
            console.log('SaveConv: Body detected, creating button');
            createDownloadButton();
        }
    }, 500);
})();
