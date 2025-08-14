// ==UserScript==
// @name         Click Away Banner
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Check every few seconds if there is a banner to close
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL_MS = 3000;
    const SNIPPET = 'hit the free plan limit';

    function checkAndClick() {
        let h3s = document.getElementsByTagName('h3');
        for (let i = 0; i < h3s.length; i++) {
            let t = h3s[i].textContent;
            if (!t) continue;
            if (t.toLowerCase().includes(SNIPPET)) {
                let btn = document.querySelector('[data-testid="close-button"]');
                if (btn) {
                    try {
                        btn.click();
                    } catch (e) {}
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
