// ==UserScript==
// @name         Change Color and remove elements
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Customize background and layout
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --color-bg-main: #cff0f3;
            --color-bg-secondary: #ebf6f9;
        }
        body {
            background-color: var(--color-bg-main) !important;
        }
        aside, nav, .flex-col.w-full.max-w-xs {
            background-color: var(--color-bg-main) !important;
            height: 100vh !important;
            padding-bottom: 0 !important;
        }
        .bg-token-sidebar-surface-primary.rounded-md {
            background-color: var(--color-bg-secondary) !important;
        }
        .bg-token-bg-elevated-secondary.sticky.bottom-0 {
            display: none !important;
        }
        #page-header,
        .bg-token-main-surface-primary {
            background-color: var(--color-bg-main) !important;
        }
        .bg-token-bg-elevated-secondary.sticky.top-0 {
            background-color: var(--color-bg-main) !important;
            box-shadow: none !important;
        }
        #sora {
            display: none !important;
        }
        #library {
            display: none !important;
        }
        a[data-testid="sidebar-item-library"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
