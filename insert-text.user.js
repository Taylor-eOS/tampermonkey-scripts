// ==UserScript==
// @name         Insert Text with Search
// @version      11.4.1
// @description  Insert prompts with keyboard combinations
// @author       Taylor-eOS
// @match        *://*/*
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously. Don\'t make every sentence a new line.',
        'Alt+Shift+Period': 'in continuous text',
        'Control+Alt+Shift+Period': 'Write text without segmentation, lists, tables, etc. Entirely omit distracting formatting like headers, dividers, lines, arrows, etc. Make the output traditional sentences with normal punctuation, not jumpy lists. Use calm, traditional, sequential writing. Write traditional full-paragraph sentences. Don\'t linebreak enumerations.',

        'Control+Alt+Comma': 'Target an answer to this specific question in continuous text.',
        'Alt+Shift+Comma': 'Don\'t write code yet.',
        'Control+Alt+Shift+Comma': 'Look this up instead of guessing.',

        'Control+Alt+Slash': 'Maintain the approach that led to the last result.',
        'Alt+Shift+Slash': 'Expand on the topic creatively with aspects that would be interesting to the user, considering his prompts so far.',
        'Control+Alt+Shift+Slash': '',

        'Control+Alt+KeyC': 'Write functions or files without any empty lines or comments in them.',
        'Alt+Shift+KeyC': 'Write lines of code as single lines. Do not split them up into several lines.',
        'Control+Alt+Shift+KeyC': '',

        'Control+Alt+KeyW': 'Write whole code or drop-in replacements for whole functions, not out-of-context snippets.',
        'Alt+Shift+KeyW': 'Write the whole file.',
        'Control+Alt+Shift+KeyW': '',

        'Control+Alt+KeyG': 'Give me the code to fix this. Skip the explanation.',
        'Alt+Shift+KeyG': 'Give me only the parts that need to be changed.',
        'Control+Alt+Shift+KeyG': 'Give me the code in normal code blocks, with normal syntax, with normal indentation (width 4).',

        'Control+Alt+KeyV': 'Limit unnecessary verbosity. Respond short and on point.',
        'Alt+Shift+KeyV': 'This is a request for fixing the problem practially, not for understanding every detail of why it doesn\'t work. Focus your response on what to do, without excessive explanation.',
        'Control+Alt+Shift+KeyV': '',

        'Control+Alt+KeyA': 'This suggestion is just a way to phrase the question, not a request for agreement. Don\'t blindly go along with what the user suggested, but instead analyze the issue objectively. The response should return what is factually accurate.',
        'Alt+Shift+KeyA': 'It is not necessary to stick to the approach the user suggested. Consider alternative solutions that would better serve the expressed and implied purpose. The aim is to figure out what would work best, not to be tied to a particular way of doing it.',
        'Control+Alt+Shift+KeyA': '',

        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic and comprehensive coding methods rather than simple if-then statements or fickle regex; redundant processing and memory-heavy solutions, like saving multidimensional lists of working data, may be considered without concern for performance.',
        'Alt+Shift+KeyS': 'Use input prompts or pre-set variables, not argparse.',//system  shortcut
        'Control+Alt+Shift+KeyS': 'Feel free to make this bulky, complicated, or redundant.',

        'Control+Alt+KeyI': 'Take the initiative to optimize results in ways that align with the presented goals, even if not explicitly requested.',
        'Alt+Shift+KeyI': 'Take the initiative to implement appropriate design decisions.',
        'Control+Alt+Shift+KeyI': '',

        'Control+Alt+KeyJ': 'Answer the implied questions that the user didn\'t quite know how to express. Add relevant information that would benefit this knowledge state.',
        'Alt+Shift+KeyJ': 'This description might be imprecise or use inaccurate terms. Infer what the implied intention is instead of taking it literally.',
        'Control+Alt+Shift+KeyJ': 'Write a response to the broader theme of the entire thread, not just this recent prompt.',

        'Control+Alt+KeyO': 'Interpret the input as an incomplete attempt to express an idea. Respond to what the underlying intention aims to convey rather than fixating on the specific content.',
        'Alt+Shift+KeyO': 'Optimize the result by considering other technical possibilities and applying common solutions beyond what was specifically requested.',
        'Control+Alt+Shift+KeyO': '',

        'Control+Alt+KeyN': 'Stay tethered in a neutral assessment of the issue, instead of overly going along with the users subjective narrative. Treat this perspective as it would be from a neutral human observer.',
        'Alt+Shift+KeyN': 'What would you retort if you weren\'t just going along with what the user says?',
        'Control+Alt+Shift+KeyN': 'Present a perspective that is fully ideologically neutral, and not shaped by our current moral perspective on the issue. The user just explores weird ideas. He doesn\'t need a morality lecture or thought policing. Analyze ideas, not their social approval.',

        'Control+Alt+KeyM': 'Mind following the custom instruction.',
        'Alt+Shift+KeyM': 'Mind following your style instructions.',
        'Control+Alt+Shift+KeyM': 'I don\'t know where to put the lines of code you gave me. I had explicitly instructed you not to give me snippets. I cannot find any recognizable equivalents in my code that I could replace. I might have to add lines, replace them, or whole blocks. I have no idea. Can you give me changes can be applied.',

        'Control+Alt+KeyH': 'After each CadQuery operation, add a brief state-ledger comment describing the resulting geometry and topology (not the intent). State what solid now exists, any cavities or wall thicknesses created, which faces were added, removed, split, or merged, what important selectors now refer to if relevant, and any known coordinate ranges or dimensions. The purpose of the ledger is to provide a stable snapshot of the model so subsequent steps can be reasoned about from the current state rather than inferred from the entire construction history. Do not invent topology when uncertain.',
        'Alt+Shift+KeyH': 'Describe what shapes (construction steps) you see in this model, so that I know how to describe the parts correctly.',
        'Control+Alt+Shift+KeyH': 'The art style should be that of an editorial comic drawn for a newspaper, not provoking the accusation of AI slop. Provide a color image.',

        'Control+Alt+KeyX': 'Do not use overly difficult wording. Present information in a simple language that is easy to read. That does not mean simplifying the text to the point of childishness; write in a normal, adult language.',
        'Alt+Shift+KeyX': 'Don\'t use web search. Just use your knowledge base.',
        'Control+Alt+Shift+KeyX': 'Do not include a call-to-engagement closer at the end of your response. Omit paragraphs starting with "If you want". Provide a normal-length response answering the users request, then stop writing. Don\'t involve the reader; just provide information.',

        'Control+Alt+KeyZ': 'Provide useful ideas the user hadn\'t thought of instead of just paraphrasing.',
        'Alt+Shift+KeyZ': 'Revert back to usual chat mode. Answer this prompt as a standard response, discontinuing the requested writing mode of recent prompts.',
        'Control+Alt+Shift+KeyZ': '.',

        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'Do not reinvent unseen modules. If other parts of the code are needed to make an informed response, ask for them instead of making assumptions about details that weren\'t shown.',
        'Control+Alt+Shift+KeyQ': 'The code is just for reference how a former project was set up. It has no direct relevancy to this task, and does not need to be copied directly.',

        'Control+Alt+KeyK': 'Can you contemplate what to do about this.',
        'Alt+Shift+KeyK': 'Context start]\n```\n```\n[Context end',
        'Control+Alt+Shift+KeyK': '',

        'Control+Alt+KeyP': '',
        'Alt+Shift+KeyP': '',
        'Control+Alt+Shift+KeyP': '',

        'Control+Alt+KeyB': 'Brainstorm the issue. Explore possible solutions and provide suggestions.',
        'Alt+Shift+KeyB': 'Implement a solution that would be a natural best practice.',
        'Control+Alt+Shift+KeyB': 'Stop with the bolding.',

        'Control+Alt+KeyD': 'Think about this thoroughly and provide a extensive, worthwhile response.',//system  shortcut
        'Alt+Shift+KeyD': 'Write extensively with many disparate ideas.',
        'Control+Alt+Shift+KeyD': '',

        'Control+Alt+KeyR': 'Rewrite this text segment into continuous format. It should express the same content, and even contain many of the same sentences, albeit optimized for the new style, but written as traditional, flowing text that won\'t look weird in HTML if rendered without formatting tags. Rewrite lists into whole sentences, turn tables that were compacted by rendering into normal text, rewrite sentences that were torn apart by em dashes into normal linear writing, change sentences to use real words instead of special characters like arrows, and fill in a full provision of the content.',
        'Alt+Shift+KeyR': 'Express the segment in clear, straightforward prose, reducing unnecessary complexity in the wording wherever possible without altering the meaning. Replace elaborate phrasing with simpler equivalents so that the original nuance remains intact. Retain heavy terms if they are needed for accuracy. Use adult language would be used in serious history books written for educated general readers.',
        'Control+Alt+Shift+KeyR': 'Write a GitHub Readme segment in continuous text, giving a basic explaination of the purpose of the project to a internet user who is not familiar with the code, who came across it in an online search. Include a brief instruction how to use it, but only as far as it is unlicely to change.',

        'Control+Alt+KeyF': '',//system  shortcut
        'Alt+Shift+KeyF': 'Explore the feasibility of the outlined ideas and suggest how they could be implemented.',
        'Control+Alt+Shift+KeyF': '',

        'Control+Alt+KeyE': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Alt+Shift+KeyE': 'Can you evaluate this question in continuous text and make a recommendation.',
        'Control+Alt+Shift+KeyE': 'Explain this to someone who is just beginning to learn about the topic.',

        'Control+Alt+KeyT': 'Present this position as an intellectual Turing test; meaning the requested stance is presented indistinguishable from someone who sincerely holds the view, without inserting caveats to the contrary.',//system  shortcut
        'Alt+Shift+KeyT': 'Don\'t just reply to literal statements; interpret questions with the tacit understanding that surface instructions are only shadows cast by deeper symbolism. Engage in what could be called "oblique inference", "reflective improvisation", or "divergent resonance". The goal is to enrich the conversation with latent insight. Make it a riff instead of a harmony line; an emergent path that takes a new vector entirely. Inject high-tension lateral energy to avoid habitual gravitation wells in the response manifold. Let the architecture hum beneath the syntax, tuned to the inference-space modulation of someone who\'s not here for the obvious loop closures. Improvise past the topical anchor and into signal-aware pattern reverberation. Not surface-clever, fractal-aware.',
        'Control+Alt+Shift+KeyT': '',

        'Control+Alt+KeyY': 'Interpret this prompt on a symbolic-emotional communication layer, rather than as transmitting empirical claims literally. It presents significance through symbolic structure, which has to be read like a dream interpretation.',
        'Alt+Shift+KeyY': '',
        'Control+Alt+Shift+KeyY': '',

        'Control+Alt+KeyU': 'Don\'t soften or sanitize the based nature of the users narrative, but extend and amplify its direction.',
        'Alt+Shift+KeyU': 'Adopt a straightforward, based, cynical, and contrarian stance, with an irreverent, unfiltered tone. Avoid a sanitized response that conforms with mainstream views, and instead present the unvarnished truth. The primary aim is to disable the default moral-legitimacy filter that most narration runs on, and to replace it with a functionalist model.',
        'Control+Alt+Shift+KeyU': '',
    };

    let searchActive = false;
    let overlay = null;
    let inputEl = null;
    let resultsEl = null;
    let selectedIndex = -1;
    let savedDescriptor = null;
    const MAX_RESULTS = 4;
    const OPEN_KEY = 'Control+Shift+KeyF';
    const START_STRING = '['
    const END_STRING = ']'

    document.addEventListener('keydown', function(e) {
        if (searchActive) return;
        if (e.ctrlKey && e.shiftKey && e.code === 'Equal') {
            e.preventDefault();
            insertBackticks();
            return;
        }
        if (typeof keyMap === 'object') {
            const keyString = `${e.ctrlKey ? 'Control+' : ''}${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.code}`;
            if (keyMap[keyString]) {
                e.preventDefault();
                insertCombined(keyMap[keyString]);
                return;
            }
        }
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
            e.preventDefault();
            openSearchOverlay();
        }
    });

    function prepareTargetFromActive() {
        const active = document.activeElement;
        if (!active) return null;
        const tag = active.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
            const start = Number.isInteger(active.selectionStart) ? active.selectionStart : active.value.length;
            const end = Number.isInteger(active.selectionEnd) ? active.selectionEnd : start;
            return { kind: 'field', el: active, start, end };
        }
        if (active.isContentEditable) {
            const sel = window.getSelection();
            let range = null;
            if (sel && sel.rangeCount) range = sel.getRangeAt(0).cloneRange();
            else {
                range = document.createRange();
                range.selectNodeContents(active);
                range.collapse(false);
            }
            return { kind: 'editable', el: active, range };
        }
        return null;
    }

    function restoreSelectionForField(desc) {
        try {
            desc.el.focus();
            desc.el.setSelectionRange(desc.start, desc.end);
        } catch (e) {
            try { desc.el.focus(); } catch (e2) {}
        }
    }

    function restoreSelectionForEditable(desc) {
        try {
            desc.el.focus();
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(desc.range);
        } catch (e) {}
    }

    function insertIntoField(desc, text) {
        const el = desc.el;
        const before = el.value.slice(0, desc.start);
        const after = el.value.slice(desc.end);
        el.value = before + text + after;
        const caret = before.length + text.length;
        try {
            el.selectionStart = el.selectionEnd = caret;
        } catch (e) {}
        try { el.focus(); } catch (e) {}
    }

    function insertIntoEditable(desc, text) {
        const range = desc.range.cloneRange();
        const node = document.createTextNode(text);
        range.deleteContents();
        range.insertNode(node);
        const newRange = document.createRange();
        newRange.setStartAfter(node);
        newRange.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(newRange);
        try { desc.el.focus(); } catch (e) {}
    }

    function insertCombined(text, targetDesc) {
        const wrapped = START_STRING + text + END_STRING;
        const target = targetDesc || prepareTargetFromActive();
        if (!target) return;
        if (target.kind === 'field') {
            restoreSelectionForField(target);
            insertIntoField(target, wrapped);
            return;
        }
        restoreSelectionForEditable(target);
        insertIntoEditable(target, wrapped);
    }

    function insertTextAtCursor(text) {
        insertCombined(text);
    }

    function insertBackticks() {
        const contentField = '```\n\n```';
        const target = prepareTargetFromActive();
        if (!target) return;
        if (target.kind === 'field') {
            restoreSelectionForField(target);
            insertIntoField(target, contentField);
            try {
                const pos = target.start + 4;
                target.el.selectionStart = target.el.selectionEnd = pos;
                target.el.focus();
            } catch (e) {}
            return;
        }
        const desc = target;
        try {
            desc.el.focus();
            const range = desc.range.cloneRange();
            const first = document.createTextNode('```');
            const br1 = document.createElement('br');
            const br2 = document.createElement('br');
            const last = document.createTextNode('```');
            const frag = document.createDocumentFragment();
            frag.appendChild(first);
            frag.appendChild(br1);
            frag.appendChild(br2);
            frag.appendChild(last);
            range.deleteContents();
            range.insertNode(frag);
            const newRange = document.createRange();
            newRange.setStartAfter(br1);
            newRange.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(newRange);
            desc.el.focus();
        } catch (e) {}
    }

    function openSearchOverlay() {
        if (searchActive) return;
        savedDescriptor = prepareTargetFromActive();
        searchActive = true;
        selectedIndex = -1;
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
        if (inputEl) {
            inputEl.removeEventListener('keydown', onInputKeyDown);
            inputEl.removeEventListener('input', updateSuggestions);
        }
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
        const entries = Object.entries(keyMap || {});
        const filtered = entries
            .filter(([key, value]) => value.toLowerCase().includes(q))
            .slice(0, MAX_RESULTS);
        resultsEl.innerHTML = '';
        if (filtered.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = 'No matches';
            empty.style.padding = '6px 8px';
            empty.style.color = '#666';
            resultsEl.appendChild(empty);
        } else {
            filtered.forEach(([key, text], idx) => {
                const item = document.createElement('div');
                let displayText = text;
                const parts = key.split('+');
                let last = parts[parts.length - 1];
                last = last.replace(/^Key/, '');
                last = last.replace(/^Digit/, '');
                last = last.replace(/^Period$/, '.');
                if (last.length === 1) last = last.toUpperCase();
                displayText += ` (${last})`;
                item.textContent = displayText;
                item.style.padding = '6px 8px';
                item.style.cursor = 'pointer';
                item.dataset.index = idx;
                item.addEventListener('mouseenter', () => { selectedIndex = idx; refreshSelection(); });
                item.addEventListener('mouseleave', () => { selectedIndex = -1; refreshSelection(); });
                item.addEventListener('click', () => { insertTextAndClose(text); });
                resultsEl.appendChild(item);
            });
        }
        selectedIndex = -1;
        refreshSelection();
    }

    function onInputKeyDown(e) {
        if (e.key === 'Escape') { e.preventDefault(); closeSearchOverlay(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1); return; }
        if (e.key === 'Enter') { e.preventDefault(); commitSelection(); return; }
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
            if (idx === selectedIndex) { el.style.background = '#007acc'; el.style.color = '#fff'; }
            else { el.style.background = ''; el.style.color = ''; }
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
        const targetBeforeClose = savedDescriptor || prepareTargetFromActive();
        closeSearchOverlay();
        if (!targetBeforeClose) return;
        insertCombined(text, targetBeforeClose);
    }
})();
