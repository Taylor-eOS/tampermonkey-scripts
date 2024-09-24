// ==UserScript==
// @name         Customize ChatGPT Response Formatting
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Remove lists from ChatGPT's responses after message generation is complete.
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const processMessage = (messageContainer) => {
        const container = messageContainer.querySelector('.markdown.prose');
        if (!container) return;

        // Formatting code here
        container.querySelectorAll('ol, ul').forEach(list => {
            if (!list.closest('code') && !list.closest('pre')) {
                const items = Array.from(list.querySelectorAll('li')).map(li => li.innerHTML).join('<br>');
                const lineBreak = document.createElement('div');
                lineBreak.innerHTML = items;
                list.replaceWith(lineBreak);
            }
        });

        container.querySelectorAll('p').forEach(paragraph => {
            paragraph.style.margin = '0';
            paragraph.style.padding = '0';
        });
    };

    const processWhenStable = (messageContainer) => {
        let timeoutId;

        const observer = new MutationObserver(() => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                observer.disconnect();
                processMessage(messageContainer);
            }, 500); // Wait 500ms after the last mutation
        });

        observer.observe(messageContainer, { childList: true, subtree: true });
    };

    const observeMessages = () => {
        const messageContainers = document.querySelectorAll('[data-message-author-role="assistant"]');
        messageContainers.forEach(messageContainer => {
            if (messageContainer.dataset.processed) return; // Avoid processing the same message multiple times
            messageContainer.dataset.processed = 'true';
            processWhenStable(messageContainer);
        });
    };

    const mainObserver = new MutationObserver(observeMessages);
    mainObserver.observe(document.body, { childList: true, subtree: true });

    // Initial call
    observeMessages();
})();
