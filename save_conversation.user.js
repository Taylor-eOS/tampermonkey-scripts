// ==UserScript==
// @name         Save Conversation
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Save the conversation as a .txt file
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('SaveConv: Script injected');

    function capitalizeRole(role) {
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    function generateFileName(messages) {
        let raw = (document.querySelector('title') || {}).textContent || '';
        raw = raw.replace(/ - Grok$/i, '').trim().slice(0, 40);
        if (raw) return raw;
        if (!messages.length) return 'conversation';
        let firstWords = messages[0].text.split(/\s+/).slice(0, 5).join(' ');
        let snippet = firstWords.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '_').slice(0, 30);
        return snippet || 'conversation';
    }

    async function loadFullConversation() {
        console.log('SaveConv: Starting full load scroll');
        let lastHeight = document.body.scrollHeight;
        let unchanged = 0;
        const maxUnchanged = 3;
        const delayMs = 800;
        while (unchanged < maxUnchanged) {
            window.scrollTo(0, 0);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            const newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) unchanged++;
            else {
                unchanged = 0;
                lastHeight = newHeight;
            }
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
        const messageGroups = document.querySelectorAll('div[id^="response-"]');
        console.log('SaveConv: Found', messageGroups.length, 'message groups');
        const messages = [];
        const processedTexts = new Set();
        const uiArtifacts = ['Copy', 'Collapse', 'Wrap', 'Edit', 'Regenerate', 'Share', '📋', '🔗', '👍', '👎'];
        messageGroups.forEach(group => {
            let role = group.classList.contains('items-start') ? 'assistant' : (group.classList.contains('items-end') ? 'user' : null);
            if (!role) return;
            const bubble = group.querySelector('div.message-bubble');
            if (!bubble) return;
            let text = bubble.innerText.trim();
            text = text.split('\n').filter(line => {
                const trimmed = line.trim();
                return trimmed && !uiArtifacts.some(artifact => trimmed === artifact || trimmed.startsWith(artifact));
            }).join('\n').trim();
            if (role === 'assistant') {
                text = text.split('\n').filter(line => !line.trim().startsWith('Thought')).join('\n').trim();
            }
            if (text && text.length > 10 && !processedTexts.has(text)) {
                processedTexts.add(text);
                messages.push({ role: capitalizeRole(role), text });
            }
        });
        console.log('SaveConv: Extracted', messages.length, 'messages');
        if (!messages.length) {
            alert('No conversation found. Scroll up and try again. Check console for details.');
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
    const waitForBody = setInterval(() => {
        if (document.body) {
            clearInterval(waitForBody);
            createDownloadButton();
        }
    }, 500);
})();
