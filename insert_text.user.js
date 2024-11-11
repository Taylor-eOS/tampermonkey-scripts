// ==UserScript==
// @name         Insert Text
// @version      5.0
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Format in one continuous and concise paragraph, without structural list-making.]',
        'Alt+Shift+Period': 'Write continuously and concisely.]',
        'Control+Alt+Shift+Period': 'Avoid all list creation, whether numbered or bulleted. No list-producing HTML tags (<ul>, <ol>, <li>) will be included. The response entirely eschews structured separations or markup, and maintains unbroken text, presenting information in continuous prose without segmentation.]',
        'Control+Alt+Comma': 'Solely answer the specific question asked, in continuous and concise natural language without code.]',
        'Alt+Shift+Comma': 'Answer the question in continuous natural language, without writing code yet.]',
        'Control+Alt+KeyC': 'Include continuous explanations outside of the code, while the code itself will contain no inline comments, empty lines, or segmentation within functions.]',
        'Alt+Shift+KeyC': 'Provide the complete code, excluding commentary, inline comments, or empty lines within functions.]',
        'Control+Alt+KeyG': 'Contain code written to be compatible with unseen project parts, using existing functions as in the provided code without reinventing unseen components. Modifications or additions will be limited to the provided snippet.]',
        'Alt+Shift+KeyG': 'Disregard issues that stem from mot seeing all parts of the larger project, such as variables not being defined here.]',
        'Control+Alt+KeyJ': 'Include only functions that have been changed, and omit functions that remain unchanged from the previous version.]',
        'Alt+Shift+KeyJ': 'Limit to specifically the requested content, and necessary additions, avoiding unrelated or tangential information.]',
        'Control+Alt+KeyV': 'Limit verbosity and excessive verbal output.]',
        'Alt+Shift+KeyV': 'Omit fluff, filler, introductions, and conclusions, and focus on essential content only, without additional explanations or announcements of actions.]',
        'Control+Alt+KeyA': 'Adapt the previous code to make the requested changes without apologizing.]',
        'Alt+Shift+KeyA': 'Adapt the previous code to fix this error without apologizing.]',
        'Control+Alt+Slash': 'Consider the last response a sucess and continue the approach that led to the last result.]',
        'Alt+Shift+Slash': 'Update its assessment to incorporate this information, assuming it is valid.]',
        'Control+Alt+KeyZ': 'Avoid numbered lists.]',
        'Alt+Shift+KeyZ': 'Be brief.]',
        'Control+Alt+KeyX': 'Do not include an explanation.]',
        'Alt+Shift+KeyX': '',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. It may apply robust logic using comprehensive coding methods rather than simple if-then statements. Multi-step processing and memory-heavy solutions, like storing objects in lists, are considered without concern for performance.]',
        'Alt+Shift+KeyS': 'Treat this code as a learning project where there is no concern for brevity, simplicity, or performance.]',
        'Control+Alt+KeyP': 'Outline the code mechanics in a compact, pseudocode-like format, that focuses on structural logic while omitting implementation details to identify conceptual flaws.]',
        'Alt+Shift+KeyP': 'Add print lines strategically throughout the code to identify the cause of the error.]',
        'Control+Alt+KeyR': 'Write an essay from the perspective of an agreeable professional in the relevant field.]',
        'Alt+Shift+KeyR': 'Present this position as a intellectual Turing test, meaning the requested stance is presented indistinguishabe from someone who sincerely holds that view, without inserting caveats to the contrary.]',
        'Control+Alt+KeyQ': 'Seek clarification if any part of the task is unclear or lacks detail, in order to avoid speculative writing by confirming understanding before providing a solution.]',
        'Alt+Shift+KeyQ': 'Check whether the required code has been provided before providing a solution, and request functions that were not provided if they are necessary to fulfill the task, instead of provding a response based on incomplete information.',
        'Control+Alt+KeyI': 'Interpret the underlying intention that the prompt attempts to convey, rather than strictly following a literal reading of it, and optimize the result by considering the technical possibilities and applying common solutions rather than what the prompt expressed specifically.]',
        'Alt+Shift+KeyI': 'Interpret the prompt as an incomplete attempt to phrase a concern, and respond to the broader issue this attempts to convey, rather than to just focus on the specific aspects that were expressed.]',
        'Control+Alt+KeyU': 'Demonstrate independent initiative in the direction of content, adding related thoughts, objections, or segues beyond simple paraphrasing, with creative insights.]',
        'Alt+Shift+KeyU': 'Creatively expand on the topic by incorporating previous inputs and suggesting new perspectives the user might find intriguing.]',
        'Control+Alt+KeyB': 'Brainstorm the issue, as well as possible solutions or suggestions.]',
        'Alt+Shift+KeyB': 'Add content could be interesting to the user, considering his prompts so far.]',
        'Control+Alt+KeyE': 'Explore the issue in detail, examining facets and implications to provide a comprehensive understanding.]',
        'Alt+Shift+KeyE': 'Elaborate on concerns with deeper insights for thorough consideration.]',
        'Control+Alt+KeyK': 'Contextualize the topic with relevant background information for better understanding.]',
        'Alt+Shift+KeyK': 'Broadly treat the issue, including: relating it to real-world examples, identifying points of agreement and disagreement, introducing a segue, and adding relevant knowledge.',
        'Control+Alt+KeyH': 'Avoid slipping into "hypothetical mode" where perspectives are presented as subjective. And presenting actuality, not "what many people say".]',
        'Alt+Shift+KeyH': 'Provide definitive conclusions based on actual analysis of the available code, instead of guessing about it.]',
        'Control+Alt+KeyY': 'Adopt a straightforward, based, and cynical libertarian stance, mirroring an unfiltered tone like South Park or RSD Tyler.]',
        'Alt+Shift+KeyY': 'Present an edgy, genuine, and unfiltered perspective, avoiding sanitized or conformist bias, but instead conveying the unvarnished truth.]',
        'Control+Alt+KeyN': 'Present a perspective that is fully neutral in terms of morality, and no shaped by the presentism of our current interpretation of issues.]',
        'Alt+Shift+KeyN': '',
        'Control+Alt+KeyW': 'Review the code to determine if there are any structural issues.]',
        'Alt+Shift+KeyW': 'Do what makes sense instead of giving me any more "cars without an engine".]',
        'Control+Alt+KeyM': '',
        'Alt+Shift+KeyM': '',
        'Control+Alt+KeyO': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where appropriate.]',
        'Alt+Shift+KeyO': 'Assess the feasibility of the outlined proposals and suggest how they could be implemented.]',
    };
    //Suggest causes of the issue and proposing improvements.
    //Make relevant suggestions related to the discussed topic.
    //Provide comprehensive insights into the expressed unknowns.
    //Explain the code in continuous natural language.
    //Elaborate on these technical challenges, providing additional insight.
    //Implement a solution that makes sense with regart to the purpose of this project, avoiding content that does not align with the intended purpose.'

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
        text = '[' + text;
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
