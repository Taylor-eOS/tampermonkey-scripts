// ==UserScript==
// @name         Reduce Vertical Spacing
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Reduce vertical space between paragraphs and list items on any website
// @author       Your Name
// @match        *chatgpt.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Define desired margin and padding values
    const paragraphMarginTop = '0.0em';
    const paragraphMarginBottom = '0.0em';
    const listMarginTop = '0.0em';
    const listMarginBottom = '0.0em';
    const listItemMarginTop = '0.0em';
    const listItemMarginBottom = '0.0em';
    const listPaddingLeft = '0.3em';

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
