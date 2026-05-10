// ==UserScript==
// @name         Compact Paragraphs
// @namespace    local.chatgpt.compact
// @version      1.1
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
        .prose p {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }
        .prose ul,
        .prose ol {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }
        .prose li {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }
    `;

    document.head.appendChild(style);
})();
