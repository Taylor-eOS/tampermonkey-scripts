// ==UserScript==
// @name         Insert Text
// @version      3.1
// @description  Insert text into ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': '[Format your response continuously and concisely.]',
        'Control+Alt+Comma': '[Answer this question targeted in continuous and concise language without code.]',
        'Control+Alt+Slash': '[I liked that response. Continue the approach that led to the last result.]',
        'Control+Alt+KeyG': '[Focus on rewriting the functions I gave you. This code should interface with unseen parts like my input. Assume that unseen functions work, and don\'t reinvent them.]',
        'Control+Alt+KeyC': '[Stay on target. Include continuous natural language explanations, but no inline comments or empty lines in code blocks.]',
        'Control+Alt+KeyR': '[Reflect on whether these statements are accurate in continuous natural language.]',
        'Control+Alt+KeyI': '[What I always miss from AI responses in comparison to talking to a person is its own initiative in the content direction. The AI always just sticks to what the user said. A person might make a segue, extend a thought, have an objection, or come up with something they are reminded of. You know what I mean.]',
        'Control+Alt+KeyO': '[Take the initiative on this topic to creatively provide some ideas I have not considered yet that I would be interested to hear, as inferred from my perspective so far.]',
        'Control+Alt+KeyU': '[Can you incorporate this new information and update your answer to take it into account.]',
        'Control+Alt+KeyQ': '[If an aspect is unclear or ambiguous, ask for more details to confirm your understanding before answering, particularly before writing code code. Go through a process of clarification before writing code.]',
    };

    /*
    //Commnet in to see key presses in browser console
    document.addEventListener('keydown', function(e) {
        console.log('Key pressed:', e.key, 'Code:', e.code); // Temporary log for debugging
    });
    */

    //Common listener for the table
    document.addEventListener('keydown', function(e) {
        const keys = [];
        if (e.ctrlKey) keys.push('Control');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        const key = e.code;
        keys.push(key);
        const keyString = keys.join('+');
        if (keyMap[keyString]) {
            e.preventDefault();
            insertTextAtCursor(keyMap[keyString]);
        }
    });

    /*
    //Separate function for the backticks, change 'Dead' to what works on your keyboard
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'Dead') {
            e.preventDefault();
            insertTextAtCursor('```\n\n\n```');
        } else {
            const keys = [];
            if (e.ctrlKey) keys.push('Control');
            if (e.altKey) keys.push('Alt');
            if (e.shiftKey) keys.push('Shift');
            const key = e.code;
            keys.push(key);
            const keyString = keys.join('+');
            if (keyMap[keyString]) {
                e.preventDefault();
                insertTextAtCursor(keyMap[keyString]);
            }
        }
    });
    */

    //Insert text where the cursor is located
    function insertTextAtCursor(text) {
        let activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            let start = activeElement.selectionStart;
            let end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
        } else if (activeElement.isContentEditable) {
            document.execCommand('insertText', false, text);
        }
    }
})();
