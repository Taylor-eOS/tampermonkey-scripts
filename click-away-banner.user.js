// ==UserScript==
// @name         Click Away Banner
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Close banners automatically
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL_MS = 5000;
    const SNIPPET = 'Want to keep using';

    function checkAndClick() {
        let h3s = document.getElementsByTagName('h3');
        for (let i = 0; i < h3s.length; i++) {
            let t = h3s[i].textContent;
            if (!t) continue;
            if (t.includes(SNIPPET)) {
                let bannerDiv = h3s[i].closest('div.flex.h-full.w-full.gap-3');
                if (!bannerDiv) return;
                let btn = bannerDiv.querySelector('button[data-testid="close-button"][aria-label="Close"]');
                if (btn) {
                    try {
                        btn.click();
                    } catch(e) {}
                }
                return;
            }
        }
    }

    const initialDelay = Math.floor(Math.random() * INTERVAL_MS);
    setTimeout(() => {
        checkAndClick();
        setInterval(checkAndClick, INTERVAL_MS);
    }, initialDelay);
})();
