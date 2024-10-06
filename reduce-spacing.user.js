// ==UserScript==
// @name         Reduce Vertical Spacing
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Reduce vertical space between paragraphs and list items on any website
// @author       Your Name
// @match        *chatgpt.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Define desired margin and padding values
    const paragraphMarginTop = '0.3em';
    const paragraphMarginBottom = '0.3em';
    const listMarginTop = '0.3em';
    const listMarginBottom = '0.3em';
    const listItemMarginTop = '0.2em';
    const listItemMarginBottom = '0.2em';
    const listPaddingLeft = '1em'; // Adjust if needed

    // Inject custom CSS
    GM_addStyle(`
        p {
            margin-top: ${paragraphMarginTop} !important;
            margin-bottom: ${paragraphMarginBottom} !important;
        }
        ul, ol {
            margin-top: ${listMarginTop} !important;
            margin-bottom: ${listMarginBottom} !important;
            padding-left: ${listPaddingLeft} !important;
        }
        li {
            margin-top: ${listItemMarginTop} !important;
            margin-bottom: ${listItemMarginBottom} !important;
        }
    `);
})();
