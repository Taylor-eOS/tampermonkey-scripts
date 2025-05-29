// ==UserScript==
// @name         Lightweight Background Color Override
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Apply minimal background color override
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.textContent = `
        html, body {
            background-color: #d6f0ff !important;
        }
        main, section, article {
            background-color: transparent !important;
        }
        aside, nav {
            background-color: #d6f0ff !important;
        }
        [style*="background-color: white"],
        [style*="background-color: #fff"],
        [style*="background-color: rgb(255, 255, 255)"] {
            background-color: #d6f0ff !important;
        }
    `;
    document.head.appendChild(style);
})();

(function() {
    const observer = new MutationObserver(() => {
        const el = document.querySelector('.bg-token-bg-elevated-secondary.sticky.bottom-0');
        if (el) {
            el.remove();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Optional: auto-disconnect after a delay if the target stays gone
    setTimeout(() => {
        if (!document.querySelector('.bg-token-bg-elevated-secondary.sticky.bottom-0')) {
            observer.disconnect();
        }
    }, 3000);
})();
