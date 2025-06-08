// ==UserScript==
// @name         Insert Text
// @version      6.7
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @match        *.deepseek.com/*
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously.',
        'Alt+Shift+Period': 'Write concisely and continuously, no segmentation.',
        'Control+Alt+Comma': 'Target an answer to this specific question, in continuous natural language without code.',
        'Alt+Shift+Comma': 'Write a bit more compact. Focus on the question asked.',
        'Control+Alt+KeyC': 'Omit code comments (lines starting with `#`) and empty lines in code blocks. Use normal Python syntax with spaces.',
        'Alt+Shift+KeyC': 'Provide drop-in replacements for the functions that need to be changed.',
        'Control+Alt+KeyG': 'Give me the code to fix this. Do not include an explanation.',
        'Alt+Shift+KeyG': 'Adapt the code to make the required changes.',
        'Control+Alt+KeyJ': 'Just provide the requested content specifically.',
        'Alt+Shift+KeyJ': '',
        'Control+Alt+KeyA': 'Don\'t just agree with what I say, analyze the issue objectively. I am explicitly requesting that this response should return what is correct, not necessarily confirm what I already believe.',
        'Alt+Shift+KeyA': 'Analyze the provided code and provide an answer from that background.',
        'Control+Alt+KeyV': 'Limit unneccesary verbosity and excessive verbal output.',
        'Control+Alt+KeyZ': 'Write without structural lists.',
        'Alt+Shift+KeyZ': 'Replace interposed sentences with linear writing. Do not use interposed sentences. Write the next idea in the next sentence. Entirely avoid em dashes.',
        'Control+Alt+KeyX': '',
        'Alt+Shift+KeyX': '',
        'Control+Alt+Slash': 'Continue the approach that led to the last result.',
        'Alt+Shift+Slash': 'Update your assessment incorporating this information, assuming it is valid.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic and comprehensive coding methods rather than simple if-then statements or regex. Multi-step processing and memory-heavy solutions, like keeping all data in memory, may be considered without concern for performance.',
        'Alt+Shift+KeyS': 'Write it in normal Python syntax with spaces between signs.',
        'Control+Alt+KeyI': 'Interpret the underlying intention that this prompt attempts to convey, rather than following all details literally. Optimize the result by considering technical possibilities and applying common solutions beyond what was specifically requested.',
        'Alt+Shift+KeyI': 'Interpret the prompt as an incomplete attempt to express an idea, and respond to what it aims to convey, rather than focusing solely on the specific aspects mentioned.',
        'Control+Alt+KeyP': 'Write an essay from the perspective of an agreeable professional in the relevant field of study.',
        'Alt+Shift+KeyP': 'Add relevant print lines strategically throughout the script that would help verify the functionality and identify the cause of the problem.',
        'Control+Alt+KeyR': '',
        'Alt+Shift+KeyR': 'Review this code and suggest possible flaws.',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'Rewrite the code mechanics into a compact pseudocode-like outline of the structural logic, that omits implementation details, that would help with the identification of conceptual flaws.',
        'Control+Alt+KeyB': 'Brainstorm the issue. Explore possible solutions and suggestions.',
        'Alt+Shift+KeyB': 'Make some suggestions',
        'Control+Alt+KeyE': 'Expand on the topic creatively in a way that would be interesting to the user, considering his prompts so far.',
        'Alt+Shift+KeyE': 'Explore the question like a person would, who is not sure of the right answer, but tries to weigh different possibilities.',
        'Control+Alt+KeyK': 'Contextualize the topic with relevant information.',
        'Alt+Shift+KeyK': '',
        'Control+Alt+KeyH': 'Assess the feasibility of the outlined proposals and suggest how they could be implemented.',
        'Control+Alt+KeyU': 'Adopt a straightforward, based, and cynical libertarian stance, mirroring an unfiltered tone like South Park or RSD Tyler. Avoid a sanitized bias and instead convey the unvarnished truth',
        'Alt+Shift+KeyU': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Control+Alt+KeyW': 'Give me the whole function.',
        'Alt+Shift+KeyW': '',
        'Control+Alt+KeyY': '',
        'Alt+Shift+KeyY': '',
        'Control+Alt+KeyN': 'Present a perspective that is fully neutral, not shaped by current perspectives on issues.',
        'Alt+Shift+KeyN': 'Analyze these ideas, not their social approval.',
        'Control+Alt+KeyM': 'Mind the custom instruction.',
        'Alt+Shift+KeyM': 'Present this as a intellectual Turing test, meaning the requested stance is written indistinguishable from someone who sincerely holds that view, without inserting caveats to the contrary.',
        'Control+Alt+KeyO': 'Don\'t just reply to literal statements. Write with the tacit understanding that surface instructions are only shadows cast by deeper intent. Engage in what could be called "oblique inference", "reflective improvisation", or "divergent resonance". The goal is to enrich the conversation with latent insight. A riff instead of a harmony line. An emergent path that takes a new vector entirely.',
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
