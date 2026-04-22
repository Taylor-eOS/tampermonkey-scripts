// ==UserScript==
// @name         Save Conversation
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Save full conversation by accumulating visible messages
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

    function getMessageRoots() {
        return Array.from(document.querySelectorAll('[data-message-author-role="user"], [data-message-author-role="assistant"]'));
    }

    function extractText(root) {
        const clone = root.cloneNode(true);
        clone.querySelectorAll('button, [role="button"], [aria-label]').forEach(el => el.remove());
        return (clone.innerText || '').trim();
    }

    async function collectAllMessages() {
        const scroller = document.scrollingElement || document.documentElement;

        const seen = new Set();
        const ordered = [];

        let stableRounds = 0;

        while (stableRounds < 6) {
            const beforeCount = seen.size;

            const nodes = getMessageRoots();

            for (const node of nodes) {
                if (seen.has(node)) continue;
                seen.add(node);

                const role = node.getAttribute('data-message-author-role');
                const text = extractText(node);

                if (!text) continue;

                ordered.push({
                    role: capitalizeRole(role),
                    text: text,
                    top: node.getBoundingClientRect().top
                });
            }

            scroller.scrollTop -= scroller.clientHeight * 0.8;
            if (scroller.scrollTop < 0) scroller.scrollTop = 0;

            await sleep(400);

            if (seen.size === beforeCount) stableRounds++;
            else stableRounds = 0;
        }

        ordered.sort((a, b) => a.top - b.top);

        return ordered.map(m => `${m.role}:\n${m.text}`).join('\n\n---\n\n');
    }

    async function saveConversation() {
        if (isExporting) return;
        isExporting = true;

        try {
            const text = await collectAllMessages();

            if (!text) {
                alert('No messages found.');
                return;
            }

            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'conversation.txt';

            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);

        } finally {
            isExporting = false;
        }
    }

    function createButton() {
        if (document.getElementById('save-conv-button')) return;

        const btn = document.createElement('button');
        btn.id = 'save-conv-button';
        btn.textContent = '📄';

        btn.style.position = 'fixed';
        btn.style.top = '2px';
        btn.style.left = '2px';
        btn.style.width = '28px';
        btn.style.height = '28px';
        btn.style.background = '#ececec';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.zIndex = '10000';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', saveConversation);

        document.body.appendChild(btn);
    }

    const wait = setInterval(() => {
        if (document.body) {
            clearInterval(wait);
            createButton();
        }
    }, 300);

})();
