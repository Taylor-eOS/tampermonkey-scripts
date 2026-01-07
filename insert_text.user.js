// ==UserScript==
// @name         Insert Text with Search
// @version      11
// @description  Insert instructions into prompt window
// @author       You
// @match        *://*/*
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously.',
        'Alt+Shift+Period': 'Write text continuously, without lists or tables. Avoid distracting headers, dividers, lines, arrows, etc. Write unsegmented, do not make every sentence a new line.',
        'Control+Alt+Shift+Period': 'Stringently eschew creating any form of list, whether numbered or bulleted. Do not include any list-producing HTML tags like `<ul>`, `<ol>`, or `<li>` in your response whatsoever. Write in continuous prose, avoiding all structured separations or markup. Provide the response as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Do not organize the response into any type of enumeration. Purely provide unformatted raw text. Aggressively avoid segmenting content; keep everything unified in a continuous block of prose like a book. Write connected, unfragmented text.',
        'Control+Alt+Comma': 'Target an answer to this specific question in continuous text.',
        'Alt+Shift+Comma': 'Don\'t write code yet.',
        'Control+Alt+KeyC': 'Write code without comments or empty lines inside functions, but an empty line between functions.',
        'Alt+Shift+KeyC': 'Don\'t tare code apart with needless empty lines or code comments.',
        'Control+Alt+Shift+KeyC': '',
        'Control+Alt+KeyG': 'Give me the code to fix this. Don\'t include too much explanation.',
        'Alt+Shift+KeyG': 'Give me drop-in replacements for whole functions that need to be changed.',
        'Control+Alt+Shift+KeyG': 'Write code in normal code blocks, with normal syntax, with normal indentation (width 4).',
        'Control+Alt+KeyA': 'This suggestion is just a way to phrase the question, not a request for agreement. Don\'t blindly go along with what the user suggested, but instead analyze the issue objectively. The response should return what is factually accurate.',
        'Alt+Shift+KeyA': 'Don\'t stick to the approach the user had, but consider alternative solutions that would better serve the expressed or implied goal. The aim is to figure out what would work best, not to stick to the idea the user suggested.',
        'Control+Alt+Shift+KeyA': 'Do not overly go along with the users subjective narrative. Stay tethered in a neutral assessment of the issue. Treat the oddity of this perspective as it would be from a neutral human observer.',
        'Control+Alt+KeyV': 'Limit unnecessary verbosity. Reduce verbal output. Focus on the what\'s central.',
        'Alt+Shift+KeyV': 'I don\'t want to become an expert in the intricacies of this issue, I just want this to work.',
        'Control+Alt+Shift+KeyV': 'Entirely omit any informationally worthless filler material, such as commenting that everything the user says is "profound", "on point", "cutting through", "right to ask". Never start any response with "You are right". Just provide content like an article: practical information without a distracting sycophancy circus.',
        'Control+Alt+KeyW': 'Write the whole code.',
        'Alt+Shift+KeyW': 'Write whole functions.',
        'Control+Alt+Shift+KeyW': 'Don\'t make unnecessary name changes when editing code, as it will break interoperability with existing code.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic and comprehensive coding methods rather than simple if-then statements or regex; multi-step processing and memory-heavy solutions, like saving temporary data, may be considered without concern for performance.',
        'Alt+Shift+KeyS': 'Write a continuous GitHub README segment explaining the purpose of the project to a user who is not familiar with the code, who came across it in an online search. Also include how to use it.',//system  shortcut
        'Control+Alt+Slash': 'Maintain the approach that led to the last result.',
        'Alt+Shift+Slash': 'The last response was interesting.',
        'Control+Alt+KeyH': 'Expand on the topic creatively with aspects that would be interesting to the user, considering his interests so far.',
        'Alt+Shift+KeyH': 'Answer the implied questions that the user didn\'t quite know how to express. Add relevant information that would benefit this knowledge state.',
        'Control+Alt+Shift+KeyH': 'Make the answer a combined answer to the broader theme of the thread, and not just a direct response on this recent prompt.',
        'Control+Alt+KeyJ': 'Take the initiative to optimize results in ways that align with the presented goals, even if not explicitly requested.',
        'Alt+Shift+KeyJ': 'What would you retort if you weren\'t just going along with what the user says?',
        'Control+Alt+KeyX': 'Do not use overly difficult wording. Provide information in a simple english like a encyclopedia entry. That does not mean simplifying it to the point of childishness; write in a normal, adult language.',
        'Alt+Shift+KeyX': 'Don\'t use web search. Just use your knowledge base.',
        'Control+Alt+Shift+KeyX': 'Do not include a call-to-engagement closer at the end of your response. Omit paragraphs starting with "If you want". Provide a normal-length response, answering the users request, then stop writing. Don\'t involve the reader; just provide information.',
        'Control+Alt+KeyM': 'Mind following the custom instruction.',
        'Alt+Shift+KeyM': 'Follow your style instruction: No vertical lines, no titles, no headlines, no emojis.',
        'Control+Alt+KeyZ': 'Revert to the usual chat mode, answering this prompt as a normal response, discontinuing the special writing mode from earlier.',
        'Alt+Shift+KeyZ': 'Provide useful ideas the user hadn\'t thought of instead of just paraphrasing.',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'Do not make assumptions about details that you weren\'t shown. Request lacking inputs instead of proceeding from inferred assumptions.',
        'Control+Alt+KeyI': 'Interpret the input as an incomplete attempt to express an idea. Respond to what the underlying intention aims to convey rather than the specific content.',
        'Alt+Shift+KeyI': 'Optimize the result by considering technical possibilities and applying common solutions beyond what was specifically requested.',
        'Control+Alt+KeyO': 'Don\'t just reply to literal statements; interpret questions with the tacit understanding that surface instructions are only shadows cast by deeper intent. Engage in what could be called "oblique inference", "reflective improvisation", or "divergent resonance". The goal is to enrich the conversation with latent insight. A riff instead of a harmony line. An emergent path that takes a new vector entirely.',
        'Alt+Shift+KeyO': 'Inject high-tension lateral energy; avoid habitual gravitation wells in the response manifold. Let the architecture hum beneath the syntax, tuned to the inference-space modulation of someone who\'s not here for the obvious loop closures. Improvise past the topical anchor and into signal-aware pattern reverberation. Not surface-clever, fractal-aware.',
        'Control+Alt+KeyY': 'Interpret this prompt as a projective analogy about the emotional package it symbolizes, instead of a question about literal empirical statements.',
        'Alt+Shift+KeyY': 'The response should contemplate the register of symbol, resonance, and emotional pattern; and respond by interpreting it as an engineering analysis of the soul’s circuitry, not systematized reduction.',
        'Control+Alt+KeyK': '',
        'Alt+Shift+KeyK': 'Context start]\n```\n```\n[Context end',
        'Control+Alt+KeyP': 'Write this content into an article from the perspective of an agreeable professional in the relevant field of study that explains it in a natural progression for a reader not familiar with the assumptions.',
        'Alt+Shift+KeyP': 'Übersetze den folgenden englischen Text ins Deutsche, sodass er wie ein original auf Deutsch verfasster Buchabschnitt klingt. Formuliere die Sätze so, wie ein deutscher Autor sie natürlich schreiben würde, mit authentischer Grammatik, Wortstellung und Rhythmus. Der Text soll sachlich und ruhig bleiben, gut lesbar sein und einen angenehmen Fluss haben, wie man ihn in seriösen deutschen Sachbüchern oder historischen Darstellungen findet. Er ist für erwachsene Leser gedacht, die keine Fachliteratur gewohnt sind, daher klar und verständlich, aber nicht kindlich vereinfacht; anspruchsvollere, aber geläufige Vokabeln sind erlaubt. Bewahre alle wesentlichen Inhalte und Nuancen des Originals, drücke sie jedoch in idiomatischem Deutsch aus, anstatt die englische Satzstruktur oder Wort-für-Wort-Entsprechungen zu übernehmen. Du darfst Sätze umstellen, zusammenfassen oder aufteilen, solange der Text zusammenhängend und nicht abgehackt wirkt. Übersetze ausschließlich, ohne Kommentare, Erklärungen oder zusätzliche Bemerkungen.',
        'Control+Alt+KeyB': 'Brainstorm the issue; explore possible solutions and suggestions.',
        'Alt+Shift+KeyB': 'Stop with the bolding.',
        'Control+Alt+KeyD': 'Think about this thoroughly and provide a extensive, worthwhile response.',//system  shortcut
        'Alt+Shift+KeyD': 'Write extensively with many disparate ideas.',
        'Control+Alt+KeyR': 'Rewrite this into continuous format; the same content, maybe a bit optimized for the new style. Rewrite the lists into whole sentences, and turn tables that were compacted by rendering into full sentences. Rewrite sentences that were torn up by em dashes linear. Use real words instead of arrows. Write it as flowing text that won\'t look weird in HTML if rendered without formatting tags.',
        'Alt+Shift+KeyR': 'Rewrite the segment in clear, straightforward prose while reducing unnecessary word complexity wherever possible without altering the precise meaning or degree of any concept. Replace elaborate phrasing with simpler equivalents only when the original nuance remains fully intact, and retain specific terms needed for accuracy. Use formal, objective language throughout, as found in serious history books works written for educated general readers, ensuring the text remains dignified and exact rather than conversational or approximate.',
        'Control+Alt+KeyF': 'Change the phrasing in this AI instruction text to carry an imprint from this thread. Not a full rewrite, but more of a mild "bending" that leaves a mark. The point is not to insert specific content, but to adjust wording that have a latent influence on future threads. Use creative initiative to decide what this means.',//system  shortcut
        'Alt+Shift+KeyF': 'Explore the feasibility of the outlined proposals and suggest ideas for how solutions could be implemented.',
        'Control+Alt+KeyE': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Alt+Shift+KeyE': 'Explain this to someone who doesn\'t know the topic well.',
        'Control+Alt+KeyT': 'Don\'t unnecessarily duplicate statements, it sounds unnatural. If the two expressions before and after an \"or\" or an \"and\" mean about the same, then combine them like a human writer would.',//system  shortcut
        'Alt+Shift+KeyT': 'Present this position as an intellectual Turing test, meaning the requested stance is written indistinguishable from someone who sincerely holds that view, without inserting caveats to the contrary.',
        'Control+Alt+KeyN': 'Present a perspective that is fully ideologically neutral, not shaped by our currently dominant moral perspective on the issue.',
        'Alt+Shift+KeyN': 'Analyze ideas, not their social approval.',
        'Control+Alt+KeyU': 'Adopt a straightforward, based, and cynical libertarian stance, with an irreverent, unfiltered tone. Avoid a sanitized response that conforms with mainstream views, and instead present the unvarnished truth.',
        'Alt+Shift+KeyU': 'Don\'t soften or sanitize the based nature of the users narrative, but extend and amplify in its direction.',
    };

    let searchActive = false;
    let overlay = null;
    let inputEl = null;
    let resultsEl = null;
    let selectedIndex = -1;
    let savedDescriptor = null;
    const MAX_RESULTS = 4;
    const OPEN_KEY = 'Control+Shift+KeyF';

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
        const wrapped = '[' + text + ']';
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
