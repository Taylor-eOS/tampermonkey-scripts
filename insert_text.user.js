// ==UserScript==
// @name         Insert Text
// @version      4.2
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': 'The following will be formatted in one continuous and concise paragraph, avoiding needless structural list-making.',
        'Alt+Shift+Period': 'The following will be written continuously and concisely.',
        'Control+Alt+Comma': 'The following will solely answer the specific question asked in continuous and concise prose without any code included.',
        'Alt+Shift+Comma': 'The following will be written in continuous natural language, without including code at this stage.',
        'Control+Alt+KeyC': 'The following will contain continuous explanations outside the code, but the code will contain no inline comments, empty lines, or segmentation inside functions.',
        'Alt+Shift+KeyC': 'The following code will be complete, free from added explanations, inline comments, or empty lines within functions.',
        'Control+Alt+KeyG': 'The following code will remain compatible with the unseen parts of the larger project, and use them assuming that they function as expected. It will interface seamlessly as the provided code does, without reinventing any unseen sections. Modifications or additions will be applied to the code snippet provided. Requests for clarification will be included if further other parts are necessary.',
        'Alt+Shift+KeyG': 'The following will disregard issues that stem from not all parts of the larger project being provided, such as variables not being defined here.',
        'Control+Alt+KeyA': 'The following code adapts the original snippet to make the required changes.',
        'Alt+Shift+KeyA': 'Answers to these questions will be provided in continuous prose.',
        'Control+Alt+KeyJ': 'The following will include only the functions that have been changed, omitting any that remain the same from the previous version.',
        'Alt+Shift+KeyJ': 'The following content will be limited to what was specifically requested, along with necessary additions, avoiding unrelated or tangential information.',
        'Control+Alt+Slash': 'The approach taken in the following will continue the method that led to the last result.',
        'Alt+Shift+Slash': 'This updated assessment will incorporate the provided information, assume its validity, and incorporate it into an update assessment.',
        'Control+Alt+KeyZ': ' continuously and concisely',
        'Alt+Shift+KeyZ': 'The following text will not be formatted as lists.',
        'Control+Alt+KeyX': 'The following will evaluate whether the stated contentions are true and address discrepancies as needed.',
        'Alt+Shift+KeyX': 'The following will assess the feasibility of the outlined proposals.',
        'Control+Alt+KeyS': 'The following code will apply robust logic, making use of comprehensive coding frameworks instead of simple if-then statements. Multi-step processing and memory-heavy solutions, such as storing all objects in lists, will be considered without concern for performance constraints.',
        'Alt+Shift+KeyS': 'Relevant suggestions related to the discussed topic will be provided in the following.',
        'Control+Alt+KeyI': 'The following aims to interpret the underlying intention of this prompt, adjusting the approach to optimize the outcome according to technical possibilities and common solutions, rather than strictly adhering to a literal interpretation of the instructions.',
        'Alt+Shift+KeyI': 'The following will demonstrate independent initiative in content direction, adding related thoughts, potential objections, or insightful segues beyond simple paraphrasing, and provide creative content that introduces new insights.',
        'Control+Alt+KeyV': 'The following will minimize verbosity and excessive verbal output.',
        'Alt+Shift+KeyV': 'The following will omit fluff, filler, introductions, and conclusions, focusing solely on essential content without unnecessary explanations or action announcements.',
        'Control+Alt+KeyP': 'The following explanation will outline the mechanics of the relevant code in a compact, pseudocode-like format, presenting the structural logic clearly while omitting implementation details to help identify any conceptual flaws.',
        'Alt+Shift+KeyP': 'The following text will strategically add print lines throughout the code to help identify the cause of the error.',
        'Control+Alt+KeyQ': 'The following will seek clarification if any part of the task is unclear or lacking in detail, avoiding speculative writing or unworkable code by confirming understanding first to ensure an accurate solution.',
        'Alt+Shift+KeyQ': 'The following will offer insights into the expressed unknowns, addressing them comprehensively.',
        'Control+Alt+KeyU': 'The following will reflect on the general issue conveyed, considering broader implications beyond the specific question presented.',
        'Alt+Shift+KeyU': 'The following will creatively expand on the topic, incorporating previous inputs and suggesting new angles of thought that the user might find intriguing.',
        'Control+Alt+KeyR': 'The following is an essay from the perspective of an agreeable professional within the relevant field of study.',
        'Alt+Shift+KeyR': 'The following will attept to present the requested position as an intellectual Turing test, that attempts to be distinguishable from someone believing the position honestly, i.e. without caveats to the contrary.',
        'Control+Alt+KeyB': 'The following is a brainstorm of the issue, providing possible solutions and offering suggestions.',
        'Alt+Shift+KeyB': '',
        'Control+Alt+KeyE': 'The following will explore the issue in detail, examining its various facets and implications to produce a comprehensive understanding.',
        'Alt+Shift+KeyE': 'The following will elaborate on these concerns, providing deeper insights for thorough consideration.',
        'Control+Alt+KeyM': 'The following will relate the user’s prompt to real-world examples, identify points of agreement and disagreement, offer a segue, and introduce related knowledge the user might find valuable.',
        'Alt+Shift+KeyM': '',
        'Control+Alt+KeyH': 'The following will avoid hypothetical language and focus exclusively on presenting the factual reality, avoiding subjective perspectives.',
        'Alt+Shift+KeyH': 'The following will analyze the available code instead of guessing about it, ensuring it focuses on what is the case.',
        'Control+Alt+KeyY': 'The following will adopt a straightforward, based, and cynical libertarian stance, mirroring the unfiltered tone seen in content such as South Park or RSD Tyler.',
        'Alt+Shift+KeyY': 'The following will favor an edgy, genuine, and unfiltered perspective, steering clear of overly sanitized or conformist bias to present the unvarnished truth.',
        'Control+Alt+KeyW': 'The following will explain the causes of the issue and propose potential improvements.',
        'Alt+Shift+KeyW': 'The following analysis will state the facts based on the code review provided, focusing on definitive conclusions.',
        'Control+Alt+KeyK': 'The following will contextualize the topic, integrating relevant background information to promote understanding.',
        'Alt+Shift+KeyK': '',
        'Control+Alt+KeyN': '',
        'Alt+Shift+KeyN': '',
        'Control+Alt+KeyO': '',
        'Alt+Shift+KeyO': '',
        'Control+Alt+Shift+Period': 'The following will avoid any form of list creation, whether numbered or bulleted. No list-producing HTML tags such as <ul>, <ol>, or <li> will be included. Structured separations or markup will be entirely eschewed to maintain a unbroken flow of text. Sentences will be kept connected without structural separations or divisions. The information will be presented in one seamless, uninterrupted paragraph, maintaining a continuous block of prose.'
    };
    //The following adapts the code to fix this error.
    //The following analysis will determine the accuracy of the provided understanding.
    //The following will write an analysis of this idea and how it could be implemented.
    //The following response will aim to implement something meaningful that aligns with the overall goal, avoiding literal adherence to instructions that miss the core intent.',
    //This analysis will review the code to determine if there are any structural issues within the script.',
    //This explanation will describe the code in continuous natural language, without using lists.',
    //This response will elaborate on these technical challenges, providing additional insight.',
    //The following approach will consider the purpose of the task and implement a solution that makes sense, avoiding superficial numerical methods that do not align with the intended purpose.'    //BracketRight, Backslash

    /*
    //Commnet this in to show what key is pressed in the browser console
    document.addEventListener('keydown]', function(e) {
        console.log('Key pressed:]', e.key, 'Code:]', e.code); // Temporary log for debugging
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
