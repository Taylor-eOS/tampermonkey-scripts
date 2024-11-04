// ==UserScript==
// @name         Insert Text
// @version      3.9
// @description  Insert text into ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': '[Format your response in one concise and continuous paragraph without lists.]',
        'Alt+Shift+Period': '[Write concisely and continuously.]',
        'Control+Alt+Comma': '[Answer this specific question in concise and continuous prose without code.]',
        'Alt+Shift+Comma': '[Don\'t write code yet. Respond in continuous natural language.]',
        'Control+Alt+KeyC': '[Include natural language explanations outside code, but no inline comments or empty lines inside code blocks. Don\'t insert segmentation inside functions.]',
        'Alt+Shift+KeyC': '[Give me the complete code, without further commentary, inline comments, or empty lines inside functions. Don\'t insert segmentation inside functions.]',
        'Control+Alt+KeyG': '[The code you write should remain compatible with the parts of the script that I haven’t provided, and interface with them like the code I sent does. Assume that unseen parts function correctly, and use them without reinventing them. Focus solely on modifying the code snippet that I have provided without reintroducing other parts of the script.]',
        'Alt+Shift+KeyG': '[Ignore the issues that stem from you not seeing the whole script, like variables not being defined. Assume that unseen parts function correctly, and concern yourself with the parts you are seeing.]',
        'Control+Alt+KeyA': '[Adapt the code to make the relevant changes.]',
        'Alt+Shift+KeyA': '[Answer these questions.]',
        'Control+Alt+KeyJ': '[Just give me the functions that need to be changed. Exclude functions that remain unchanged.]',
        'Alt+Shift+KeyJ': '[Restrict your response to the requested content.]',
        'Control+Alt+KeyZ': '[Don\'t add an explanation.]',
        'Alt+Shift+KeyZ': '[Target an answer to the specific question I am asking. Don\'t include obvious or tangential information.]',
        'Control+Alt+Slash': '[Continue the approach that led to the last result.]',
        'Alt+Shift+Slash': '[Take this information into account and incorporate it into an updated assessment of the last response.]',
        'Control+Alt+KeyS': '[The code does not have to be short or simple. Prioritize robust logic that uses sufficient coding frameworks over inflexible if-then-statements. Feel free to implement redundancy or multi-step processing. Performance is not a concern, so feel free to use memory-heavy solutions, like storing all objects in lists.]',
        'Control+Alt+KeyI': '[This instruction merely attempts to convey an intention. Try to interpret the idea behind the words and find an optimal approach, considering the technical possibilities and common solutions, rather than strictly following a literal reading of what I prompt.]',
        'Alt+Shift+KeyI': '[What I always miss from LLM responses is independent initiative in content direction. The LLM usually just sticks to what the user said. A real person might make a segue, extend a thought, have an objection, or come up with something related. Initiate content direction like a real human might, with related thoughts or objections. Don\'t just paraphrase what I wrote in different words, but provide creative content that add new insights.]',
        'Control+Alt+KeyV': '[Limit your verbosity and verbal output.]',
        'Alt+Shift+KeyV': '[Omit fluff, filler, intros, and conclusions. Don\'t add unnecessary explanations. Don\'t announce actions.]',
        'Control+Alt+KeyP': '[Explain the mechanics of the relevant code in compact natural language that is functionally like pseudocode, which explains how the structural logic works, but omits implementation details, so that I can understand and correct conceptual flaws before requesting actual code.]',
        'Alt+Shift+KeyP': '[Add print lines at relevant strategic places throughout the code to determine the cause of the error.]',
        'Control+Alt+KeyQ': '[If any part of your task is unclear or misses details, ask for clarifications before proceeding. Avoid writing speculatively or providing code that can\'t work because you didn\'t have the information to get it right. Confirm your understanding first to ensure an accurate solution.]',
        'Control+Alt+KeyR': '[Can you reflect on the general issue I am trying to express, not just the specific question I managed to verbalize.]',
        'Alt+Shift+KeyR': '[Respond to this in the form of an essay from the perspective of a agreeable professional in the relevant field of study.]',
        'Control+Alt+KeyU': '[Analyze whether this understanding is accurate.]',
        'Alt+Shift+KeyU': '[Creatively expand my understanding of this topic with ideas I have not considered yet, but which I would be interested to hear, considering my inputs so far.]',
        'Control+Alt+KeyB': '[Brainstorm this issue, offer possible solutions, and make suggestions.]',
        'Alt+Shift+KeyS': '[Can you make some suggestions.]',
        'Control+Alt+KeyE': '[Can you explore this issue.]',
        'Alt+Shift+KeyE': '[Elaborate on this concern.]',
        'Control+Alt+KeyM': '[Do five things: relate my prompt to real world examples, find something to agree with, something to disagree with, a segue, and add some related knowledge I did not think of but would be glad to hear.]',
        'Control+Alt+Shift+Comma': '[Stringently eschew creating any form of list, whether numbered or bulleted. Do not include any list-producing HTML tags like `<ul>`, `<ol>`, or `<li>` in your response whatsoever. Vehemently avoid all structured separations or markup. Make sure the response flows naturally as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Present information in one seamless, uninterrupted paragraph, not in the form of numbered lists. Don\’t organize the response into any type of enumeration. Aggressively avoid segmenting content; keep everything unified in a single, continuous block of prose.]',
        'Control+Alt+KeyH': '[Do not write in hypothetical mode, with sentences like "this theory argues". Don\'t present the subjective perspective of wrong people, I am not asking what "people say", but what is the case in reality.]',
        'Alt+Shift+KeyH': '[]',
        'Control+Alt+KeyW': '[]',
        'Alt+Shift+KeyW': '[]',
        'Control+Alt+KeyK': '[]',
        'Alt+Shift+KeyK': '[]',
        'Alt+Shift+KeyM': '[]',
        'Control+Alt+KeyN': '[]',
        'Alt+Shift+KeyN': '[]',
        'Control+Alt+KeyO': '[]',
        'Alt+Shift+KeyO': '[]',
        'Alt+Shift+KeyQ': '[]',
        'Control+Alt+KeyX': '[]',
        'Alt+Shift+KeyX': '[]',
        'Control+Alt+KeyY': '[]',
        'Alt+Shift+KeyY': '[]',
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
