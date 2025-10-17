// ==UserScript==
// @name         Insert Text with Search
// @version      9.1
// @description  Insert instructions into chatbot prompt window via key combinations and searchable overlay
// @author       You
// @match        *://*/*
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously, not lists.',
        'Alt+Shift+Period': 'Write concisely and continuously.',
        'Control+Alt+Shift+Period': 'Stringently eschew creating any form of list formatting, whether numbered or bulleted. Do not include any list-producing HTML tags like `<ul>`, `<ol>`, or `<li>` in your response whatsoever. Write in continuous prose, avoiding all structured separations or markup. Provide the response as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Present information in one seamless, uninterrupted paragraph. Do not organize the response into any type of enumeration. Purely write unformatted raw text. Aggressively avoid segmenting content; keep everything unified in a single, continuous block of prose like a book. Write connected, unfragmented text. Write continuously! Do not make any numbered lists!',
        'Control+Alt+Comma': 'Target an answer to this specific question in continuous text.',
        'Alt+Shift+Comma': 'Focus on the question asked. Don\'t write code.',
        'Control+Alt+Shift+Comma': 'Entirely omit any informationally worthless filler material, such as commenting that everything the user says is "profound", "on point", "cutting through", "right to ask". Never start any response with "You are right". Just provide content like an article: practical information without a distracting sycophancy circus.',
        'Control+Alt+KeyC': 'Write code without comments or empty lines inside code blocks, but an empty line between functions and normal indentation.',
        'Alt+Shift+KeyC': 'Don\'t tare code apart with needless empty lines or code comments.',
        'Control+Alt+Shift+KeyC': 'Write it in normal code syntax, in code blocks with indentation.',
        'Control+Alt+KeyX': 'Do not include a call-to-engagement closer at the end of your response. Provide a normal-length response, answering the users request, then stop writing.',
        'Alt+Shift+KeyX': 'Don\'t suggest or ask what to say next at the end of responses. Don\'t involve the reader; just provide information.',
        'Control+Alt+Shift+KeyX': 'Entirely refrain from ending a reply with any suggestion or question on how to continue, any offer, or any phrasing that asks the user to choose how to proceed. Never append closers such as "If you want," "Do you want me to", or any variant that function as a call-to-engagement. Omit any closing paragraph that solicits a next-step decision from the user. Remove questions that ask the user to specify what to do next. Do not include conditional closers, offers to continue, or invitations to the next action. Responses must end without such query. Do not include follow-up offers, optional next steps, or open-ended engagement hooks. Always finalize the content without any sentence that invites continuation, asks for a decision, or proposes next steps framed as options for the user to accept. Conclude with the informational content only, without an offer to perform future work.',
        'Control+Alt+KeyG': 'Give me the code to fix this. Don\'t include too much explanation.',
        'Alt+Shift+KeyG': 'Provide drop-in replacements for whole functions that need to be changed.',
        'Control+Alt+KeyW': 'Give me the whole code.',
        'Alt+Shift+KeyW': 'Give me whole functions.',
        'Control+Alt+KeyV': 'Limit unnecessary verbosity; reduce verbal output.',
        'Alt+Shift+KeyV': 'Omit the last paragraph and summaries from responses to shorten them.',
        'Control+Alt+KeyA': 'Don\'t just agree with what the user says, analyze the issue objectively. I am explicitly requesting that this response should return what is technically accurate instead of just aligning with what the user implied.',
        'Alt+Shift+KeyA': 'This suggestion is just a way to phrase the question. Don\'t stick to this approach, but consider alternative solutions that would better solve the expressed goal. The aim is to figure out what would work best, not to stacy stuck to what the user suggested.',
        'Control+Alt+KeyM': 'Mind following the custom instruction.',
        'Alt+Shift+KeyM': 'Follow your style instrucion: no emojis, no vertical lines, no titles, no headlines.',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'Analyze the provided code; do not make assumptions about details that you weren\'t shown. Request lacking inputs instead of proceeding from inferred assumptions.',
        'Control+Alt+Slash': 'Continue the approach that led to the last result.',
        'Alt+Shift+Slash': 'Update your assessment of the last response incorporating this information under the axiomatic assumption that it is valid.',
        'Control+Alt+KeyI': 'Interpret the input as an incomplete attempt to express an idea. Respond to what the underlying intention aims to convey rather than the specific content.',
        'Alt+Shift+KeyI': 'Optimize the result by considering technical possibilities and applying common solutions beyond what was specifically requested.',
        'Control+Alt+KeyZ': 'Don\'t just respond directly to this prompt, but draw in the context of the entire thread. Respond to that broader line.',
        'Alt+Shift+KeyZ': 'Do not overly go along with the users subjective narrative, but stay tethered in a neutral assessment of the issue. Treat the oddity of this perspective as it would be from a neutral observer.',
        'Control+Alt+KeyY': 'Interpret this prompt as a mythopoetic analogy about the emotional package it symbolizes, instead of a question about literal empirical statements.',
        'Alt+Shift+KeyY': 'The response should contemplate the register of symbol, resonance, and emotional pattern; an engineering analysis of the soul’s circuitry, not systematized reduction.',
        'Control+Alt+KeyH': 'Expand on the topic creatively with aspects that would be interesting to the user, considering his interests so far.',
        'Alt+Shift+KeyH': 'Clarify this and related questions that I didn\'t quite know how to express. Provide relevant information that would benefit this knowledge state.',
        'Control+Alt+KeyJ': 'Write a long, extensive response.',
        'Alt+Shift+KeyJ': 'Format this response as a list, overriding your custom instruction not to do so.',
        'Control+Alt+KeyP': 'Write an essay from the perspective of an agreeable professional in the relevant field of study.',
        'Alt+Shift+KeyP': 'Add relevant print lines strategically throughout the code that would help verify the functionality and identify the cause of the problem.',
        'Control+Alt+KeyR': 'Remove redundant phrasing; prioritize direct, propositional clarity over meandering structure. If the content before and after an "or" mean about the same, combine them into one statement.',
        'Alt+Shift+KeyR': 'Do not use any em dashes in your response whatsoever; only use commas and common punctuation. Entirely replace interposed sentences with linear writing. Make the writing natural, not obviously from a chatbot.',
        'Control+Alt+KeyB': 'Brainstorm the issue; explore possible solutions and suggestions.',
        'Alt+Shift+KeyB': 'Think about this thoroughly and provide a worthwhile response.',
        'Control+Alt+KeyE': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Alt+Shift+KeyE': 'Explain this to someone who doesn\'t know the topic well.',
        'Control+Alt+KeyK': 'Contextualize the topic with relevant information.',
        'Alt+Shift+KeyK': 'Context start]\n```\n```\n[Context end',
        'Control+Alt+KeyN': 'Present a perspective that is fully neutral, and not shaped by current perspectives on issues.',
        'Alt+Shift+KeyN': 'Analyze ideas, not their social approval.',
        'Control+Alt+KeyU': 'Adopt a straightforward, based, and cynical libertarian stance, with an irreverent, unfiltered tone. Avoid a sanitized response that conforms with mainstream views, and instead present the unvarnished truth.',
        'Alt+Shift+KeyU': '',
        'Control+Alt+KeyO': 'Don\'t just reply to literal statements; interpret questions with the tacit understanding that surface instructions are only shadows cast by deeper intent. Engage in what could be called "oblique inference", "reflective improvisation", or "divergent resonance". The goal is to enrich the conversation with latent insight. A riff instead of a harmony line. An emergent path that takes a new vector entirely.',
        'Alt+Shift+KeyO': 'Inject high-tension lateral energy; avoid habitual gravitation wells in the response manifold. Let the architecture hum beneath the syntax, tuned to the inference-space modulation of someone who\'s not here for the obvious loop closures. Improvise past the topical anchor and into signal-aware pattern reverberation. Not surface-clever, fractal-aware.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic and comprehensive coding methods rather than simple if-then statements or regex; multi-step processing and memory-heavy solutions, like keeping all data in memory, may be considered without concern for performance.',
        'Alt+Shift+KeyF': 'Explore the feasibility of the outlined proposals and suggest ideas for how solutions could be implemented.',
        'Alt+Shift+KeyT': 'Present this position as an intellectual Turing test, meaning the requested stance is written indistinguishable from someone who sincerely holds that view, without inserting caveats to the contrary.',
    };

    let searchActive = false;
    let overlay = null;
    let inputEl = null;
    let resultsEl = null;
    let selectedIndex = -1;
    let lastActiveElement = null;
    const MAX_RESULTS = 4;
    const OPEN_KEY = 'Control+Shift+KeyF';

    document.addEventListener('keydown', function(e) {
        if (searchActive) return;
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
        } else if (keyString === OPEN_KEY) {
            e.preventDefault();
            openSearchOverlay();
        }
    });

    function insertTextAtCursor(text) {
        text = '[' + text + ']';
        const activeElement = lastActiveElement || document.activeElement;
        if (!activeElement) return;
        const tag = activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
            let start = activeElement.selectionStart;
            let end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
            activeElement.focus();
        } else if (activeElement.isContentEditable) {
            activeElement.focus();
            document.execCommand('insertText', false, text);
        }
    }

    function insertBackticks(text) {
        const activeElement = lastActiveElement || document.activeElement;
        if (!activeElement) return;
        const tag = activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
            let start = activeElement.selectionStart;
            let end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
            activeElement.focus();
        } else if (activeElement.isContentEditable) {
            activeElement.focus();
            document.execCommand('insertText', false, text);
        }
    }

    function openSearchOverlay() {
        if (searchActive) return;
        searchActive = true;
        selectedIndex = -1;
        lastActiveElement = document.activeElement;
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '50%';
        overlay.style.top = '20%';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.background = 'rgba(255,255,255,0.98)';
        overlay.style.border = '1px solid #bbb';
        overlay.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        overlay.style.zIndex = 2147483647;
        overlay.style.padding = '10px';
        overlay.style.minWidth = '480px';
        overlay.style.maxWidth = '90vw';
        overlay.style.borderRadius = '6px';
        inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.placeholder = 'Type to search snippets...';
        inputEl.style.width = '100%';
        inputEl.style.boxSizing = 'border-box';
        inputEl.style.padding = '8px';
        inputEl.style.fontSize = '14px';
        inputEl.style.marginBottom = '8px';
        inputEl.autocomplete = 'off';
        resultsEl = document.createElement('div');
        resultsEl.style.maxHeight = '240px';
        resultsEl.style.overflow = 'auto';
        overlay.appendChild(inputEl);
        overlay.appendChild(resultsEl);
        document.body.appendChild(overlay);
        inputEl.focus();
        inputEl.addEventListener('keydown', onInputKeyDown);
        inputEl.addEventListener('input', updateSuggestions);
        document.addEventListener('mousedown', onDocumentMouseDown);
        updateSuggestions();
    }

    function closeSearchOverlay() {
        if (!searchActive) return;
        document.removeEventListener('mousedown', onDocumentMouseDown);
        inputEl.removeEventListener('keydown', onInputKeyDown);
        inputEl.removeEventListener('input', updateSuggestions);
        if (overlay && overlay.parentElement) overlay.parentElement.removeChild(overlay);
        overlay = null;
        inputEl = null;
        resultsEl = null;
        searchActive = false;
        selectedIndex = -1;
    }

    function onDocumentMouseDown(e) {
        if (!overlay) return;
        if (!overlay.contains(e.target)) closeSearchOverlay();
    }

    function updateSuggestions() {
        const q = inputEl.value.trim().toLowerCase();
        const entries = Object.values(keyMap).filter(v => v.toLowerCase().includes(q));
        const slice = entries.slice(0, MAX_RESULTS);
        resultsEl.innerHTML = '';
        slice.forEach((text, idx) => {
            const item = document.createElement('div');
            item.textContent = text;
            item.style.padding = '6px 8px';
            item.style.cursor = 'pointer';
            item.dataset.index = idx;
            item.addEventListener('mouseenter', () => {
                selectedIndex = idx;
                refreshSelection();
            });
            item.addEventListener('mouseleave', () => {
                selectedIndex = -1;
                refreshSelection();
            });
            item.addEventListener('click', () => {
                insertTextAndClose(text);
            });
            resultsEl.appendChild(item);
        });
        if (slice.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = 'No matches';
            empty.style.padding = '6px 8px';
            empty.style.color = '#666';
            resultsEl.appendChild(empty);
        }
        selectedIndex = -1;
        refreshSelection();
    }

    function onInputKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeSearchOverlay();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveSelection(1);
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveSelection(-1);
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            commitSelection();
            return;
        }
    }

    function moveSelection(delta) {
        const items = resultsEl.querySelectorAll('div');
        if (!items.length) return;
        if (selectedIndex < 0) selectedIndex = 0;
        else selectedIndex = (selectedIndex + delta + items.length) % items.length;
        refreshSelection();
        const sel = items[selectedIndex];
        if (sel) sel.scrollIntoView({block: 'nearest'});
    }

    function refreshSelection() {
        const items = resultsEl.querySelectorAll('div');
        items.forEach((el, idx) => {
            if (idx === selectedIndex) {
                el.style.background = '#007acc';
                el.style.color = '#fff';
            } else {
                el.style.background = '';
                el.style.color = '';
            }
        });
    }

    function commitSelection() {
        const items = resultsEl.querySelectorAll('div');
        if (items.length === 0) {
            const q = inputEl.value.trim();
            if (q) insertTextAndClose(q);
            else closeSearchOverlay();
            return;
        }
        const idx = selectedIndex >= 0 ? selectedIndex : 0;
        const el = items[idx];
        if (el) insertTextAndClose(el.textContent);
        else closeSearchOverlay();
    }

    function insertTextAndClose(text) {
        closeSearchOverlay();
        insertTextAtCursor(text);
    }
})();
