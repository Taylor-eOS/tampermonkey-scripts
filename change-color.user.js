// ==UserScript==
// @name         Change color and hide elements
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Applies styles intelligently to reduce CPU usage during streaming
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    // Styles that do not affect layout much — apply immediately
    const lightweightStyle = document.createElement('style');
    lightweightStyle.textContent = `
        :root {
            --color-bg-main: #d6f0ff;
            --color-bg-secondary: #ebf6f9;
        }
        body {
            background-color: var(--color-bg-main) !important;
        }
        .bg-token-sidebar-surface-primary.rounded-md {
            background-color: var(--color-bg-secondary) !important;
        }
        #page-header,
        .bg-token-main-surface-primary {
            background-color: var(--color-bg-main) !important;
        }
        .bg-token-bg-elevated-secondary.sticky.top-0 {
            background-color: var(--color-bg-main) !important;
            box-shadow: none !important;
        }
        aside, nav, .flex-col.w-full.max-w-xs {
            background-color: var(--color-bg-main) !important;
        }
    `;

    // Styles that might trigger layout recalculations — defer until idle
    const heavyStyle = document.createElement('style');
    heavyStyle.textContent = `
        .bg-token-bg-elevated-secondary.sticky.bottom-0 {
            display: none !important;
        }
        aside, nav, .flex-col.w-full.max-w-xs {
            padding-bottom: 0 !important;
        }
        #sora, #library,
        a[data-testid="sidebar-item-library"] {
            display: none !important;
        }
    `;

    let idleTimeout = null;
    let heavyApplied = false;

    function applyHeavyStyles() {
        if (heavyApplied) return;
        document.head.appendChild(heavyStyle);
        heavyApplied = true;
        console.log("Heavy styles applied after idle.");
    }

    function resetIdleTimer() {
        if (idleTimeout) clearTimeout(idleTimeout);
        idleTimeout = setTimeout(applyHeavyStyles, 1000);
    }

    function observeIdle() {
        const target = document.querySelector('main') || document.body;
        const observer = new MutationObserver(resetIdleTimer);
        observer.observe(target, { childList: true, subtree: true });
        resetIdleTimer(); // initial call in case no mutations happen
    }

    function init() {
        document.head.appendChild(lightweightStyle);
        observeIdle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
