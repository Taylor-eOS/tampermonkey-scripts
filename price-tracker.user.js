// ==UserScript==
// @name         Price Tracker
// @version      2.7
// @description  Track product prices
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
'use strict';

const DEBOUNCE_MS = 800;
const STORAGE_KEY = 'ae_price_tracker_v2';
const CAP_LENGTH = 70;

let historyData = {};
let debounceTimer = null;
let currentProduct = null;
let lastModalTitle = null;
let minimized = false;

function capString(s) {
    if (s === undefined || s === null) return null;
    s = String(s).replace(/\s+/g, ' ').trim();
    return s.length > CAP_LENGTH ? s.slice(0, CAP_LENGTH) : s;
}

function storage_get(key, defaultVal) {
    try {
        if (typeof GM_getValue !== 'undefined') {
            const val = GM_getValue(key);
            if (val === undefined || val === null) return defaultVal;
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch(e) { return val; }
            }
            return val;
        }
    } catch(e) {}
    try {
        const val = localStorage.getItem(key);
        if (!val) return defaultVal;
        try { return JSON.parse(val); } catch(e) { return val; }
    } catch(e) {}
    return defaultVal;
}

function storage_set(key, value) {
    try {
        if (typeof GM_setValue !== 'undefined') {
            try {
                GM_setValue(key, value);
            } catch(e) {
                try { GM_setValue(key, JSON.stringify(value)); } catch(e2) {}
            }
            return;
        }
    } catch(e) {}
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {}
}

function normalizePrice(raw) {
    let clean = raw.replace(/[\s\.]/g, '').replace(',', '.');
    return parseFloat(clean);
}

function isVisible(el) {
    if (!el || !el.getClientRects || el.getClientRects().length === 0) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function isInModal() {
    return !!document.querySelector('.pdp-mini-wrap, .mini--container--gQQVMrC');
}

function isComboBlastPage() {
    return window.location.href.includes('/BundleDeals');
}

function isSearchOrListingPage() {
    const url = window.location.href;
    if (url.includes('/w/wholesale-') || url.includes('SearchText=') || url.includes('/category/')) {
        return true;
    }
    const title = document.title.trim();
    if (/with free shipping on aliexpress/i.test(title) || /buy .+ with free shipping/i.test(title)) {
        return true;
    }
    return false;
}

function extractVariant(modal) {
    const ctx = modal || document;
    const selectors = [
        '.sku-item--title--Z0HLO87',
        '.sku-item--title',
        '.sku-title',
        '.sku-item-title',
        '.sku--wrap--xgoW06M .sku-item--title--Z0HLO87'
    ];
    const variants = [];
    const seen = new Set();
    const elems = Array.from(new Set(selectors.flatMap(s => Array.from(ctx.querySelectorAll(s)))));
    for (const el of elems) {
        if (!isVisible(el)) continue;
        const text = el.textContent.trim();
        if (!text) continue;
        const parts = text.split(/\r?\n/).map(t => t.trim()).filter(Boolean);
        for (const p of parts) {
            const m = p.match(/([A-Za-z0-9\u00C0-\u017F\s\-]{1,60})[:：]\s*(.+)/);
            const val = m && m[2] ? `${m[1].trim()}: ${m[2].trim()}` : p.replace(/\s+/g, ' ').trim();
            const capped = capString(val);
            if (capped && !seen.has(capped)) { seen.add(capped); variants.push(capped); }
        }
    }
    if (variants.length === 0) {
        const containerSelector = 'ul, dl, table, select, [class*="sku"], [class*="option"], [class*="variant"], [class*="spec"], [data-sku], [data-variant]';
        const containers = Array.from(new Set(Array.from(ctx.querySelectorAll(containerSelector))));
        const blacklist = /(price|shipping|qty|quantity|stock|add to cart|sold out|rating|review|share|seller)/i;
        let totalFound = 0;
        for (const c of containers) {
            if (!isVisible(c)) continue;
            const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT, null, false);
            let node;
            const localFound = [];
            while ((node = walker.nextNode())) {
                if (!node.parentElement || !isVisible(node.parentElement)) continue;
                const text = node.textContent.trim();
                if (!text) continue;
                const lines = text.split(/\r?\n/).map(t => t.trim()).filter(Boolean);
                for (const line of lines) {
                    if (blacklist.test(line)) continue;
                    const m = line.match(/([A-Za-z0-9\u00C0-\u017F\s\-]{1,60})[:：]\s*(.+)/);
                    if (!m || !m[2]) continue;
                    const key = m[1].trim();
                    const val = m[2].trim();
                    if (key.length > 40 || val.length > 120) continue;
                    const candidate = `${key}: ${val}`.replace(/\s+/g, ' ').trim();
                    const capped = capString(candidate);
                    if (!seen.has(capped)) { seen.add(capped); localFound.push(capped); totalFound++; }
                    if (totalFound >= 8) break;
                }
                if (totalFound >= 8) break;
            }
            if (localFound.length > 0) variants.push(...localFound);
            if (totalFound >= 8) break;
        }
    }
    if (variants.length === 0) return null;
    const clean = [...new Set(variants.map(s => s.replace(/\s+/g, ' ').trim()))];
    const cappedClean = clean.map(s => capString(s));
    cappedClean.sort((a, b) => {
        const ka = (a.split(':')[0] || '').toLowerCase().trim();
        const kb = (b.split(':')[0] || '').toLowerCase().trim();
        if (ka < kb) return -1;
        if (ka > kb) return 1;
        return a.localeCompare(b);
    });
    return cappedClean.join(' | ');
}

function normalizePartsForId(parts) {
    return parts.map(p => capString(p) || '').map(p => p.toLowerCase().replace(/[:：]/g, '_').replace(/\s+/g, '_').replace(/[^\w\-]/g, '')).join('--');
}

function extractProductId(modal, forcedVariant) {
    const variant = typeof forcedVariant !== 'undefined' ? forcedVariant : extractVariant(modal);
    const urlMatch = window.location.href.match(/\/item\/(\d+)\.html/);
    if (urlMatch) {
        const baseId = `item-${urlMatch[1]}`;
        if (!variant) return baseId;
        const parts = variant.split('|').map(s => s.trim());
        const normalized = normalizePartsForId(parts);
        return `${baseId}--${normalized}`;
    }
    const ogUrl = document.querySelector('meta[property="og:url"], meta[name="og:url"]');
    if (ogUrl && ogUrl.content) {
        const match = ogUrl.content.match(/\/item\/(\d+)\.html/);
        if (match) {
            const baseId = `item-${match[1]}`;
            if (!variant) return baseId;
            const parts = variant.split('|').map(s => s.trim());
            const normalized = normalizePartsForId(parts);
            return `${baseId}--${normalized}`;
        }
        const safe = capString(ogUrl.content).replace(/[^a-zA-Z0-9]/g, '_');
        const baseId = `og-${safe}`;
        if (!variant) return baseId;
        const parts = variant.split('|').map(s => s.trim());
        const normalized = normalizePartsForId(parts);
        return `${baseId}--${normalized}`;
    }
    if (modal) {
        const dataAttr = modal.querySelector('[data-sku], [data-pid], [data-itemid]');
        if (dataAttr) {
            const idVal = dataAttr.getAttribute('data-sku') || dataAttr.getAttribute('data-pid') || dataAttr.getAttribute('data-itemid');
            if (idVal) {
                const baseId = `modal-id-${String(idVal)}`.replace(/[^a-zA-Z0-9\-_]/g, '_');
                if (!variant) return baseId;
                const parts = variant.split('|').map(s => s.trim());
                const normalized = normalizePartsForId(parts);
                return `${baseId}--${normalized}`;
            }
        }
        const titleEl = modal.querySelector('.title--wrap--UUHae_g');
        if (titleEl) {
            const titleText = capString(titleEl.textContent.trim().replace(/\s+/g, ' '));
            const baseId = `modal-${titleText}`.replace(/[^a-zA-Z0-9-]/g, '_');
            if (!variant) return baseId;
            const parts = variant.split('|').map(s => s.trim());
            const normalized = normalizePartsForId(parts);
            return `${baseId}--${normalized}`;
        }
    }
    const docTitle = document.title ? capString(document.title.trim().replace(/\s+/g, ' ')) : 'unknown';
    const safeDoc = docTitle.replace(/[^a-zA-Z0-9-]/g, '_');
    const baseId = `doc-${safeDoc}`;
    if (!variant) return baseId;
    const parts = variant.split('|').map(s => s.trim());
    const normalized = normalizePartsForId(parts);
    return `${baseId}--${normalized}`;
}

function extractTitle(modal) {
    if (modal) {
        const titleEl = modal.querySelector('.title--wrap--UUHae_g h1, .title--wrap--UUHae_g');
        if (titleEl) {
            return titleEl.textContent.trim();
        }
    }
    const titleEl = document.querySelector('.title--wrap--UUHae_g h1, .title--wrap--UUHae_g');
    if (titleEl) return titleEl.textContent.trim();
    const ogTitle = document.querySelector('meta[property="og:title"], meta[name="og:title"]');
    if (ogTitle && ogTitle.content && ogTitle.content.trim()) return ogTitle.content.trim();
    return document.title.trim();
}

function extractPrice(modal) {
    const context = modal || document;
    const priceEl = context.querySelector('.price-default--current--F8OlYIo, .product-price-current, .product-price-value, .p-price .p-price__value, .price-current');
    if (!priceEl || !isVisible(priceEl)) {
        return null;
    }
    const text = priceEl.textContent.trim();
    const match = text.match(/(\d{1,3}(?:[\s\.]?\d{3})*[,\.]\d{2})/);
    if (!match) return null;
    const raw = match[1];
    const price = normalizePrice(raw);
    if (isNaN(price) || price <= 0) return null;
    return { price, raw };
}

function scanForPrice() {
    if (isComboBlastPage() && !isInModal()) return null;
    if (isSearchOrListingPage() && !isInModal()) return null;
    const modal = document.querySelector('.pdp-mini-wrap') || null;
    const title = extractTitle(modal);
    if (!title) return null;
    if (/with free shipping on aliexpress/i.test(title) || /buy .+ with free shipping/i.test(title)) {
        return null;
    }
    if (modal && lastModalTitle && lastModalTitle !== title) {
        lastModalTitle = title;
        currentProduct = null;
    }
    if (modal) lastModalTitle = title;
    const variant = extractVariant(modal);
    const productId = extractProductId(modal, variant);
    if (!productId) return null;
    const priceData = extractPrice(modal);
    if (!priceData) return null;
    return { productId, title, price: priceData.price, raw: priceData.raw, variant, isModal: !!modal };
}

function updateHistory(productId, title, price, raw, variant) {
    const normVariant = variant ? variant.replace(/\s+/g, ' ').trim() : null;
    const cappedTitle = capString(title);
    const cappedUrl = capString(window.location.href.split('?')[0]);
    if (!historyData[productId]) {
        historyData[productId] = {
            title: cappedTitle,
            canonicalUrl: cappedUrl,
            records: []
        };
    }
    const history = historyData[productId];
    const lastRecord = history.records.length ? history.records[history.records.length - 1] : null;
    const lastPrice = lastRecord ? lastRecord.price : null;
    const lastVariant = lastRecord && lastRecord.variant ? lastRecord.variant.replace(/\s+/g, ' ').trim() : null;
    if (lastPrice === price && (lastVariant === normVariant || (lastVariant == null && !normVariant))) {
        return false;
    }
    history.title = cappedTitle;
    history.records.push({
        ts: new Date().toISOString(),
        price,
        raw: capString(raw),
        variant: capString(normVariant) || null,
        pageUrl: capString(window.location.href)
    });
    storage_set(STORAGE_KEY, historyData);
    return true;
}

function createUI() {
    const panel = document.createElement('div');
    panel.id = 'ae-price-tracker-panel';
    panel.style.cssText = `
position: fixed;
top: 50px;
right: 10px;
background: white;
border: 2px solid #ff6a00;
border-radius: 8px;
padding: 8px;
max-width: 250px;
max-height: 500px;
overflow-y: auto;
box-shadow: 0 4px 12px rgba(0,0,0,0.2);
z-index: 999999;
font-family: Arial, sans-serif;
font-size: 12px;
`;
    const displayStyle = minimized ? 'none' : 'block';
    panel.innerHTML = `
<div id="ae-pt-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
<span style="font-weight: bold;">Price Tracker</span>
<button id="ae-pt-minimize" style="background: none; border: none; font-size: 14px; cursor: pointer; padding: 2px 6px; color: #666; font-weight: bold;">${minimized ? '+' : '-'}</button>
</div>
<div id="ae-pt-main" style="display: ${displayStyle};">
<div id="ae-pt-content">Scanning...</div>
<div style="margin-top: 8px; display: flex; gap: 6px;">
<button id="ae-pt-export" style="flex: 1; padding: 4px; background: #ff6a00; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Export</button>
<button id="ae-pt-delete" style="flex: 1; padding: 4px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Delete</button>
</div>
</div>
`;
    document.body.appendChild(panel);
    const mainEl = document.getElementById('ae-pt-main');
    const minBtn = document.getElementById('ae-pt-minimize');
    minBtn.onclick = function() {
        minimized = !minimized;
        mainEl.style.display = minimized ? 'none' : 'block';
        minBtn.textContent = minimized ? '+' : '-';
        storage_set('ae_pt_minimized', minimized);
    };
    document.getElementById('ae-pt-export').onclick = exportData;

    const deleteBtn = document.getElementById('ae-pt-delete');
    let deleteConfirmTimeout = null;
    deleteBtn.onclick = function() {
        if (deleteBtn.dataset.confirm === 'true') {
            clearTimeout(deleteConfirmTimeout);
            deleteBtn.dataset.confirm = '';
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.background = '#d32f2f';
            deleteCurrentHistory();
        } else {
            deleteBtn.dataset.confirm = 'true';
            deleteBtn.textContent = 'Confirm?';
            deleteBtn.style.background = '#f57c00';
            deleteConfirmTimeout = setTimeout(() => {
                deleteBtn.dataset.confirm = '';
                deleteBtn.textContent = 'Delete';
                deleteBtn.style.background = '#d32f2f';
            }, 2500);
        }
    };

    return panel;
}

function updateUI() {
    const content = document.getElementById('ae-pt-content');
    if (!content) return;
    if (!currentProduct) {
        content.innerHTML = '<div style="color: #666;">No product</div>';
        return;
    }
    const history = historyData[currentProduct.productId];
    if (!history || history.records.length === 0) {
        content.innerHTML = `
<div style="font-weight: bold; margin-bottom: 4px; font-size: 11px;">${capString(currentProduct.title)}</div>
<div style="color: #ff6a00; font-weight: bold;">€${currentProduct.price}${currentProduct.variant ? ` <span style="color: #999; font-size: 9px; font-weight: normal;">${capString(currentProduct.variant)}</span>` : ''}</div>
`;
        return;
    }
    const sortedRecords = [...history.records].reverse();
    let html = `<div style="font-weight: bold; margin-bottom: 6px; font-size: 11px;">${history.title}</div>`;
    for (const rec of sortedRecords) {
        html += `<div style="margin-bottom: 3px; padding: 3px; background: #f5f5f5; border-radius: 3px; font-size: 11px;">
<span style="font-weight: bold; color: #ff6a00;">€${rec.price}</span>${rec.variant ? ` <span style="color: #999; font-size: 9px;">${rec.variant}</span>` : ''}
</div>`;
    }
    content.innerHTML = html;
}

function exportData() {
    const json = JSON.stringify(historyData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-prices-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function deleteCurrentHistory() {
    if (currentProduct && currentProduct.productId && historyData[currentProduct.productId]) {
        delete historyData[currentProduct.productId];
        storage_set(STORAGE_KEY, historyData);
        currentProduct = null;
        updateUI();
    }
}

function performScan() {
    const result = scanForPrice();
    if (result) {
        const sanitized = {
            productId: result.productId,
            title: capString(result.title),
            price: result.price,
            raw: capString(result.raw),
            variant: capString(result.variant),
            isModal: result.isModal
        };
        const isDifferentProduct = !currentProduct || currentProduct.productId !== sanitized.productId;
        const isDifferentVariant = currentProduct && currentProduct.variant !== sanitized.variant;
        if (isDifferentProduct || isDifferentVariant) {
            currentProduct = sanitized;
            updateHistory(sanitized.productId, sanitized.title, sanitized.price, sanitized.raw, sanitized.variant);
            updateUI();
        } else if (currentProduct && currentProduct.price !== sanitized.price) {
            currentProduct = sanitized;
            const updated = updateHistory(sanitized.productId, sanitized.title, sanitized.price, sanitized.raw, sanitized.variant);
            if (updated) updateUI();
        }
    }
}

function scheduleScan() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performScan, DEBOUNCE_MS);
}

function init() {
    historyData = storage_get(STORAGE_KEY, {});
    minimized = storage_get('ae_pt_minimized', false);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createUI();
            setTimeout(scheduleScan, 500);
        });
    } else {
        createUI();
        setTimeout(scheduleScan, 500);
    }
    const observer = new MutationObserver(() => {
        scheduleScan();
    });
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
}

window.AE_PT_force = performScan;
window.AE_PT_export = () => {
    return historyData;
};

init();

})();
