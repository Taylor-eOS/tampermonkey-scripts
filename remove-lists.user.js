// ==UserScript==
// @name         Remove Lists from ChatGPT Responses
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Remove all lists from ChatGPT's responses while preserving code blocks and ensuring proper formatting.
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Generate a unique placeholder
    function generatePlaceholder() {
        return 'CODE_PLACEHOLDER_' + Math.random().toString(36).substr(2, 9);
    }

    //Protect code blocks by replacing them with placeholders
    function protectCodeBlocks(container) {
        const codeBlocks = [];
        container.querySelectorAll('pre, code').forEach(block => {
            const placeholder = document.createTextNode(generatePlaceholder());
            codeBlocks.push({ placeholder, block });
            block.parentNode.replaceChild(placeholder, block);
        });
        return codeBlocks;
    }

    //Restore code blocks from placeholders
    function restoreCodeBlocks(container, codeBlocks) {
        codeBlocks.forEach(({ placeholder, block }) => {
            placeholder.parentNode.replaceChild(block, placeholder);
        });
    }

    //Remove all list tags
    function removeLists(container) {
        //Replace each <li> with its content followed by a line break
        container.querySelectorAll('li').forEach(li => {
            const fragment = document.createDocumentFragment();

            //Append the content of the <li>
            while (li.firstChild) {
                fragment.appendChild(li.firstChild);
            }

            //Add a line break after the content
            fragment.appendChild(document.createElement('br'));

            //Replace the <li> with the fragment
            li.parentNode.replaceChild(fragment, li);
        });

        //Remove any remaining <ul> and <ol> elements by replacing them with their content
        container.querySelectorAll('ul, ol').forEach(list => {
            const fragment = document.createDocumentFragment();

            while (list.firstChild) {
                fragment.appendChild(list.firstChild);
            }

            list.parentNode.replaceChild(fragment, list);
        });
    }

    //Remove multiple consecutive <br> tags
    function removeExtraLineBreaks(container) {
        container.querySelectorAll('br + br').forEach(br => {
            br.remove();
        });
    }

    function adjustParagraphs(container) {
        container.querySelectorAll('p').forEach(p => {
            p.style.margin = '0.5em 0'; // You can adjust the margin values here
            p.style.padding = '0';
        });
    }

    //Adjust spacing around specific tag combinations
    function adjustSpacing(container) {
        //Remove <br> directly before <p> tags
        container.querySelectorAll('br + p').forEach(p => {
            const br = p.previousSibling;
            if (br && br.nodeName.toLowerCase() === 'br') {
                br.remove();
            }
        });

        //Remove <br> directly after </p> tags
        container.querySelectorAll('p').forEach(p => {
            const br = p.nextSibling;
            if (br && br.nodeName.toLowerCase() === 'br') {
                br.remove();
            }
        });

        //Adjust margin for <p> tags that directly follow code blocks
        container.querySelectorAll('pre + p, code + p').forEach(p => {
            p.style.marginTop = '0.5em'; // Reduce the top margin
        });

        //Adjust margin for <p> tags that are followed by <strong> elements
        container.querySelectorAll('p strong').forEach(strong => {
            const p = strong.closest('p');
            if (p) {
                p.style.marginBottom = '0.25em'; // Reduce the bottom margin
            }
        });
    }

    function processMessage(container) {
        if (container.dataset.processed) return;
        container.dataset.processed = 'true';
        const codeBlocks = protectCodeBlocks(container);
        removeLists(container);
        removeExtraLineBreaks(container);
        restoreCodeBlocks(container, codeBlocks);
        adjustParagraphs(container);
        adjustSpacing(container);
    }

    //Process all existing messages
    function processAllMessages() {
        document.querySelectorAll('[data-message-author-role="assistant"] .markdown').forEach(processMessage);
    }

    //Observe for new messages
    const observer = new MutationObserver(() => {
        processAllMessages();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    processAllMessages();
})();
