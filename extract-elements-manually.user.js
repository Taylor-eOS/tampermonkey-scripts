// ==UserScript==
// @name         Save TXT Manually
// @description  Clik to mark text elements.
// @namespace    local
// @version      1.1
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const STYLE_ID = 'saveconv-style';
    const BTN_SAVE_ID = 'saveconv-save';
    const BTN_CLEAR_ID = 'saveconv-clear';
    const BTN_UNDO_ID = 'saveconv-undo';
    const BTN_ACT_ID = 'saveconv-activate';
    let captured = [];
    let lastHovered = null;
    let active = false;

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;
        const s = document.createElement('style');
        s.id = STYLE_ID;
        s.textContent = `
            .saveconv-hover    { outline: 2px dashed #f0a500 !important; background: rgba(240,165,0,0.07) !important; }
            .saveconv-captured { outline: 2px solid #0fb87f !important;  background: rgba(15,184,127,0.07) !important; }
        `;
        document.head.appendChild(s);
    }

    const ownIDs = new Set([BTN_SAVE_ID, BTN_CLEAR_ID, BTN_UNDO_ID, BTN_ACT_ID]);

    function isOwnUI(el) {
        return el && ownIDs.has(el.id);
    }

    let rafPending = false;
    let pendingX = 0, pendingY = 0;

    function onMouseMove(e) {
        pendingX = e.clientX;
        pendingY = e.clientY;
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            rafPending = false;
            const el = document.elementFromPoint(pendingX, pendingY);
            if (lastHovered === el) return;
            if (lastHovered && !isOwnUI(lastHovered)) lastHovered.classList.remove('saveconv-hover');
            lastHovered = el;
            if (el && !isOwnUI(el)) el.classList.add('saveconv-hover');
        });
    }

    function onClickCapture(e) {
        if (isOwnUI(e.target) || e.ctrlKey) return;
        if (e.clientX < 220 && e.clientY < 40) return;
        e.preventDefault();
        e.stopPropagation();
        const el = e.target;
        const text = (el.innerText || el.textContent || '').trim();
        if (!text) return;
        captured.push({ el, text });
        el.classList.remove('saveconv-hover');
        el.classList.add('saveconv-captured');
    }

    function generateFileName() {
        const title = (document.querySelector('title') || {}).textContent || '';
        if (title.trim()) return title.trim().slice(0, 45);
        if (captured.length) return captured[0].text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '_').slice(0, 30);
        return 'conversation';
    }

    function saveCapture() {
        if (!captured.length) { alert('Nothing captured yet.'); return; }
        const blob = new Blob([captured.map(c => c.text).join('\n\n---\n\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url, download: generateFileName() + '.txt' });
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function undoLast() {
        if (!captured.length) return;
        const last = captured.pop();
        try { last.el.classList.remove('saveconv-captured'); } catch (e) {}
    }

    function clearAll() {
        captured.forEach(c => { try { c.el.classList.remove('saveconv-captured'); } catch (e) {} });
        captured = [];
    }

    function makeBtn(id, label, left, bg, cb) {
        const b = document.createElement('div');
        b.id = id;
        b.textContent = label;
        Object.assign(b.style, {
            position: 'fixed', top: '4px', left, zIndex: '2147483647',
            padding: '4px 8px', borderRadius: '4px', fontWeight: '700',
            fontFamily: 'Arial,sans-serif', fontSize: '12px', cursor: 'pointer',
            border: '1px solid #555', color: '#fff', userSelect: 'none', background: bg
        });
        b.addEventListener('click', e => { e.stopPropagation(); cb(); });
        document.body.appendChild(b);
    }

    function createUI() {
        if (document.getElementById(BTN_SAVE_ID)) return;
        makeBtn(BTN_SAVE_ID, '💾 Save', '4px', '#555', saveCapture);
        makeBtn(BTN_UNDO_ID, '↩ Undo', '80px', '#555', undoLast);
        makeBtn(BTN_CLEAR_ID, '✕ Clear', '148px', '#933', clearAll);
    }

    function activate() {
        if (active) return;
        active = true;
        document.getElementById(BTN_ACT_ID).remove();
        injectStyle();
        createUI();
        window.addEventListener('mousemove', onMouseMove, true);
        window.addEventListener('click', onClickCapture, true);
    }

    function init() {
        const btn = document.createElement('button');
        btn.id = BTN_ACT_ID;
        btn.title = 'Activate text capture';
        btn.innerHTML = '📄';
        Object.assign(btn.style, {
            position: 'fixed', top: '2px', left: '2px',
            width: '21px', height: '21px', zIndex: '2147483647',
            backgroundColor: '#ececec', borderRadius: '3px',
            cursor: 'pointer', border: 'none', fontSize: '10px'
        });
        btn.addEventListener('click', e => { e.stopPropagation(); activate(); });
        document.body.appendChild(btn);
    }

    if (document.body) {
        init();
    } else {
        const mo = new MutationObserver(() => { if (document.body) { mo.disconnect(); init(); } });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    }
})();
