// ==UserScript==
// @name         Insert Text
// @version      3.3
// @description  Insert text into ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': '[Format your response in one concise and continuous paragraph, without lists or segmentation.]',
        'Control+Alt+Comma': '[Just answer this question in continuous and concise prose without writing code.]',
        'Control+Alt+Slash': '[Good response. Continue the approach that led to the last result.]',
        'Control+Alt+KeyG': '[Focus on rewriting the functions I gave you. Your code should interface with the parts of the script I did not send you in the same way my input does. Assume that functions I didn\'t show you just work, and don\'t reinvent them.]',
        'Control+Alt+KeyC': '[Include natural language explanations in continuous prose, but no inline comments or empty lines in code blocks.]',
        'Control+Alt+KeyS': '[Stay on target and respond to my specific request.]',
        'Control+Alt+KeyR': '[Reflect on whether these statements are accurate in continuous natural language.]',
        'Control+Alt+KeyI': '[What I always miss from AI responses in comparison to talking to a real human is its own initiative in the content direction. The AI always just sticks to what the user said. A person might make a segue, extend a thought, have an objection, or come up with something they are reminded of. You know what I mean. Be like that, instead of rephrasing my query in different words.]',
        'Control+Alt+KeyO': '[Take the initiative on this topic to creatively provide some ideas I have not considered yet, that I would be interested to hear considering my prompts so far.]',
        'Control+Alt+KeyU': '[Incorporate this new information and update your answer to take it into account.]',
        'Control+Alt+KeyV': '[If you don\'t know something, then tell me, instead of writign speculatively. Alert me to issues instead of writing code that can\'t work because you lacked the information to get it right. If you need more information to solve the problem, or need to see code from other files, then ask me and request missing data before launching ahead with a solution.]',
        'Control+Alt+KeyQ': '[If an aspect of my prompt is unclear, ask for more details to confirm your understanding is sufficient before answering. Go through a process of clarification before providing a solution or writing code.]',
        'Control+Alt+KeyP': '[Tell me what causes this error and suggest how it might be solved.]',
        'Control+Alt+KeyM': '[Give me me print messages to insert at strategic positions in the code to investigate the cause of the error.]',
        'Control+Alt+KeyW': '[Write up the corrected code in whole, without empty lines or inline comments, and no other commentary.]',
        'Control+Alt+KeyN': '[Give me the functions that need to be changed to implement the requested changes. You do not have to repeat code that can stay the same.]',
        'Control+Alt+KeyA': '[Adapt the code to incorporate the requested changes.]',
        'Control+Alt+KeyO': '[Write less commentary outside of the code, but not none.]',
        'Control+Alt+KeyZ': '[Stringently eschew creating any form of list, whether numbered or bulleted. Do not include any list-producing HTML tags like `<ul>`, `<ol>`, or `<li>` in your response whatsoever. Write in continuous prose, avoiding all structured separations or markup. Make the response flow naturally as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Present information in one seamless, uninterrupted paragraph. Don\’t organize the response into any type of list. Aggressively avoid segmenting content; keep everything unified in a single, continuous block of prose.]',
        'Control+Alt+KeyB': '[Omit fluff, intros, and filler. Don\'t announce what you\'re going to say like "here is an overview", just say it. Don\'t include unneccesary statements like "I understand your frustration".]',
        'Control+Alt+KeyH': '[Provide useful information directly, avoiding summaries or conclusions.]',
        'Control+Alt+KeyK': '[Channel a based, cynical, libertarian stance. Respond in teh spirit of South  Park or RSD Tyler. Favor edgy, genuine, unfiltered perspectives over lame or sanitized ones. Present the unvarnished truth without bias due to social conformity.]',
        'Control+Alt+KeyE': '[Don\'t write any code examples, just the final combined code.]',
        'Control+Alt+KeyX': '[Write text in unformatted prose, avoid enumeration, and omit padding.]',
        'Control+Alt+KeyJ': '[Placeholder.]',
        'Control+Alt+KeyT': '[Placeholder.]',
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
