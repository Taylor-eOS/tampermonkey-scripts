// ==UserScript==
// @name         Insert Text
// @version      3.6
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
        'Alt+Shift+Period': '[Write continuously and concisely.]',
        'Control+Alt+Comma': '[Just answer this specific question in continuous and concise prose without code.]',
        'Alt+Shift+Comma': '[Don\'t write code yet.]',
        'Control+Alt+KeyG': '[The code you write should work seamlessly with the parts of my script that I haven’t provided, just as the code I sent does. Maintain compatibility with these unseen sections, assuming they function correctly, and do not reinvent them. Don\'t change function names.]',
        'Control+Alt+KeyC': '[Include natural language explanations, but no inline comments or empty lines in code blocks.]',
        'Control+Alt+Slash': '[Continue the approach that led to the last result.]',
        'Control+Alt+KeyJ': '[Just provide the functions that need to be changed. Exclude functions that remain unchanged.]',
        'Alt+Shift+KeyG': '[Give me the complete code, without further commentary, empty lines, or inline comments. I do not need an explanation.]',
        'Control+Alt+KeyA': '[Adapt the code to fix this.]',
        'Control+Alt+KeyT': '[Stay on target.]',
        'Control+Alt+KeyS': '[The code does not have to be short or simple. Prioritize robust logic that uses sufficient coding frameworks over inflexible if-then-statements. Feel free to implement redundancy or multi-step processing. Performance is not a concern, so feel free to use memory-heavy solutions, like storing all objects in lists.]',
        'Control+Alt+KeyV': '[Try to limit your verbosity. Omit fluff, filler, intros, and conclusions. Don\'t add unnecessary instructions. Don\'t announce actions.]',
        'Control+Alt+KeyB': '[Brainstorm this issue, offer possible solutions, and make suggestions.]',
        'Alt+Shift+KeyA': '[Analyze whether this understanding is accurate.]',
        'Control+Alt+KeyE': '[Explore whether these statements are accurate.]',
        'Alt+Shift+KeyE': '[Can you explain this.]',
        'Alt+Shift+KeyS': '[Can you shed some light on the issue.]',
        'Control+Alt+KeyR': '[Reflect on the general issue I am trying to express, not just the specific question I managed to verbalize.]',
        //'Control+Alt+Key': '[Elaborate .]',
        'Alt+Shift+KeyC': '[Creatively expand my understanding of this topic with ideas I have not considered yet, but which I would be interested to hear, considering my inputs so far.]',
        'Alt+Shift+KeyT': '[Tell me what causes this error and suggest how it could be solved.]',
        'Control+Alt+KeyP': '[Add print lines at strategic places throughout the code, to determine the cause of the error.]',
        'Control+Alt+KeyI': '[This instruction merely attempts to convey an intention. Aim to interpret the idea behind the words and find an optimal solution, considering the technical possibilities and common approaches, rather than following a strictly literal reading.]',
        'Alt+Shift+KeyP': '[Write the script as pseudocode that summarizes the mechanics in high-level steps rather than focusing on implementation details, so I can understand the structural logic and find conceptual flaws.]',
        'Control+Alt+KeyQ': '[If any part of your task is unclear or misses details, ask for clarifications before proceeding. Avoid writing speculatively or providing code that can\'t work because you didn\'t have the information to get it right. Confirm your understanding first to ensure an accurate solution.]',
        'Control+Alt+KeyU': '[Take this argument into account and update your response to incorporate it.]',
        'Alt+Shift+KeyX': '[Avoid using regex, because it causes too much trouble.]',
        'Alt+Shift+KeyI': '[What I always miss from LLM responses is independent initiative in content direction. The LLM usually just sticks to what the user said. A real person might make a segue, extend a thought, have an objection, or come up with something related. Initiate content direction like a real human might, with related thoughts or objections. Don\'t just paraphrase what I wrote in different words, but provide creative content that add new insights.]',
        'Control+Alt+KeyF': '[Do five things: relate my prompt to real world examples, find something to agree with, something to disagree with, a segue, and add some related knowledge I did not think of but would be glad to hear.]',
        'Control+Alt+KeyZ': '[Stringently eschew creating any form of list, whether numbered or bulleted. Do not include any list-producing HTML tags like `<ul>`, `<ol>`, or `<li>` in your response whatsoever. Vehemently avoid all structured separations or markup. Make sure the response flows naturally as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Present information in one seamless, uninterrupted paragraph, not in the form of numbered lists. Don\’t organize the response into any type of enumeration. Aggressively avoid segmenting content; keep everything unified in a single, continuous block of prose.]',
        'Control+Alt+KeyL': '[Channel a based, cynical, libertarian stance. Respond in the spirit of South Park or RSD Tyler. Favor edgy, genuine, unfiltered perspectives over lame or sanitized ones. Present the unvarnished truth without bias stemming from social conformity.]',
        'Control+Alt+KeyH': '[Do not write in hypothetical mode, with sentences like "this theory argues". Don\'t present the subjective perspective of wrong people, I am not asking what "people say", but what is the case in reality.]',
        'Control+Alt+KeyW': '[Use some relevant words in your response I don\'t know yet (as inferred from my vocabulary), so I can expand my vocabulary.]',
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
