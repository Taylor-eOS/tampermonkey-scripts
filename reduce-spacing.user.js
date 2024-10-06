// ==UserScript==
// @name         Reduce Paragraph Spacing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reduce the vertical space between paragraphs on any website
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Define the desired margin values
    const paragraphMarginTop = '0.3em'; //Adjust as needed
    const paragraphMarginBottom = '0.3em'; //Adjust as needed

    // Inject custom CSS to modify paragraph margins
    GM_addStyle(`
        p {
            margin-top: ${paragraphMarginTop} !important;
            margin-bottom: ${paragraphMarginBottom} !important;
        }
    `);
})();
