// ==UserScript==
// @name         Custom ChatGPT Response Format
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Remove lists from ChatGPT's responses, add line breaks without extra spacing, and ensure no repeated items or extra paragraph indents.
// @author       You
// @match        *.chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const modifyResponseContent = () => {
        document.querySelectorAll('[data-message-author-role="assistant"] .markdown.prose').forEach(container => {
            container.querySelectorAll('ol, ul').forEach(list => {
                if (!list.closest('code') && !list.closest('pre')) {
                    const items = Array.from(list.querySelectorAll('li')).map(li => li.innerHTML).join('<br>');
                    const lineBreak = document.createElement('div');
                    lineBreak.innerHTML = items;
                    list.replaceWith(lineBreak);
                }
            });

            container.querySelectorAll('p').forEach(paragraph => {
                paragraph.style.margin = '0'; // Remove margin for paragraphs
                paragraph.style.padding = '0'; // Remove padding for paragraphs
            });
        });
    };

    const observer = new MutationObserver(modifyResponseContent);
    observer.observe(document.body, { childList: true, subtree: true });

    modifyResponseContent();
})();
