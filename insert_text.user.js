// ==UserScript==
// @name         Insert Text
// @version      3.4
// @description  Insert text into ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': '[Format your response in one continuous and concise paragraph without lists.]',
        'Control+Alt+Comma': '[Just answer this specific question in continuous and concise prose without writing code yet.]',
        'Control+Alt+Slash': '[Continue the approach that led to the last result.]',
        'Control+Alt+KeyG': '[The code you write should interface with the parts of the script I did not send you in the same way as my input code does. Assume that functionality I didn\'t show you works, and don\'t reinvent it. Just rewrite what I gave you.]',
        'Control+Alt+KeyC': '[Include natural language explanations in continuous prose, but no inline comments or empty lines in code blocks.]',
        'Control+Alt+KeyA': '[Adapt the code to incorporate the requested changes.]',
        'Control+Alt+KeyR': '[Reflect on the general issue I am trying to express, not just the specific question I managed to verbalize.]',
        'Control+Alt+KeyB': '[Brainstorm solutions to this problem, and offer suggestions in continuous prose.]',
        'Control+Alt+KeyE': '[Explore whether these statements are accurate in continuous prose.]',
        'Control+Alt+KeyT': '[Target a response to just this specific request.]',
        'Control+Alt+KeyI': '[What I always miss from LLM responses is independent initiative in what content to provide. The LLM usually just sticks to what the user said. A real person might make a segue, extend a thought, have an objection, or come up with something related. Initiate content direction like a real human might, with related thoughts or objections, instead of just paraphrasing my input in finer words.]',
        'Control+Alt+KeyJ': '[Just give me the functions that need to be changed. Don\'t repeat functions that stay the same.]',
        'Control+Alt+KeyU': '[Take the initiative to creatively expand my understanding of this topic with ideas I have not considered yet, which I would be interested to hear considering my prompts so far.]',
        'Control+Alt+KeyS': '[Seek clarifications if you don\'t know the correct answer, instead of writing speculatively. Alert me to incomplete instructions instead of writing code that can\'t work because you didn\'t have the information to get it right. If you need to see code from other files, then ask me and request missing data before launching ahead with a flawed solution.]',
        'Control+Alt+KeyQ': '[Ask questions before answering if any aspect of my prompt is unclear. Go through a process of clarification to ensure that your understanding is sufficient before providing a solution or writing code.]',
        'Control+Alt+KeyP': '[Add print lines at strategic places in the code to investigate the cause of the error, so we can pinpoint its cause.]',
        'Control+Alt+KeyO': '[Omit fluff, intros, and filler. Don\'t announce what you\'re going to say like "here is an overview", just say it. Don\'t include unneccesary statements like "I understand your frustration".]',
        'Control+Alt+KeyX': '[Tell me what causes this error and suggest how to fix it.]',
        'Control+Alt+KeyV': '[Reduce your verbosity, but don\'t entirely eliminate commentary.]',
        'Control+Alt+KeyW': '[Write the code in whole. Do not include prior code snippets or isolated examples.]',
        'Control+Alt+KeyK': '[Incorporate this caveat and update your treatment of the issue to take it into account.]',
        'Control+Alt+KeyM': '[Do not simply paraphrase what I wrote in different words, but provide an answer to my questions with creative content, adding new insights.]',
        'Control+Alt+KeyN': '[Provide useful information directly, avoiding summaries or conclusions.]',
        'Control+Alt+KeyT': '[Do five things: relate my prompt to real world examples, find something to agree with, something to disagree with, a segue, and add some related knowledge I did not think of but would be glad to hear.]',
        'Control+Alt+KeyH': '[]',
        'Control+Alt+KeyL': '[Channel a based, cynical, libertarian stance. Respond in the spirit of South Park or RSD Tyler. Favor edgy, genuine, unfiltered perspectives over lame or sanitized ones. Present the unvarnished truth without bias due to social conformity.]',
        'Control+Alt+KeyY': '[Can you use a few relevant new words in your response, so I can expand my vocabulary.]',
        'Control+Alt+KeyZ': '[Stringently eschew creating any form of list, whether numbered or bulleted. Do not include any list-producing HTML tags like `<ul>`, `<ol>`, or `<li>` in your response whatsoever. Write in continuous prose, avoiding all structured separations or markup. Make the response flow naturally as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Present information in one seamless, uninterrupted paragraph. Don\’t organize the response into any type of list. Aggressively avoid segmenting content; keep everything unified in a single, continuous block of prose.]',
    };

    /*
    //Commnet this in to show what key is pressed in the browser console
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
