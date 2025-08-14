// ==UserScript==
// @name         Click Away Banner
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Check every few seconds if there is a banner to close
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    const INTERVAL_MS = 2000;
    const SNIPPET = 'hit the free plan limit';
    const TEST_MODE = false;
    let clicked = false;
    function showMarker() {
        if (!TEST_MODE) return;
        let marker = document.createElement('div');
        marker.textContent = 'BANNER CLOSED';
        marker.style.position = 'fixed';
        marker.style.top = '10px';
        marker.style.right = '10px';
        marker.style.backgroundColor = 'red';
        marker.style.color = 'white';
        marker.style.fontSize = '24px';
        marker.style.fontWeight = 'bold';
        marker.style.padding = '10px';
        marker.style.zIndex = '9999';
        document.body.appendChild(marker);
    }

    function checkAndClick() {
        if (clicked) return;
        let h3s = document.getElementsByTagName('h3');
        for (let i = 0; i < h3s.length; i++) {
            let t = h3s[i].textContent;
            if (!t) continue;
            if (t.toLowerCase().includes(SNIPPET)) {
                let btn = document.querySelector('[data-testid="close-button"]');
                if (btn) {
                    try {
                        btn.click();
                        clicked = true;
                        showMarker();
                    } catch (e) {}
                }
                return;
            }
        }
    }
    let initialDelay = Math.floor(Math.random() * INTERVAL_MS);
    let intervalId = setInterval(() => {
        checkAndClick();
        if (clicked) clearInterval(intervalId);
    }, INTERVAL_MS);

    setTimeout(checkAndClick, initialDelay);
})();
