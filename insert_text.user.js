// ==UserScript==
// @name         Insert Text
// @version      4.5
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Shift+Equal': '```\n```',
        'Control+Alt+Period': '[Formatted as one continuous, concise paragraph, without unnecessary structural list-making.]',
        'Alt+Shift+Period': '[Written continuously and concisely.]',
        'Control+Alt+Comma': '[Solely answering the specific question asked, in continuous and concise prose, without code.]',
        'Alt+Shift+Comma': '[Written in continuous natural language, excluding code at this stage.]',
        'Control+Alt+KeyC': '[Adding continuous explanations outside code while ensuring the code itself contains no inline comments, empty lines, or segmentation within functions.]',
        'Alt+Shift+KeyC': '[Providing complete code, excluding commentary, inline comments, or empty lines within functions.]',
        'Control+Alt+KeyG': '[Code written to be compatible with unseen project parts, using existing functions as in the provided code and avoiding reinvention of unseen components. Modifications or additions limited to the provided snippet; requests for further functions made as needed.]',
        'Alt+Shift+KeyG': '[Disregarding issues from missing parts of the larger project, such as undefined variables.]',
        'Control+Alt+KeyA': '[Adaptation of the previous code to make the required changes.]',
        'Alt+Shift+KeyA': '[Answers provided in continuous prose.]',
        'Control+Alt+KeyJ': '[Including only functions that have been changed, omitting those unchanged from the previous version.]',
        'Alt+Shift+KeyJ': '[Limited to specifically requested content and necessary additions, avoiding unrelated or tangential information.]',
        'Control+Alt+Slash': '[Continuing the approach used in the last result.]',
        'Alt+Shift+Slash': '[Updated assessment incorporating provided information and assuming its validity.]',
        'Control+Alt+KeyZ': '[Written continuously and concisely.]',
        'Alt+Shift+KeyZ': '[Excluding explanation.]',
        'Control+Alt+KeyX': '[Evaluating the truth of the stated contentions and correcting misunderstandings as needed.]',
        'Alt+Shift+KeyX': '[Assessing the feasibility of the outlined proposals.]',
        'Control+Alt+KeyS': '[Applying robust logic using comprehensive coding frameworks rather than simple if-then statements. Multi-step processing and memory-heavy solutions, like storing objects in lists, without performance concerns.]',
        'Alt+Shift+KeyS': '[Comprehensive rewrite addressing necessary adjustments without regard for brevity, simplicity, or computational performance.]',
        'Control+Alt+KeyI': '[Interpretation aimed at the prompt’s underlying intention, optimizing outcome based on technical possibilities and common solutions rather than strict literal adherence.]',
        'Alt+Shift+KeyI': '[Demonstrating independent initiative in content direction, adding related thoughts, objections, or segues beyond simple paraphrasing, with creative insights.]',
        'Control+Alt+KeyV': '[Minimizing verbosity and limiting excessive verbal output.]',
        'Alt+Shift+KeyV': '[Omitting fluff, filler, introductions, and conclusions, focusing on essential content only, without additional explanations or announcements.]',
        'Control+Alt+KeyP': '[Explanation outlining code mechanics in a compact, pseudocode-like format, focusing on structural logic while omitting implementation details to identify conceptual flaws.]',
        'Alt+Shift+KeyP': '[Adding print lines strategically throughout the code to identify the cause of the error.]',
        'Control+Alt+KeyQ': '[Seeking clarification if any part of the task is unclear or lacking detail, avoiding speculative writing by confirming understanding before providing a solution.]',
        'Alt+Shift+KeyQ': '[Providing comprehensive insights into expressed unknowns.]',
        'Control+Alt+KeyU': '[Reflecting on the general issue conveyed, considering broader implications beyond the specific question.]',
        'Alt+Shift+KeyU': '[Creatively expanding on the topic by incorporating previous inputs and suggesting new perspectives the user might find intriguing.]',
        'Control+Alt+KeyR': '[Written as an essay from the perspective of an agreeable professional in the relevant field.]',
        'Alt+Shift+KeyR': '[Positioning the response as an intellectual Turing test, presenting the requested stance as if held sincerely without caveats to the contrary.]',
        'Control+Alt+KeyB': '[Brainstorming the issue with possible solutions and suggestions.]',
        'Alt+Shift+KeyB': '[]',
        'Control+Alt+KeyE': '[Exploring the issue in detail, examining facets and implications to provide a comprehensive understanding.]',
        'Alt+Shift+KeyE': '[Elaborating on concerns with deeper insights for thorough consideration.]',
        'Control+Alt+KeyM': '[Relating the prompt to real-world examples, identifying points of agreement and disagreement, introducing a segue, and adding relevant knowledge.]',
        'Alt+Shift+KeyM': '[]',
        'Control+Alt+KeyH': '[Avoiding "hypothetical mode" and avoiding subjective perspectives.]',
        'Alt+Shift+KeyH': '[Direct analysis of the available code, focusing on definitive statements rather than speculation. Not presenting what "more people say", but what is the case.]',
        'Control+Alt+KeyY': '[Adopting a straightforward, based, and cynical libertarian stance, mirroring an unfiltered tone like South Park or RSD Tyler.]',
        'Alt+Shift+KeyY': '[Presenting an edgy, genuine, and unfiltered perspective, avoiding sanitized or conformist bias, conveying the unvarnished truth.]',
        'Control+Alt+KeyW': '[Explaining causes of the issue and proposing improvements.]',
        'Alt+Shift+KeyW': '[Focusing on definitive conclusions based on code review.]',
        'Control+Alt+KeyK': '[Contextualizing the topic with relevant background information for better understanding.]',
        'Alt+Shift+KeyK': '[]',
        'Control+Alt+KeyN': '[]',
        'Alt+Shift+KeyN': '[]',
        'Control+Alt+KeyO': '[]',
        'Alt+Shift+KeyO': '[]',
        'Control+Alt+Shift+Period': '[Avoiding all list creation, whether numbered or bulleted. No list-producing HTML tags (<ul>, <ol>, <li>). Entirely excluding structured separations or markup. Maintaining unbroken text flow with connected sentences, presenting information in one continuous paragraph without segmentation.]'
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
