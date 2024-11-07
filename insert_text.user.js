// ==UserScript==
// @name         Insert Text
// @version      4.4
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = { //An answer focusing solely on the question, written concisely
        'Control+Shift+Equal': ' ```\n```',
        'Control+Alt+Period': ' Formatted in one continuous and concise paragraph, avoiding needless structural list-making.',
        'Alt+Shift+Period': ' Written continuously and concisely.',
        'Control+Alt+Comma': 'Solely answering the specific question asked in continuous and concise prose without any code included.',
        'Alt+Shift+Comma': ' Written in continuous natural language, without including code at this stage.',
        'Control+Alt+KeyC': ' Adding continuous explanations outside the code, but the code will contain no inline comments, empty lines, or segmentation inside functions.',
        'Alt+Shift+KeyC': ' Complete code, free from explanations, inline comments, or empty lines within functions.',
        'Control+Alt+KeyG': ' Code compatible with the unseen parts of the larger project, importing and using the functions the provided code uses in the same way, assuming they work, without needlessly reinventing unseen parts. Modifications or additions will be applied to the code snippet provided. Requests for clarification will be made if other functions need to be provided.',
        'Alt+Shift+KeyG': ' Disregarding issues that stem from not all parts of the larger project being provided, such as variables not being defined here.',
        'Control+Alt+KeyA': ' Adapting the last code to make the required changes.',
        'Alt+Shift+KeyA': ' Answering to these questions will be provided in continuous prose.',
        'Control+Alt+KeyJ': ' Including only the functions that have been changed, omitting any that remain the same from the previous version.',
        'Alt+Shift+KeyJ': ' Limiting content to what was specifically requested, along with necessary additions, avoiding unrelated or tangential information.',
        'Control+Alt+Slash': ' Continuing the approach that led to the last result.',
        'Alt+Shift+Slash': ' This updated assessment will incorporate the provided information, assume its validity, and incorporate it into an update assessment.',
        'Control+Alt+KeyZ': '  continuously and concisely',
        'Alt+Shift+KeyZ': ' Not adding explanation.',
        'Control+Alt+KeyX': ' Evaluating whether the stated contentions are true and correcting misunderstandings.',
        'Alt+Shift+KeyX': ' Assessing the feasibility of the outlined proposals.',
        'Control+Alt+KeyS': ' Apply robust logic, making use of comprehensive coding frameworks instead of simple if-then statements. Multi-step processing and memory-heavy solutions, such as storing all objects in lists, will be considered without concern for performance constraints.',
        'Alt+Shift+KeyS': ' Comprehensive rewrite addressing all adjustments that need to be made, without concern for brevity, simplicity, or computational performance',
        'Control+Alt+KeyI': ' Aiming to interpret the underlying intention of this prompt, adjusting the approach to optimize the outcome according to technical possibilities and common solutions, rather than strictly adhering to a literal interpretation of the instructions. response will aim to implement a meaningful solution that aligns with the overall goal, avoiding literal adherence to instructions that miss the core intent.',
        'Alt+Shift+KeyI': ' Demonstrating independent initiative in content direction, adding related thoughts, potential objections, or insightful segues beyond simple paraphrasing, and provide creative content that introduces new insights.',
        'Control+Alt+KeyV': ' Minimizing verbosity and excessive verbal output.',
        'Alt+Shift+KeyV': ' Omitting fluff, filler, introductions, and conclusions, focusing solely on essential content without unnecessary explanations or action announcements.',
        'Control+Alt+KeyP': ' Explaining will outline the mechanics of the relevant code in a compact, pseudocode-like format, presenting the structural logic clearly while omitting implementation details to help identify any conceptual flaws.',
        'Alt+Shift+KeyP': ' Strategically adding print lines throughout the code to help identify the cause of the error.',
        'Control+Alt+KeyQ': ' Seeking clarification if any part of the task is unclear or lacking in detail, avoiding speculative writing or unworkable code by confirming understanding first to ensure an accurate solution.',
        'Alt+Shift+KeyQ': ' Offering insights into the expressed unknowns, addressing them comprehensively.',
        'Control+Alt+KeyU': ' Reflecting on the general issue conveyed, considering broader implications beyond the specific question presented.',
        'Alt+Shift+KeyU': ' Creatively expanding on the topic, incorporating previous inputs and suggesting new angles of thought that the user might find intriguing.',
        'Control+Alt+KeyR': ' Writing an essay from the perspective of an agreeable professional within the relevant field of study.',
        'Alt+Shift+KeyR': ' Attepting to present the requested position as an intellectual Turing test, that attempts to be distinguishable from someone believing the position honestly, i.e. without caveats to the contrary.',
        'Control+Alt+KeyB': ' Brainstorming the issue, providing possible solutions and offering suggestions.',
        'Alt+Shift+KeyB': ' ',
        'Control+Alt+KeyE': ' Exploring the issue in detail, examining its various facets and implications to produce a comprehensive understanding.',
        'Alt+Shift+KeyE': ' Elaborating on these concerns, providing deeper insights for thorough consideration.',
        'Control+Alt+KeyM': ' Relating the user’s prompt to real-world examples, identify points of agreement and disagreement, offer a segue, and introduce related knowledge the user might find valuable.',
        'Alt+Shift+KeyM': ' ',
        'Control+Alt+KeyH': ' Avoiding hypothetical language and focus exclusively on presenting the factual reality, avoiding subjective perspectives.',
        'Alt+Shift+KeyH': ' Analyzing the available code instead of guessing about it, ensuring it focuses on what is the case.',
        'Control+Alt+KeyY': ' Adopting a straightforward, based, and cynical libertarian stance, mirroring the unfiltered tone seen in content such as South Park or RSD Tyler.',
        'Alt+Shift+KeyY': ' Favoring an edgy, genuine, and unfiltered perspective, steering clear of overly sanitized or conformist bias to present the unvarnished truth.',
        'Control+Alt+KeyW': ' Explaining the causes of the issue and propose potential improvements.',
        'Alt+Shift+KeyW': ' Analyzing the facts based on the code review provided, focusing on definitive conclusions.',
        'Control+Alt+KeyK': ' Contextualizing the topic, integrating relevant background information to promote understanding.',
        'Alt+Shift+KeyK': ' ',
        'Control+Alt+KeyN': ' ',
        'Alt+Shift+KeyN': ' ',
        'Control+Alt+KeyO': ' ',
        'Alt+Shift+KeyO': ' ',
        'Control+Alt+Shift+Period': ' Not writing an impenetrable wall of lists. Eschewing any form of list creation, whether numbered or bulleted. No list-producing HTML tags such as <ul>, <ol>, or <li> included. Entirely avoiding structured separations or markup. Maintaining unbroken flow of text. Keeping sentences connected without structural separations or divisions. Presenting information in one seamless, uninterrupted paragraph, maintaining a continuous block of prose.'
    };
    //Answering the question continuously and concisely.
    //Relevant suggestions related to the discussed topic will be provided.
    //Adapting the code to fix this error.
    //Analyzing will evaluate the accuracy of the provided understanding.
    //Writing an analysis of this idea and how it could be implemented.
    //Analyzing will review the code to determine if there are any structural issues within the script.',
    //Explaining describe the code in continuous natural language, without using lists.',
    //Responding will elaborate on these technical challenges, providing additional insight.',
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
