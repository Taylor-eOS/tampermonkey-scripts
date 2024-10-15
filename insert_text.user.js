// ==UserScript==
// @name         Insert Text with Clipboard
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Insert different text based on different shortcuts, including clipboard content within backticks
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Listen for keydown events
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + ´ -> insert backticks with clipboard content
        if (e.ctrlKey && e.shiftKey && e.key === 'Dead') {
            e.preventDefault();
            insertClipboardContentBetweenBackticks();
        }
        // Ctrl + Alt + Period -> insert the specified sentence
        else if (e.ctrlKey && e.altKey && e.code === 'Period') {
            e.preventDefault();
            insertTextAtCursor('[Format your response as a continuous and concise paragraph.]');
        }
        // Ctrl + Alt + Comma -> insert the specified sentence
        else if (e.ctrlKey && e.altKey && e.code === 'Comma') {
            e.preventDefault();
            insertTextAtCursor('[Answer this specific question in continuous and concise writing without code.]');
        }
        // Ctrl + Alt + - -> insert the specified sentence
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
            // **Updated Logic:** Replace newline characters with <div> to ensure separate lines
            let html = text
            .split('\n')
            .map(line => document.createTextNode(line))
            .reduce((frag, node) => {
                frag.appendChild(node);
                frag.appendChild(document.createElement('br'));
                return frag;
            }, document.createDocumentFragment());

            // Use Range API to insert HTML
            let range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(html);

            // Move the cursor to the end of the inserted content
            range.collapse(false);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    // Function to insert clipboard content between triple backticks
    function insertClipboardContentBetweenBackticks() {
        navigator.clipboard.readText()
            .then(clipboardText => {
            // Sanitize clipboard text if necessary
            let sanitizedText = sanitizeText(clipboardText);

            // Remove leading and trailing whitespace (including newlines)
            sanitizedText = sanitizedText.trim();

            // **Construct the entire code block with explicit newlines**
            const textToInsert = '```\n' + sanitizedText + '\n```';

            insertTextAtCursor(textToInsert);
        })
            .catch(err => {
            console.error('Failed to read clipboard: ', err);
            // Fallback: insert empty backticks on separate lines
            insertTextAtCursor('```\n\n```');
        });
    }

    // Optional: Function to sanitize clipboard text to prevent injection or formatting issues
    function sanitizeText(text) {
        // For example, escape backticks or other special characters if necessary
        // Currently, it returns the text as-is
        return text;
    }
})();
