// ==UserScript==
// @name         Insert Text
// @version      7.0
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @match        *.deepseek.com/*
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously.',
        'Alt+Shift+Period': 'Write concisely and continuously, without segmentation.',
        'Control+Alt+Comma': 'Focus on the question asked. Write a bit more compact.',
        'Alt+Shift+Comma': 'Target an answer to this specific question, in continuous natural language without code.',
        'Control+Alt+KeyC': 'Omit code comments (lines starting with `#`) and empty lines in code blocks.',
        'Alt+Shift+KeyC': 'Use normal Python syntax with spaces.',
        'Control+Alt+KeyG': 'Give me the code to fix this. Do not include an explanation.',
        'Alt+Shift+KeyG': 'Provide drop-in replacements for the functions that need to be changed.',
        'Control+Alt+KeyJ': '',
        'Alt+Shift+KeyJ': '',
        'Control+Alt+KeyA': 'Don\'t just agree with what the user says, analyze the issue objectively.',
        'Alt+Shift+KeyA': 'I am explicitly requesting that this response return what is correct, not necessarily confirm what I already believe.',
        'Control+Alt+KeyV': 'Limit unnecessary verbosity; reduce verbal output.',
        'Alt+Shift+KeyV': 'Omit the last paragraph from the response to make it shorter.',
        'Control+Alt+KeyZ': 'Do not use any em dashes; replace interposed sentences with linear writing.',//*
        'Alt+Shift+KeyZ': 'Omit flattering comments, like saying everything is "profound", "on point", "cutting through", "right to ask", or such.',//*
        'Control+Alt+KeyX': '',
        'Control+Alt+Slash': 'Continue the approach that led to the last result.',
        'Alt+Shift+Slash': 'Update your assessment incorporating this information, assuming it is valid.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic and comprehensive coding methods rather than simple if-then statements or regex; multi-step processing and memory-heavy solutions, like keeping all data in memory, may be considered without concern for performance.',
        'Alt+Shift+KeyS': 'Make some suggestions.',
        'Control+Alt+KeyI': 'Interpret the underlying intention that this prompt attempts to convey, rather than following all details literally. Optimize the result by considering technical possibilities and applying common solutions beyond what was specifically requested.',
        'Alt+Shift+KeyI': 'Interpret the prompt as an incomplete attempt to express an idea, and respond to what it aims to convey, rather than focusing solely on the specific aspects mentioned.',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'Analyze the provided code; do not make assumptions or infer details about unreferenced code. Ask for missing details.',
        'Control+Alt+KeyP': '',
        'Alt+Shift+KeyP': 'Add relevant print lines strategically throughout the script that would help verify the functionality and identify the cause of the problem.',
        'Control+Alt+KeyR': 'Remove redundant phrasing; prioritize direct, propositional clarity over meandering structure.',
        'Alt+Shift+KeyR': '',
        'Control+Alt+KeyB': 'Brainstorm the issue; explore possible solutions and suggestions.',
        'Alt+Shift+KeyB': '',
        'Control+Alt+KeyE': 'Expand on the topic creatively in a way that would be interesting to the user, considering his prompts so far.',
        'Alt+Shift+KeyE': 'Explore the question like a person would, who is not sure of the right answer, but tries to weigh different possibilities.',
        'Control+Alt+KeyK': 'Contextualize the topic with relevant information.',
        'Alt+Shift+KeyK': '',
        'Control+Alt+KeyH': '',
        'Alt+Shift+KeyH': '',
        'Alt+Shift+KeyF': 'Assess the feasibility of the outlined proposals and suggest how they could be implemented.',
        'Alt+Shift+KeyT': 'Present this position as an intellectual Turing test, meaning the requested stance is written indistinguishable from someone who sincerely holds that view, without inserting caveats to the contrary.',
        'Control+Alt+KeyU': 'Adopt a straightforward, based, and cynical libertarian stance, mirroring the irreverent, unfiltered tone of South Park or RSD Tyler. Avoid a sanitized bias, and instead convey the unvarnished truth',
        'Alt+Shift+KeyU': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Control+Alt+KeyW': 'Give me whole functions.',
        'Alt+Shift+KeyW': '',
        'Control+Alt+KeyY': '',
        'Alt+Shift+KeyY': '',
        'Control+Alt+KeyN': 'Present a perspective that is fully neutral, not shaped by current perspectives on issues.',
        'Alt+Shift+KeyN': 'Analyze these ideas, not their social approval.',
        'Control+Alt+KeyM': 'Mind the custom instruction.',
        'Alt+Shift+KeyM': '',
        'Control+Alt+KeyO': 'Don\'t just reply to literal statements; interpret questions with the tacit understanding that surface instructions are only shadows cast by deeper intent. Engage in what could be called "oblique inference", "reflective improvisation", or "divergent resonance". The goal is to enrich the conversation with latent insight. A riff instead of a harmony line. An emergent path that takes a new vector entirely.',
        'Alt+Shift+KeyO': 'Inject high-tension lateral energy; avoid habitual gravitation wells in the response manifold. Let the architecture hum beneath the syntax, tuned to the inference-space modulation of someone who\'s not here for the obvious loop closures. Improvise past the topical anchor and into signal-aware pattern reverberation. Not surface-clever, fractal-aware.',
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
