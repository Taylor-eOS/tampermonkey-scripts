// ==UserScript==
// @name         Insert Text
// @namespace    http://tampermonkey.net/
// @version      2.10
// @description  Insert different text based on different shortcuts
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Listen for keydown events
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + ´ -> insert three backticks
        if (e.ctrlKey && e.shiftKey && e.key === 'Dead') {
            e.preventDefault();
            insertTextAtCursor('```\n\n\n```');
        }
        // Ctrl + Alt + Period -> format continuous response
        else if (e.ctrlKey && e.altKey && e.code === 'Period') {
            e.preventDefault();
            insertTextAtCursor('[Format your response as a continuous and concise paragraph.]');
        }
        // Ctrl + Alt + Comma -> answer this specific question
        else if (e.ctrlKey && e.altKey && e.code === 'Comma') {
            e.preventDefault();
            insertTextAtCursor('[Just answer this specific question in continuous and concise writing without code.]');
        }
        // Ctrl + Alt + Minus -> continue approach
        else if (e.ctrlKey && e.altKey && e.key === '-') {
            e.preventDefault();
            insertTextAtCursor('[Continue the approach that led to the last response.]');
        }
        // Ctrl + Alt + R -> Reflect
        else if (e.ctrlKey && e.altKey && e.key === 'r') {
            e.preventDefault();
            insertTextAtCursor('[Reflect on whether this is accurate in continuous writing.]');
        }
        // Ctrl + Alt + I -> Infer
        else if (e.ctrlKey && e.altKey && e.key === 'i') {
            e.preventDefault();
            insertTextAtCursor('[Try to infer from my prompt what I would be interested in, and provide some creative reflection that would benefit my learning considering my prompts so far.]');
        }
        // Ctrl + Alt + Y -> tell me something I have not considered Yet
        else if (e.ctrlKey && e.altKey && e.key === 'y') {
            e.preventDefault();
            insertTextAtCursor('[Can you tell me something creatively on this topic that I have not considered yet, inferring from my previous prompts what I would be interested to hear.]');
        }
        // Ctrl + Alt + A -> Assume other functions work
        else if (e.ctrlKey && e.altKey && e.key === 'a') {
            e.preventDefault();
            insertTextAtCursor('[Just concern yourself with rewriting the function I gave you. The code should interface with the unseen parts of the script in the same way. Assume that unseen functions just work, and don\'t reinvent them. Stay on target. Include explanations outside the code, but no inline comments or empty lines inside code.]');
        }
        // Ctrl + Alt + C -> Comments
        else if (e.ctrlKey && e.altKey && e.key === 'f') {
            e.preventDefault();
            insertTextAtCursor('[Stay on target. Include explanations outside the code, but no inline comments or empty lines inside code. Assume that unseen functions just work, and don\'t reinvent them.]');
        }
        // Ctrl + Alt + T -> stay on Target
        else if (e.ctrlKey && e.altKey && e.key === 'f') {
            e.preventDefault();
            insertTextAtCursor('[Try to stay on target with your response.]');
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
