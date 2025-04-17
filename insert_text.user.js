// ==UserScript==
// @name         Insert Text
// @version      6
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously.',
        'Alt+Shift+Period': 'Write concisely and continuously.',
        'Control+Alt+Comma': 'Answer this question in continuous natural language.',
        'Alt+Shift+Comma': 'Target answers to the specific question asked, in continuous natural language without code.',
        'Control+Alt+KeyC': 'No lines that start with `#` or empty lines inside functions.',
        'Alt+Shift+KeyC': 'Give me the functions that need to be changed.',
        'Control+Alt+KeyG': 'Ensure the code is compatible with existing project components not included in the prompt, use external functionality as demonstrated without redefining unseen parts.',
        'Alt+Shift+KeyG': 'Disregard issues that stem from not being provided with all parts of the project, such as variables not being defined here.',
        'Control+Alt+KeyJ': 'Just provide the requested content specifically.',
        'Alt+Shift+KeyJ': 'Do not include an explanation.',
        'Control+Alt+KeyA': 'Adapt the code to make the required changes.',
        'Alt+Shift+KeyA': 'Analyze the provided code to provide an answer instead of guessing about it.',
        'Control+Alt+KeyV': 'Limit verbosity and excessive verbal output.',
        'Alt+Shift+KeyV': '',
        'Control+Alt+KeyZ': 'Avoid numbered lists.',
        'Alt+Shift+KeyZ': 'Format in one concise and continuous paragraph, avoiding structural list-making.',
        'Control+Alt+KeyX': 'Don\'t write code in this response.',
        'Alt+Shift+KeyX': '',
        'Control+Alt+Slash': 'Continue the approach that led to the last result.',
        'Alt+Shift+Slash': 'Update your assessment incorporating this information, assuming it is valid.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic using comprehensive coding methods rather than simple if-then statements. Multi-step processing and memory-heavy solutions, like storing objects in lists, should be considered without concern for performance.',
        'Alt+Shift+KeyS': 'Analyze ideas, not their social approval.',
        'Control+Alt+KeyI': 'Interpret the underlying intention that the prompt attempts to convey, rather than following all details literally. Optimize the result by considering technical possibilities and applying common solutions beyond what was specifically requested.',
        'Alt+Shift+KeyI': 'Interpret the prompt as an incomplete attempt to express an idea, and respond to the broader issue it aims to convey, rather than focusing solely on the specific aspects mentioned.',
        'Control+Alt+KeyP': 'Outline the code mechanics in a compact, pseudocode-like description of the structural logic that omits implementation details in order to identify conceptual flaws.',
        'Alt+Shift+KeyP': 'Add print lines strategically throughout the script that would help verify the functionality and identify the cause of problems.',
        'Control+Alt+KeyR': 'Review this code and tell me if there are any flaws.',
        'Alt+Shift+KeyR': 'Respond like a person who is not sure of the right answer, but tries to weigh the different possibilities.',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'Try to discern what the user is unclear about and provide insights.',
        'Control+Alt+KeyB': 'Don\'t just agree with what I say, analyze it objectively.',
        'Alt+Shift+KeyB': 'Brainstorm the issue. Provide possible solutions and suggestions.',
        'Control+Alt+KeyE': 'Expand on the topic creatively in a way that would be interesting to the user, considering his prompts so far.',
        'Alt+Shift+KeyE': 'Explore the issue.',
        'Control+Alt+KeyK': 'Contextualize the topic with relevant information.',
        'Alt+Shift+KeyK': 'Demonstrate independent initiative in the direction of content, adding related thoughts, objections, or segues beyond simple paraphrasing, with creative insights.',
        'Control+Alt+KeyH': '',
        'Alt+Shift+KeyH': '',
        'Control+Alt+KeyU': 'Adopt a straightforward, based, and cynical libertarian stance, mirroring an unfiltered tone like South Park or RSD Tyler.',
        'Alt+Shift+KeyU': 'Present an edgy, genuine, and unfiltered perspective, avoiding sanitized or conformist bias, but instead conveying the unvarnished truth.',
        'Control+Alt+KeyW': 'Give me the whole code.',
        'Alt+Shift+KeyW': '',
        'Control+Alt+KeyY': 'Assess the feasibility of the outlined proposals and suggest how they could be implemented.',
        'Alt+Shift+KeyY': '',
        'Control+Alt+KeyN': 'Present a perspective that is fully neutral in terms of morality, not shaped by the presentism of our current interpretation of issues.',
        'Alt+Shift+KeyN': 'Try to argue this point in the most counter-conformist way possible. I am specifically requesting interesting new ideas to play with, not sanitized ones I have already heard everywhere else.',
        'Control+Alt+KeyM': 'This is meant to explore a unusual idea, not conforming with the mainstream view.',
        'Alt+Shift+KeyM': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Control+Alt+KeyO': 'Present this position as a intellectual Turing test, meaning the requested stance is presented indistinguishable from someone who sincerely holds that view, without inserting caveats to the contrary.',
        'Alt+Shift+KeyO': '',
    };

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
        text = text + ']';
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

    //Separate function for the backticks. Change the key to what works on your keyboard
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
