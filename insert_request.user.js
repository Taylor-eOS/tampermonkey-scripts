// ==UserScript==
// @name         Insert Text with Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Insert concise response request
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Listen for keydown event
    document.addEventListener('keydown', function(e) {
        // Check if Ctrl + Shift + ` (on many keyboards '´' is above the tab or near it) is pressed
        if (e.ctrlKey && e.shiftKey && e.key === 'Dead') {
            // Prevent default behavior to avoid unintended actions
            e.preventDefault();

            // Insert text at the cursor position
            insertTextAtCursor('[Write concisely and continuously.]');
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
