// ==UserScript==
// @name         Insert Text
// @version      4.6
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': 'be formatted as one continuous, concise paragraph, without unnecessary structural list-making.]',
        'Alt+Shift+Period': 'be written continuously and concisely.]',
        'Control+Alt+Comma': 'solely answer the specific question asked, in continuous and concise prose, without code.]',
        'Alt+Shift+Comma': 'be written in continuous natural language, excluding code at this stage.]',
        'Control+Alt+KeyC': 'include continuous explanations outside code while ensuring the code itself contains no inline comments, empty lines, or segmentation within functions.]',
        'Alt+Shift+KeyC': 'provide complete code, excluding commentary, inline comments, or empty lines within functions.]',
        'Control+Alt+KeyG': 'contain code written to be compatible with unseen project parts, using existing functions as in the provided code and avoiding reinvention of unseen components. Modifications or additions will be limited to the provided snippet..]',
        'Alt+Shift+KeyG': 'disregard issues that stem from mot seeing all parts of the larger project, such as variables not being defined here.]',
        'Control+Alt+KeyA': 'adapt the previous code to make the required changes.]',
        'Alt+Shift+KeyA': 'answer in continuous prose.]',
        'Control+Alt+KeyJ': 'include only functions that have been changed, and omit functions that remain unchanged from the previous version.]',
        'Alt+Shift+KeyJ': 'be limited to specifically requested content and necessary additions, avoiding unrelated or tangential information.]',
        'Control+Alt+Slash': 'continue the approach that led to the last result.]',
        'Alt+Shift+Slash': 'update its assessment in teh last response, incorporating the provided information, while assuming its validity.]',
        'Control+Alt+KeyZ': 'not include explanation.]',
        'Alt+Shift+KeyZ': ']',
        'Control+Alt+KeyX': 'evaluate the accuracy of the stated contentions and correct misunderstandings as appropriate.]',
        'Alt+Shift+KeyX': 'assess the feasibility of the outlined proposals.]',
        'Control+Alt+KeyS': 'apply robust logic using comprehensive coding frameworks rather than simple if-then statements. Favoring multi-step processing and memory-heavy solutions, like storing objects in lists, without performance concerns.]',
        'Alt+Shift+KeyS': 'be a comprehensive rewrite addressing necessary adjustments without regard for brevity, simplicity, or computational performance.]',
        'Control+Alt+KeyI': 'be a interpretation aimed at the prompt’s underlying intention, optimizing outcome based on technical possibilities and common solutions rather than strict literal adherence.]',
        'Alt+Shift+KeyI': 'demonstrate independent initiative in content direction, adding related thoughts, objections, or segues beyond simple paraphrasing, with creative insights.]',
        'Control+Alt+KeyV': 'minimize verbosity and limit excessive verbal output.]',
        'Alt+Shift+KeyV': 'omit fluff, filler, introductions, and conclusions, focusing on essential content only, without additional explanations or announcements.]',
        'Control+Alt+KeyP': 'outline the code mechanics in a compact, pseudocode-like format, taht focuses on structural logic while omitting implementation details to identify conceptual flaws.]',
        'Alt+Shift+KeyP': 'add print lines strategically throughout the code to identify the cause of the error.]',
        'Control+Alt+KeyQ': 'seek clarification if any part of the task is unclear or lacking detail, avoiding speculative writing by confirming understanding before providing a solution.]',
        'Alt+Shift+KeyQ': 'provide comprehensive insights into the expressed unknowns.]',
        'Control+Alt+KeyU': 'reflect on the general issue conveyed, considering broader implications beyond the specific question.]',
        'Alt+Shift+KeyU': 'creatively expand on the topic by incorporating previous inputs and suggesting new perspectives the user might find intriguing.]',
        'Control+Alt+KeyR': 'be written as an essay from the perspective of an agreeable professional in the relevant field.]',
        'Alt+Shift+KeyR': 'position the response as an intellectual Turing test, presenting the requested stance as if held sincerely without caveats to the contrary.]',
        'Control+Alt+KeyB': 'brainstorm the issue with possible solutions and suggestions.]',
        'Alt+Shift+KeyB': 'add what else could be interesting to the user, considering his prompts so far.]',
        'Control+Alt+KeyE': 'explore the issue in detail, examining facets and implications to provide a comprehensive understanding.]',
        'Alt+Shift+KeyE': 'elaborate on concerns with deeper insights for thorough consideration.]',
        'Control+Alt+KeyM': 'relate the prompt to real-world examples, identifying points of agreement and disagreement, introducing a segue, and adding relevant knowledge.]',
        'Alt+Shift+KeyM': ']',
        'Control+Alt+KeyH': 'avoid "hypothetical mode" and avoiding subjective perspectives.]',
        'Alt+Shift+KeyH': 'be a direct analysis of the available code, focusing on definitive statements rather than speculation. Not presenting what "more people say", but what is the case.]',
        'Control+Alt+KeyY': 'adopt a straightforward, based, and cynical libertarian stance, mirroring an unfiltered tone like South Park or RSD Tyler.]',
        'Alt+Shift+KeyY': 'present an edgy, genuine, and unfiltered perspective, avoiding sanitized or conformist bias, conveying the unvarnished truth.]',
        'Control+Alt+KeyW': 'explain causes of the issue and proposing improvements.]',
        'Alt+Shift+KeyW': 'focus on definitive conclusions based on code review instead of guessing.]',
        'Control+Alt+KeyK': 'contextualize the topic with relevant background information for better understanding.]',
        'Alt+Shift+KeyK': '[]',
        'Control+Alt+KeyN': 'write fully neutral towards the moral issues, with a perspective that is not shaped by our current interpretation of issues.]',
        'Alt+Shift+KeyN': '[]',
        'Control+Alt+KeyO': '[]',
        'Alt+Shift+KeyO': '[]',
        'Control+Alt+Shift+Period': 'avoid all list creation, whether numbered or bulleted. No list-producing HTML tags (<ul>, <ol>, <li>). Entirely excluding structured separations or markup. Maintaining unbroken text flow with connected sentences, presenting information in one continuous paragraph without segmentation.]'
    };
    //Answering the question continuously and concisely.
    //Relevant suggestions related to the discussed topic will be provided.
    //Adapting the code to fix this error.
    //Analyzing will evaluate the accuracy of the provided understanding.
    //Writing an analysis of this idea and how it could be implemented.
    //Analyzing will review the code to determine if there are any structural issues within the script.]',
    //Explaining describe the code in continuous natural language, without using lists.]',
    //Responding will elaborate on these technical challenges, providing additional insight.]',
    //Approach will consider the purpose of the task and implement a solution that makes sense, avoiding superficial numerical methods that do not align with the intended purpose.'    //BracketRight, Backslash

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
        text = '[The following will ' + text;
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
