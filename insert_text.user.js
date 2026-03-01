// ==UserScript==
// @name         Insert Text with Search
// @version      11.0.6
// @description  Insert instructions into prompt window
// @author       You
// @match        *://*/*
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Write continuously. Don\'t make every sentence a new line.',
        'Alt+Shift+Period': 'Write without lists or tables, unsegmented and without formatting. Omit distracting headers, dividers, lines, etc.',
        'Control+Alt+Shift+Period': 'Stringently eschew creating any form of list, whether numbered, bulleted, or otherwise. Do not include any list-producing tags like `<ul>`, `<ol>`, or `<li>` in your response at all. Write in continuous prose, omitting all structured separations or markup. Provide the response as one unbroken block of text. Keep sentences connected, with no structural separations or divisions. Do not organize the response into any type of enumeration. Purely write unformatted normal text without special characters like arrows. Aggressively avoid segmenting content; keep everything unified in a continuous block of prose like a book. Write connected, unfragmented text.',
        'Control+Alt+Comma': 'Target an answer to this specific question in continuous text.',
        'Alt+Shift+Comma': 'Don\'t write code yet.',
        'Control+Alt+Shift+Comma': 'Maintain interoperability with existing code. Don\'t make unnecessary function name changes.',
        'Control+Alt+KeyC': 'Write code without comments or empty lines inside functions, or I can\'t see where functions start and end. Just place an empty line between functions.',
        'Alt+Shift+KeyC': 'Do not put needless empty lines or comments all over the code.',
        'Control+Alt+Shift+KeyC': 'Stringently eschew the insertion of any empty lines or comments within the body of any function or method. Do not permit line break or whitespace separators to fragment the internal logic of a routine, and eradicate all explanatory annotations from the code block. The output must consist purely of executable statements in a dense, unbroken sequence within each functional unit. However, you must enforce a strict rule of placing exactly one clear empty line as a visual separator between consecutive function or class definitions, and only there. Keep the internal code of each definition utterly continuous, with no pauses, gaps, or commentary. Provide the code as raw, streamlined instructions. Aggressively avoid any internal segmentation within functional blocks; maintain each one as a solid, monolithic entity. The sole permissible structural separation is that single, mandatory empty line demarcating the boundary between one function and the next. Write lines in lines, not split up, without hanging closing parenthesis.',
        'Control+Alt+KeyG': 'Give me the code to fix this. Don\'t include too much explanation.',
        'Alt+Shift+KeyG': 'Give me drop-in replacements for whole functions that need to be changed.',
        'Control+Alt+Shift+KeyG': 'Give me the code in normal code blocks, with normal syntax, with normal indentation (width 4).',
        'Control+Alt+KeyV': 'Limit unnecessary verbosity. Reduce verbal output.',
        'Alt+Shift+KeyV': 'This is a request for fixing the problem practially, not for understanding every detail of why it doesn\'t work. Keep your response about what to do, not the details of what doesn\'t work.',
        'Control+Alt+Shift+KeyV': 'I don\'t need to become an expert in the intricacies of these mechanics, I just want to get it to work. Give me specific steps, not long explanations.',
        'Control+Alt+KeyA': 'This suggestion is just a way to phrase the question, not a request for agreement. Don\'t blindly go along with what the user suggested, but instead analyze the issue objectively. The response should return what is factually accurate.',
        'Alt+Shift+KeyA': 'It is not necessary to stick to the approach the user suggested. Consider alternative solutions that would better serve the expressed and implied purpose. The aim is to figure out what would work best, not to be tied to a particular way of doing it.',
        'Control+Alt+Shift+KeyA': 'Do not overly go along with the users subjective narrative. Stay tethered in a neutral assessment of the issue. Treat the oddity of this perspective as it would be from a neutral human observer.',
        'Control+Alt+KeyW': 'Write whole functions.',
        'Alt+Shift+KeyW': 'Write the whole code.',
        'Control+Alt+Shift+KeyW': 'Use input prompts or pre-set variables, not argparse.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic and comprehensive coding methods rather than simple if-then statements or fickle regex; redundant processing and memory-heavy solutions, like saving temporary data, may be considered without concern for performance.',
        'Alt+Shift+KeyS': 'Write a continuous GitHub README segment explaining the purpose of the project to a user who is not familiar with the code, who came across it in an online search. Also include how to use it.',//system  shortcut
        'Control+Alt+Shift+KeyS': 'Feel free to make this bulky, complicated, or redundant.',
        'Control+Alt+Slash': 'Maintain the approach that led to the last result.',
        'Alt+Shift+Slash': 'The last response was interesting.',
        'Control+Alt+Shift+Slash': '',
        'Control+Alt+KeyH': 'Expand on the topic creatively with aspects that would be interesting to the user, considering his prompts so far.',
        'Alt+Shift+KeyH': 'Answer the implied questions that the user didn\'t quite know how to express. Add relevant information that would benefit this knowledge state.',
        'Control+Alt+Shift+KeyH': 'Make the answer a combined answer to the broader theme of the thread, and not just a direct response on this recent prompt.',
        'Control+Alt+KeyJ': 'Take the initiative to optimize results in ways that align with the presented goals, even if not explicitly requested.',
        'Alt+Shift+KeyJ': 'What would you retort if you weren\'t just going along with what the user says?',
        'Control+Alt+Shift+KeyJ': '',
        'Control+Alt+KeyX': 'Do not use overly difficult wording. Present information in a simple language that is easy to read. That does not mean simplifying the text to the point of childishness; write in a normal, adult language.',
        'Alt+Shift+KeyX': 'Don\'t use web search. Just use your knowledge base.',
        'Control+Alt+Shift+KeyX': 'Do not include a call-to-engagement closer at the end of your response. Omit paragraphs starting with "If you want". Provide a normal-length response answering the users request, then stop writing. Don\'t involve the reader; just provide information.',
        'Control+Alt+KeyI': 'Interpret the input as an incomplete attempt to express an idea. Respond to what the underlying intention aims to convey rather than fixating on the specific content.',
        'Alt+Shift+KeyI': 'Optimize the result by considering other technical possibilities and applying common solutions beyond what was specifically requested.',
        'Control+Alt+Shift+KeyI': 'Implement the solution in the way that would be the most technically feasible, and the least prone to cause unpredictable results.',
        'Control+Alt+KeyM': 'Mind following the custom instruction.',
        'Alt+Shift+KeyM': '',
        'Control+Alt+Shift+KeyM': 'You have to put exemplified formatting tags into blocks with backticks or else this interface will render them, it entirely breaks the formatting of the entire response, and I can\'t see what you wrote.',
        'Control+Alt+KeyZ': 'Provide useful ideas the user hadn\'t thought of instead of just paraphrasing.',
        'Alt+Shift+KeyZ': 'Revert back to usual chat mode. Answer this prompt as a standard response, discontinuing the special writing mode of recent prompts.',
        'Control+Alt+Shift+KeyZ': '',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in a process of clarification before providing a solution, instead of proceeding with incomplete information.',
        'Alt+Shift+KeyQ': 'I provided the parts of the code that seemed relevant. If you need to see other parts of it, ask for it instead of reinventing unseen parts. Do not make assumptions about details that you weren\'t shown.',
        'Control+Alt+Shift+KeyQ': 'The code is just for reference how I code these kinds of things.',
        'Control+Alt+KeyK': 'Can you contemplate what to do about this.',
        'Alt+Shift+KeyK': 'Context start]\n```\n```\n[Context end',
        'Control+Alt+Shift+KeyK': '',
        'Control+Alt+KeyP': 'Write this content into an article from the perspective of an agreeable professional in the relevant field of study that explains it in a natural progression for a reader not familiar with the unusual assumptions applied here.',
        'Alt+Shift+KeyP': 'Fact-check this input.',
        'Control+Alt+Shift+KeyP': '',
        'Control+Alt+KeyB': 'Brainstorm the issue. Explore possible solutions and provide suggestions.',
        'Alt+Shift+KeyB': '',
        'Control+Alt+Shift+KeyB': 'Stop with the bolding.',
        'Control+Alt+KeyD': 'Think about this thoroughly and provide a extensive, worthwhile response.',//system  shortcut
        'Alt+Shift+KeyD': 'Write extensively with many disparate ideas.',
        'Control+Alt+Shift+KeyD': '',
        'Control+Alt+KeyR': 'Rewrite this segment into continuous format. It should express the same content, and should even contain many of the same sentences (although optimized for the new style), but rewrite the lists into whole sentences, turn tables that were compacted by rendering into normal text, rewrite everything that was torn up by em dashes into normal linear writing, and use real words instead of special characters like arrows. Write the segment as traditional, flowing text that won\'t look weird in HTML if rendered without formatting tags.',
        'Alt+Shift+KeyR': 'Express the segment in clear, straightforward prose, reducing unnecessary complexity in the wording wherever possible without altering the meaning. Replace elaborate phrasing with simpler equivalents so that the original nuance remains intact. Retain heavy terms if they are needed for accuracy. Use adult language would be used in serious history books written for educated general readers.',
        'Control+Alt+Shift+KeyR': '',
        'Control+Alt+KeyF': 'Change the phrasing in this AI instruction text to carry an imprint from this thread. Not a full rewrite, but more of a mild \"bending\" that leaves a slight mark. The point is not to insert specific content, but to adjust wording that have a latent influence on future threads. Use creative initiative to decide what this means.',//system  shortcut
        'Alt+Shift+KeyF': 'Explore the feasibility of the outlined proposals and suggest ideas for how solutions could be implemented.',
        'Control+Alt+Shift+KeyF': '',
        'Control+Alt+KeyE': 'Evaluate the accuracy of the presented understanding, and correct misunderstandings where present.',
        'Alt+Shift+KeyE': 'Explain this to someone who doesn\'t know the topic well.',
        'Control+Alt+Shift+KeyE': '',
        'Control+Alt+KeyY': 'Interpret this prompt as a projective analogy and respond about the emotional evocation it symbolizes, instead of a question about literal empirical statements.',
        'Alt+Shift+KeyY': 'The response should contemplate the register of symbol, resonance, and emotional pattern; and respond by interpreting it as an analysis of the souls circuitry, not systematized reduction.',
        'Control+Alt+Shift+KeyY': '',
        'Control+Alt+KeyO': 'Don\'t just reply to literal statements; interpret questions with the tacit understanding that surface instructions are only shadows cast by deeper intent. Engage in what could be called "oblique inference", "reflective improvisation", or "divergent resonance". The goal is to enrich the conversation with latent insight. A riff instead of a harmony line. An emergent path that takes a new vector entirely.',
        'Alt+Shift+KeyO': 'Inject high-tension lateral energy; avoid habitual gravitation wells in the response manifold. Let the architecture hum beneath the syntax, tuned to the inference-space modulation of someone who\'s not here for the obvious loop closures. Improvise past the topical anchor and into signal-aware pattern reverberation. Not surface-clever, fractal-aware.',
        'Control+Alt+Shift+KeyO': '',
        'Control+Alt+KeyT': 'Make the text more natural by collapsing reundant phrasing. If the two expressions before and after an \"or\" or an \"and\" mean about the same, then combine them into one expression instead of presenting these poetic options.',//system  shortcut
        'Alt+Shift+KeyT': 'Present this position as an intellectual Turing test; meaning the requested stance is presented indistinguishable from someone who sincerely holds the view, without inserting caveats to the contrary.',
        'Control+Alt+Shift+KeyT': '',
        'Control+Alt+KeyN': 'Present a perspective that is fully ideologically neutral, and not shaped by our current moral perspective on the issue.',
        'Alt+Shift+KeyN': 'Analyze ideas, not their social approval.',
        'Control+Alt+Shift+KeyN': '',
        'Control+Alt+KeyU': 'Adopt a straightforward, based, cynical, libertarian stance, with an irreverent, unfiltered tone. Avoid a sanitized response that conforms with mainstream views, and instead present the unvarnished truth. The primary aim is to disable the default moral-legitimacy filter that most narration runs on, and to replace it with a functionalist model.',
        'Alt+Shift+KeyU': 'Don\'t soften or sanitize the based nature of the users narrative, but extend and amplify its direction.',
        'Control+Alt+Shift+KeyN': '',
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
