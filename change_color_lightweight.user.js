// ==UserScript==
// @name         Lightweight Background Color Override
// @namespace    http://tampermonkey.net/
// @version      1.0
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
        * {
            background-color: transparent !important;
        }
        [style*="background-color: white"],
        [style*="background-color: #fff"],
        [style*="background-color: rgb(255, 255, 255)"] {
            background-color: #d6f0ff !important;
        }
    `;
    document.head.appendChild(style);
})();
