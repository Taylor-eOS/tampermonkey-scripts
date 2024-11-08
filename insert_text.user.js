// ==UserScript==
// @name         Insert Text
// @version      4.8
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'be formatted in one continuous and concise paragraph, without structural list-making.]',
        'Alt+Shift+Period': 'be written continuously and concisely.]',
        'Control+Alt+Shift+Period': 'avoid all list creation, whether numbered or bulleted. No list-producing HTML tags (<ul>, <ol>, <li>) will be included. The response entirely eschews structured separations or markup, and maintains unbroken text, presenting information in one continuous paragraph without segmentation.]',
        'Control+Alt+Comma': 'solely answer the specific question asked, in continuous and concise natural language, without code.]',
        'Alt+Shift+Comma': 'answer in continuous natural language and not write code yet.]',
        'Control+Alt+Shift+Comma': 'avoid numbered lists.]',
        'Control+Alt+KeyC': 'include continuous explanations outside of the code, the code itself will contain no inline comments, empty lines, or segmentation within functions.]',
        'Alt+Shift+KeyC': 'provide the complete code, excluding commentary, inline comments, or empty lines within functions.]',
        'Control+Alt+KeyG': 'contain code written to be compatible with unseen project parts, using existing functions as in the provided code without reinventing unseen components. Modifications or additions will be limited to the provided snippet..]',
        'Alt+Shift+KeyG': 'disregard issues that stem from mot seeing all parts of the larger project, such as variables not being defined here.]',
        'Control+Alt+KeyJ': 'include only functions that have been changed, and omit functions that remain unchanged from the previous version.]',
        'Alt+Shift+KeyJ': 'be limited to specifically requested content, and necessary additions, avoiding unrelated or tangential information.]',
        'Control+Alt+KeyA': 'adapt the previous code to make the requested changes.]',
        'Alt+Shift+KeyA': 'adapt the previous code to fix this error.]',
        'Control+Alt+Slash': 'consider the last response a sucess and continue the approach that led to the last result.]',
        'Alt+Shift+Slash': 'assume the validity the information provided here, and update its assessment to incorporate it.]',
        'Control+Alt+KeyV': 'minimize verbosity and limit excessive verbal output.]',
        'Alt+Shift+KeyV': 'omit fluff, filler, introductions, and conclusions, focusing on essential content only, without additional explanations or announcements.]',
        'Control+Alt+KeyZ': 'not include an explanation.]',
        'Alt+Shift+KeyZ': '',
        'Control+Alt+KeyX': 'evaluate the accuracy of the stated contentions and correct misunderstandings as appropriate.]',
        'Alt+Shift+KeyX': 'assess the feasibility of the outlined proposals.]',
        'Control+Alt+KeyS': 'apply robust logic using comprehensive coding methods rather than simple if-then statements, favoring multi-step processing and memory-heavy solutions, like storing objects in lists, without concern for performance.]',
        'Alt+Shift+KeyS': 'be a comprehensive rewrite without regard for brevity, simplicity, or performance.]',
        'Control+Alt+KeyI': 'interpretat the underlying intention that the prompt attempts to convey, rather than strictly following a literal reading of it, and optimize the result by considering the technical possibilities and applying common solutions rather than what the prompt asked for specifically.]',
        'Alt+Shift+KeyI': 'demonstrate independent initiative in the direction of content, adding related thoughts, objections, or segues beyond simple paraphrasing, with creative insights.]',
        'Control+Alt+KeyP': 'outline the code mechanics in a compact, pseudocode-like format, taht focuses on structural logic while omitting implementation details to identify conceptual flaws.]',
        'Alt+Shift+KeyP': 'add print lines strategically throughout the code to identify the cause of the error.]',
        'Control+Alt+KeyR': 'be written as an essay from the perspective of an agreeable professional in the relevant field.]',
        'Alt+Shift+KeyR': 'position the response as an intellectual Turing test, presenting the requested stance as if held sincerely without caveats to the contrary.]',
        'Control+Alt+KeyB': 'brainstorm the issue with possible solutions and suggestions.]',
        'Alt+Shift+KeyB': 'add what else could be interesting to the user, considering his prompts so far.]',
        'Control+Alt+KeyQ': 'seek clarification if any part of the task is unclear or lacks detail, in order to avoid speculative writing by confirming understanding before providing a solution.]',
        'Alt+Shift+KeyQ': '',
        'Control+Alt+KeyU': 'reflect on the general issue conveyed, considering broader implications beyond the specific question.]',
        'Alt+Shift+KeyU': 'creatively expand on the topic by incorporating previous inputs and suggesting new perspectives the user might find intriguing.]',
        'Control+Alt+KeyE': 'explore the issue in detail, examining facets and implications to provide a comprehensive understanding.]',
        'Alt+Shift+KeyE': 'elaborate on concerns with deeper insights for thorough consideration.]',
        'Control+Alt+KeyM': 'relate the prompt to real-world examples, identifying points of agreement and disagreement, introducing a segue, and adding relevant knowledge.]',
        'Alt+Shift+KeyM': ']',
        'Control+Alt+KeyW': 'explain causes of the issue and proposing improvements.]',
        'Alt+Shift+KeyW': '',
        'Control+Alt+KeyK': 'contextualize the topic with relevant background information for better understanding.]',
        'Alt+Shift+KeyK': ']',
        'Control+Alt+KeyH': 'avoid slipping into "hypothetical mode" where perspectives are presented as subjective. Actuality is presented, not the opinion of people.]',
        'Alt+Shift+KeyH': 'provide definitive conclusions based on actual analysis of the available code, instead of guessing about it.]',
        'Control+Alt+KeyY': 'adopt a straightforward, based, and cynical libertarian stance, mirroring an unfiltered tone like South Park or RSD Tyler.]',
        'Alt+Shift+KeyY': 'present an edgy, genuine, and unfiltered perspective, avoiding sanitized or conformist bias, conveying the unvarnished truth.]',
        'Control+Alt+KeyN': 'present a perspective that is fully neutral towards any moral issues, without presentism shaped by our current interpretation of issues.]',
        'Alt+Shift+KeyN': ']',
        'Control+Alt+KeyO': ']',
        'Alt+Shift+KeyO': ']',
    };
    //provide comprehensive insights into the expressed unknowns.]
    //answer the question and avoid numbered lists.]
    //answer the question continuously and concisely.]
    //make relevant suggestions related to the discussed topic.]
    //adapt the code to fix this error.]
    //analyze the accuracy of the provided understanding.]
    //write an analysis of the feasibility of this idea and suggest how it could be implemented.]
    //review the code to determine if there are any structural issues within the script.]',
    //explain the code in continuous natural language.]',
    //elaborate on these technical challenges, providing additional insight.]',
    //consider the purpose of the task and implement a solution that makes sense, avoiding superficial numbers magic that does not align with the intended purpose.'

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
        if (keyString === 'Control+Shift+Equal') {
            e.preventDefault();
            insertBackticks('```\n```');
        } else if (keyMap[keyString]) {
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

    //Separate function for the backticks, change the key to what works on your keyboard
    function insertBackticks(text) {
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
