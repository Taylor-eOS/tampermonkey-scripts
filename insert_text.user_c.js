// ==UserScript==
// @name         Save Conversation (ChatGPT)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Save the conversation as a .txt file
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let isExporting = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function capitalizeRole(role) {
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    function generateFileName(messages) {
        let raw = document.title || '';
        raw = raw.replace(/\s*[-|]\s*ChatGPT\s*$/i, '').trim().slice(0, 45);
        if (raw) return raw;
        if (!messages.length) return 'conversation';
        const firstWords = messages[0].text.split(/\s+/).slice(0, 5).join(' ');
        const snippet = firstWords
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '_')
            .slice(0, 30);
        return snippet || 'conversation';
    }

    function getMessageRoots() {
        const all = Array.from(document.querySelectorAll('[data-message-author-role="user"], [data-message-author-role="assistant"]'));
        return all.filter(el => el.closest('[data-message-author-role]') === el);
    }

    function extractTextFromMessage(root) {
        const clone = root.cloneNode(true);
        clone.querySelectorAll('button, [role="button"], [aria-label="Response actions"]').forEach(el => el.remove());
        const text = clone.innerText || '';
        return text.replace(/\n{3,}/g, '\n\n').trim();
    }

    async function ensureFullyRendered() {
        const scroller = document.scrollingElement || document.documentElement;
        let lastCount = -1;
        let stable = 0;
        while (stable < 3) {
            const before = getMessageRoots().length;
            scroller.scrollTop = 0;
            await sleep(600);
            const after = getMessageRoots().length;
            if (after === lastCount) stable++;
            else stable = 0;
            lastCount = after;
        }
    }

    async function saveConversation() {
        if (isExporting) return;
        isExporting = true;
        try {
            await ensureFullyRendered();
            const roots = getMessageRoots();
            const messages = [];
            for (const root of roots) {
                const role = root.getAttribute('data-message-author-role');
                if (role !== 'user' && role !== 'assistant') continue;
                const text = extractTextFromMessage(root);
                if (!text) continue;
                messages.push({
                    role: capitalizeRole(role),
                    text: text
                });
            }
            if (!messages.length) {
                alert('No conversation found.');
                return;
            }
            const body = messages
                .map(m => `${m.role}:\n${m.text}`)
                .join('\n\n---\n\n');
            const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = generateFileName(messages) + '.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } finally {
            isExporting = false;
        }
    }

    function createDownloadButton() {
        if (document.getElementById('save-conv-button')) return;
        const btn = document.createElement('button');
        btn.id = 'save-conv-button';
        btn.textContent = '📄';
        btn.title = 'Save conversation';
        btn.style.position = 'fixed';
        btn.style.top = '2px';
        btn.style.left = '2px';
        btn.style.width = '28px';
        btn.style.height = '28px';
        btn.style.backgroundColor = '#ececec';
        btn.style.borderRadius = '4px';
        btn.style.zIndex = '10000';
        btn.style.cursor = 'pointer';
        btn.style.border = 'none';
        btn.style.fontSize = '16px';
        btn.addEventListener('click', saveConversation);
        document.body.appendChild(btn);
    }

    const waitForBody = setInterval(() => {
        if (document.body) {
            clearInterval(waitForBody);
            createDownloadButton();
        }
    }, 500);
})();
