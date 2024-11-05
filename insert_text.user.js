// ==UserScript==
// @name         Insert Text
// @version      4.0
// @description  Insert text into ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': 'The following response is formatted as one continuous and concise paragraph without the use of lists.',
        'Alt+Shift+Period': 'The following response will be written continuously and concisely.',
        'Control+Alt+Comma': 'The answer provided will only address the specific question in continuous and concise prose, without including code.',
        'Alt+Shift+Comma': 'The following response will be written in continuous natural language, without code at this stage.',
        'Control+Alt+KeyC': 'The following response will include continuous explanations outside the code. The code itself will not have inline comments or empty lines, and functions will not include internal segmentation.',
        'Alt+Shift+KeyC': 'The code provided will be complete, with no added commentary, inline comments, or empty lines in functions, and without segmentation within functions.',
        'Control+Alt+KeyG': 'The code written will remain compatible with unseen parts of the larger project, assuming that these parts function correctly. It will interface as the provided code does, with no reinvention of unseen sections. Modifications or additions will be made to the code snippet provided. If additional context is needed, a request for clarification will be included.',
        'Alt+Shift+KeyG': 'The following code will focus solely on the provided parts, assuming that unseen parts function correctly and ignoring any issues arising from not seeing the full script.',
        'Control+Alt+KeyA': 'The following code adapts the original snippet to make the relevant changes.',
        'Alt+Shift+KeyA': 'The answers to the questions will be provided in continuous prose.',
        'Control+Alt+KeyJ': 'The following will include only the functions that have been changed, omitting any functions that remain the same from the previous version.',
        'Alt+Shift+KeyJ': 'The content provided will consist solely of what is specifically requested, along with necessary additions, without any unrelated or obvious tangential information.',
        'Control+Alt+Slash': 'The approach taken will continue from the method that produced the previous result.',
        'Alt+Shift+Slash': 'This updated assessment incorporates the new information provided and assumes its validity.',
        'Control+Alt+KeyZ': 'The response will be written continuously, ensuring a seamless and uninterrupted flow.',
        'Alt+Shift+KeyZ': 'This response will verify whether the stated situation holds true and correct any discrepancies.',
        'Control+Alt+KeyX': 'The following response will avoid using numbered lists.',
        'Alt+Shift+KeyX': 'The response will evaluate the ideas presented, assessing the feasibility of the concepts outlined.',
        'Control+Alt+KeyS': 'The code provided will prioritize robust logic that utilizes comprehensive coding frameworks over basic if-then statements. Multi-step processing and memory-heavy solutions, such as storing all objects in lists, may be employed as performance is not a concern.',
        'Control+Alt+KeyI': 'The following response aims to interpret the underlying intention of the prompt, considering technical possibilities and common solutions rather than adhering strictly to a literal reading.',
        'Alt+Shift+KeyI': 'The following response will demonstrate independent initiative in content direction, providing related thoughts, potential objections, or insightful segues, much like a human might. It will avoid simple paraphrasing and instead offer creative content that adds new insights.',
        'Control+Alt+KeyV': 'The response will be concise, limiting verbosity and excessive verbal output.',
        'Alt+Shift+KeyV': 'This response will omit fluff, filler, introductions, and conclusions, focusing only on necessary content without unnecessary explanations or action announcements.',
        'Control+Alt+KeyP': 'The following explanation will describe the mechanics of the relevant code in a compact, pseudocode-like format. It will outline the structural logic clearly while omitting implementation details to help identify conceptual flaws.',
        'Alt+Shift+KeyP': 'Print lines will be added strategically throughout the code to help identify the cause of the error.',
        'Control+Alt+KeyQ': 'The response will seek clarifications if any part of the task is unclear or lacking in detail. It will avoid speculative writing or providing unworkable code by confirming understanding first to ensure an accurate solution.',
        'Alt+Shift+KeyQ': 'The response will provide insight into the unknowns that have been expressed.',
        'Control+Alt+KeyU': 'This response will reflect on the general issue being conveyed, considering broader implications beyond the specific question presented.',
        'Alt+Shift+KeyU': 'The response will creatively expand on the topic with fresh ideas that take previous inputs into account, suggesting new angles of thought the user might find intriguing.',
        'Control+Alt+KeyR': 'The following analysis will determine whether the provided understanding is accurate.',
        'Alt+Shift+KeyR': 'The response will take the form of an essay written from the perspective of an agreeable professional in the relevant field of study.',
        'Control+Alt+KeyB': 'The following response will brainstorm this issue, presenting possible solutions and offering thoughtful suggestions.',
        'Alt+Shift+KeyS': 'The response will include relevant suggestions related to the topic discussed.',
        'Control+Alt+KeyE': 'This response will explore the issue in detail, examining its different facets and implications.',
        'Alt+Shift+KeyE': 'The following response will elaborate on this concern, offering a deeper understanding.',
        'Control+Alt+KeyM': 'This response will connect the users prompt to real-world examples, find points of agreement and disagreement, provide a segue, and introduce related knowledge that the user might appreciate.',
        'Alt+Shift+KeyM': '',
        'Control+Alt+KeyH': 'The response will avoid hypothetical language and will focus solely on presenting the reality of the matter, without subjective perspectives or unverified claims.',
        'Alt+Shift+KeyH': 'The analysis provided will be based on the code itself, focusing on what is definitively true.',
        'Control+Alt+KeyY': 'The response will channel a straightforward, cynical, libertarian stance, mirroring the unfiltered tone of South Park or RSD Tyler.',
        'Alt+Shift+KeyY': 'The response will favor an edgy, genuine, and unfiltered perspective, avoiding any overly sanitized or conformist bias to present the unvarnished truth.',
        'Control+Alt+KeyW': 'This response will explain the causes of the issue and suggest possible improvements.',
        'Alt+Shift+KeyW': 'The analysis will tell what the case is based on the code review provided.',
        'Control+Alt+KeyK': 'The following response will provide context for this topic, integrating relevant background information.',
        'Alt+Shift+KeyK': '',
        'Control+Alt+KeyN': '',
        'Alt+Shift+KeyN': '',
        'Control+Alt+KeyO': '',
        'Alt+Shift+KeyO': '',
        'Control+Alt+Shift+Comma': 'The response will be presented in one seamless, uninterrupted block of text, strictly avoiding any lists, HTML list tags, or structural separations. Information will flow continuously as connected sentences, without enumeration or segmented formatting.'
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
