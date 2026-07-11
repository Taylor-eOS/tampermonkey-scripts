// ==UserScript==
// @name         Save TXT Bulk
// @description  Dump whole page text, deduplicated, regardless of order.
// @namespace    local
// @version      1.0
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const BTN_ACT_BULK_ID = 'saveconv-activate-bulk';

    function generateFileName() {
        const title = (document.querySelector('title') || {}).textContent || '';
        if (title.trim()) return title.trim().slice(0, 45);
        return 'conversation';
    }

    function downloadText(text, name) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url, download: name + '.txt' });
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function fiveWordKey(text) {
        return text.split(/\s+/).slice(0, 5).join(' ').toLowerCase();
    }

    function bulkSave() {
        const raw = document.body.innerText || '';
        if (!raw.trim()) { alert('Nothing found to save.'); return; }
        const paragraphs = raw.split(/\n+/).map(p => p.trim()).filter(Boolean);
        const seen = new Set();
        const out = [];
        for (const p of paragraphs) {
            const key = fiveWordKey(p);
            if (key && seen.has(key)) continue;
            if (key) seen.add(key);
            out.push(p);
        }
        downloadText(out.join('\n\n'), generateFileName());
    }

    function activateBulk() {
        const b = document.getElementById(BTN_ACT_BULK_ID);
        if (b) b.remove();
        bulkSave();
    }

    function init() {
        const btnBulk = document.createElement('button');
        btnBulk.id = BTN_ACT_BULK_ID;
        btnBulk.title = 'Save whole thread unordered';
        btnBulk.innerHTML = '📦';
        Object.assign(btnBulk.style, {
            position: 'fixed', top: '2px', left: '48px',
            width: '21px', height: '21px', zIndex: '2147483647',
            backgroundColor: '#ececec', borderRadius: '3px',
            cursor: 'pointer', border: 'none', fontSize: '10px'
        });
        btnBulk.addEventListener('click', e => { e.stopPropagation(); activateBulk(); });
        document.body.appendChild(btnBulk);
    }

    if (document.body) {
        init();
    } else {
        const mo = new MutationObserver(() => { if (document.body) { mo.disconnect(); init(); } });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    }
})();
