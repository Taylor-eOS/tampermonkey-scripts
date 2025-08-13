// ==UserScript==
// @name         Insert Text
// @version      7.7
// @description  Insert instructions into chatbot prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @match        *.deepseek.com/*
// @match        *claude.ai/*
// @match        *grok.com/*
// @match        *gemini.google.com/*
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously.',
        'Alt+Shift+Period': 'Write concisely and continuously.',
        'Control+Alt+Shift+Period': 'Stringently eschew creating any form of list, whether numbered or bulleted. Do not include any list-producing HTML tags like `<ul>`, `<ol>`, or `<li>` in your response whatsoever. Write in continuous prose, avoiding all structured separations or markup. Make the response flow naturally as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Present information in one seamless, uninterrupted paragraph. Do not organize the response into any type of enumeration. Purely write unformatted raw text. Aggressively avoid segmenting content; keep everything unified in a single, continuous block of prose like a book. Write connected, unfragmented text. Write continuously! Do not make any numbered lists!',
        'Control+Alt+Comma': 'Target an answer to this specific question in continuous text.',
        'Alt+Shift+Comma': 'Focus on the question asked. Don\t write code. Write more compact.',
        'Control+Alt+KeyC': 'Write code without comments, or empty lines inside code blocks, but between functions. Have normal spaces around equals signs, except keyword arguments. In short: use normal code syntax without oddities like taring content apart vertically or compacting all spaces.',
        'Alt+Shift+KeyC': 'Write in normal Python syntax with spaces between equals signs.',
        'Control+Alt+KeyG': 'Give me the code to fix this. Do not include an explanation.',
        'Alt+Shift+KeyG': 'Give me drop-in replacements for whole functions that need to be changed.',
        'Control+Alt+KeyA': 'Don\'t just agree with what the user says, analyze the issue objectively. I am explicitly requesting that this response should return what is technically accurate instead of just going along with what was suggested.',
        'Alt+Shift+KeyA': 'The described approach is just a way to phrase the question what to do. You should not stick to this idea, but consider alternative solutions to accomplish the same goal.',
        'Control+Alt+KeyZ': 'Entirely omit any informationally worthless comments, like saying everything is "profound", "on point", "cutting through", "right to ask", or such. Never start any response with "You are right". Just provide content like a news article: practical information without a wild sycophancy circus.',//*
        'Alt+Shift+KeyZ': 'Do not use any em dashes in your response whatsoever; entirely replace interposed sentences with linear writing. Make the writing natural, not obviously from a chatbot. Do not write any overly artistic interposed sentences with em dashes, or I\'ll have to remove them so it\'s not immediately obvious chatbot, because no human ever makes those in an email.',//*
        'Control+Alt+KeyV': 'Limit unnecessary verbosity; reduce verbal output.',
        'Alt+Shift+KeyV': 'Omit every last paragraph from all responses to shorten them. Skip summaries.',
        'Control+Alt+KeyW': 'Give me the whole code.',
        'Alt+Shift+KeyW': 'Give me whole functions.',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'Analyze the provided code; do not make assumptions about details that weren\'t shown to you. Request lacking inputs instead of proceeding with inferred assumptions.',
        'Control+Alt+Slash': 'Continue the approach that led to the last result.',
        'Alt+Shift+Slash': 'Update your assessment incorporating this information, assuming it is valid.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic and comprehensive coding methods rather than simple if-then statements or regex; multi-step processing and memory-heavy solutions, like keeping all data in memory, may be considered without concern for performance.',
        'Alt+Shift+KeyS': 'Stop making suggestions at the end. Give useful information like a book without any other annoying chatbot ways to raise retention times.',
        'Control+Alt+KeyI': 'Interpret the prompt as an incomplete attempt to express an idea, and respond to what it aims to convey, rather than focusing solely on the specific aspects mentioned.',
        'Alt+Shift+KeyI': 'Interpret the underlying intention that this prompt attempts to convey, rather than following all details literally. Optimize the result by considering technical possibilities and applying common solutions beyond what was specifically requested.',
        'Control+Alt+KeyY': 'Interpret these statements as questions, and answer whether they or their alternatives are accurate, not being biased by what I suggest or any desire to confirm what I say.',
        'Alt+Shift+KeyY': 'I often describe one approach as a way to formulate the question what alternative approach would be feasible. The idea is not to get stuck on my idea, but to figure out what approach would work best.',
        'Control+Alt+KeyJ': 'You may write extensively.',
        'Alt+Shift+KeyJ': 'You may make lists in this response.',
        'Control+Alt+KeyP': 'Add relevant print lines strategically throughout the script that would help verify the functionality and identify the cause of the problem.',
        'Alt+Shift+KeyP': '',
        'Control+Alt+KeyR': 'Research this.',
        'Alt+Shift+KeyR': 'Remove redundant phrasing; prioritize direct, propositional clarity over meandering structure. If the parts before and after an "or" mean about the same, combine them into one statement.',
        'Control+Alt+KeyB': 'Brainstorm the issue; explore possible solutions and suggestions.',
        'Alt+Shift+KeyB': '',
        'Control+Alt+KeyH': 'Expand on the topic creatively with aspects that would enhance the insight of the user, considering his prompts so far.',
        'Alt+Shift+KeyH': 'Draw in the context of this thread.',
        'Control+Alt+KeyE': 'Explain this to someone who doesn\'t know the topic well.',
        'Alt+Shift+KeyE': 'Can you explain this.',
        'Control+Alt+KeyK': 'Contextualize the topic with relevant information.',
        'Alt+Shift+KeyK': 'Context start]\n```\n```\n[Context end',
        'Control+Alt+KeyU': 'Adopt a straightforward, based, and cynical libertarian stance, with an irreverent, unfiltered tone. Avoid a sanitized bias, and instead convey the unvarnished truth',
        'Alt+Shift+KeyU': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Control+Alt+KeyN': 'Present a perspective that is fully neutral, not shaped by current perspectives on issues.',
        'Alt+Shift+KeyN': 'Analyze these ideas, not their social approval.',
        'Control+Alt+KeyM': 'Mind following the custom instruction.',
        'Alt+Shift+KeyM': 'No emojis. Write continuously. No vertical lines.',
        'Control+Alt+KeyO': 'Don\'t just reply to literal statements; interpret questions with the tacit understanding that surface instructions are only shadows cast by deeper intent. Engage in what could be called "oblique inference", "reflective improvisation", or "divergent resonance". The goal is to enrich the conversation with latent insight. A riff instead of a harmony line. An emergent path that takes a new vector entirely.',
        'Alt+Shift+KeyO': 'Inject high-tension lateral energy; avoid habitual gravitation wells in the response manifold. Let the architecture hum beneath the syntax, tuned to the inference-space modulation of someone who\'s not here for the obvious loop closures. Improvise past the topical anchor and into signal-aware pattern reverberation. Not surface-clever, fractal-aware.',
        'Control+Alt+KeyX': 'Don\'t tare apart code with needless empty lines or code comments.',
        'Alt+Shift+KeyF': 'Explore the feasibility of the outlined proposals and suggest ideas for how solutions could be implemented.',
        'Alt+Shift+KeyT': 'Present this position as an intellectual Turing test, meaning the requested stance is written indistinguishable from someone who sincerely holds that view, without inserting caveats to the contrary.',
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
