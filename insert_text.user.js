// ==UserScript==
// @name         Insert Text
// @version      3.2
// @description  Insert text into ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': '[Format your response in continuous and concise prose.]',
        'Control+Alt+Comma': '[Answer this question in continuous and concise language without writing code yet.]',
        'Control+Alt+Slash': '[Good response. Continue the approach that led to the last result.]',
        'Control+Alt+KeyG': '[Focus on rewriting the functions I gave you. Your code should interface with the parts of the script I didn not send you in teh same way my input does. Assume that functions I didn\'t show you just work, and don\'t reinvent them.]',
        'Control+Alt+KeyC': '[Stay on target with responding to my specific request. Include natural language explanations in continuous prose, but no inline comments or empty lines in code blocks.]',
        'Control+Alt+KeyR': '[Can you reflect on whether these statements are accurate in continuous natural language.]',
        'Control+Alt+KeyI': '[What I always miss from AI responses in comparison to talking to a real human is its own initiative in the content direction. The AI always just sticks to what the user said. A person might make a segue, extend a thought, have an objection, or come up with something they are reminded of. You know what I mean. Can you be lik that.]',
        'Control+Alt+KeyO': '[Can you take the initiative on this topic to creatively provide some ideas I have not considered yet, that I would be interested to hear considering my prompts so far.]',
        'Control+Alt+KeyU': '[Can you incorporate this new information and update your answer to take it into account.]',
        'Control+Alt+KeyV': '[Alert me to issues instead of writing code taht can\'t work because you lacked the information to get it right. If you need more information to solve the problem, or need to see code from other files, then ask me and request missing data before launching ahead with a solution.]',
        'Control+Alt+KeyQ': '[If an aspect of my prompt is unclear, ask for more details to confirm your understanding is sufficient before answering. Go through a process of clarification before providing a solution or writing code.]',
        'Control+Alt+KeyP': '[Tell me what causes this error and suggest how it might be solved.]',
        'Control+Alt+KeyM': '[Can you tell me me print messages to insert at strategic positions in the code to investigate the cause of the error.]',
        'Control+Alt+KeyJ': '[Just give me the corrected functions in whole, without empty lines or inline comments, and no other commentary.]',
        'Control+Alt+KeyW': '[Write the functons that needs to be changed to implement my requested changes. Do not repeat code that can stay the same.]',
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
