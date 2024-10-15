// ==UserScript==
// @name         Insert Text
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Insert different text based on different shortcuts
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Listen for keydown events
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + ´ -> insert three backticks (```)
        if (e.ctrlKey && e.shiftKey && e.key === 'Dead') {
            e.preventDefault();
            insertTextAtCursor('```\n\n\n```');
        }
        // Ctrl + Alt + Period -> insert the specified sentence
        else if (e.ctrlKey && e.altKey && e.code === 'Period') {
            e.preventDefault();
            insertTextAtCursor('[Format your response as a continuous and concise paragraph.]');
        }
        // Ctrl + Alt + Period -> insert the specified sentence
        else if (e.ctrlKey && e.altKey && e.code === 'Comma') {
            e.preventDefault();
            insertTextAtCursor('[Answer this specific question in continuous and concise writing without code.]');
        }
        // Ctrl + Alt + Period -> insert the specified sentence
        else if (e.ctrlKey && e.altKey && e.key === '-') {
            e.preventDefault();
            insertTextAtCursor('[Continue the approach that led to the last response.]');
        }
    });

    // Function to insert text where the cursor is located
    function insertTextAtCursor(text) {
        let activeElement = document.activeElement;

        // Check if the active element is an input or textarea
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            let start = activeElement.selectionStart;
            let end = activeElement.selectionEnd;

            // Insert the text at the cursor position
            activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);

            // Update the cursor position
            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
        } else if (activeElement.isContentEditable) {
            // If the active element is contenteditable (e.g., a rich text editor)
            document.execCommand('insertText', false, text);
        }
    }
})();
