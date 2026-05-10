// ==UserScript==
// @name         Compact Paragraphs
// @namespace    local.chatgpt.compact
// @version      1.0
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
        .prose p {
            margin-top: 0.15em !important;
            margin-bottom: 0.15em !important;
            line-height: 1.35 !important;
        }
        .prose ul,
        .prose ol {
            margin-top: 0.25em !important;
            margin-bottom: 0.25em !important;
        }
        .prose li {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }
        .prose pre {
            margin-top: 0.4em !important;
            margin-bottom: 0.4em !important;
        }
    `;
    document.head.appendChild(style);
})();
