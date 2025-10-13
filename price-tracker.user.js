// ==UserScript==
// @name         Price Tracker
// @version      2.3
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

let historyData = {};
let debounceTimer = null;
let currentProduct = null;
let lastModalTitle = null;
let minimized = false;

function storage_get(key, defaultVal) {
    try {
        if (typeof GM_getValue !== 'undefined') {
            const val = GM_getValue(key);
            return val !== undefined ? JSON.parse(val) : defaultVal;
        }
    } catch(e) {}
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultVal;
    } catch(e) {}
    return defaultVal;
}

function storage_set(key, value) {
    try {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(key, JSON.stringify(value));
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

function extractVariant(modal) {
    const ctx = modal || document;
    const titleEl = ctx.querySelector('.sku-item--title--Z0HLO87');
    if (titleEl && isVisible(titleEl)) {
        const text = titleEl.textContent.trim();
        const m = text.match(/([A-Z][a-z]+)[:\s]*([^\n\r]+)/i);
        if (m && m[2]) {
            const variant = `${m[1]}: ${m[2]}`.trim();
            console.log('[AE_PT] Found variant by title element:', variant);
            return variant;
        }
    }
    const walker = document.createTreeWalker(ctx, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        if (!isVisible(node.parentElement)) continue;
        const text = node.textContent.trim();
        if (!text) continue;
        const m = text.match(/([A-Z][a-z]+)[:\s]*([^\n\r]+)/i);
        if (m && m[2]) {
            const variant = `${m[1]}: ${m[2]}`.trim();
            console.log('[AE_PT] Found variant by text match:', variant);
            return variant;
        }
    }
    console.log('[AE_PT] No variant found');
    return null;
}

function extractProductId(modal, forcedVariant) {
    const variant = typeof forcedVariant !== 'undefined' ? forcedVariant : extractVariant(modal);
    if (modal) {
        const titleEl = modal.querySelector('.title--wrap--UUHae_g');
        if (titleEl) {
            const titleText = titleEl.textContent.trim().substring(0, 50);
            const baseId = `modal-${titleText}`.replace(/[^a-zA-Z0-9-]/g, '_');
            return variant ? `${baseId}--${variant.replace(/\s+/g, '_')}` : baseId;
        }
    }
    const urlMatch = window.location.href.match(/\/item\/(\d+)\.html/);
    if (urlMatch) {
        const baseId = `item-${urlMatch[1]}`;
        return variant ? `${baseId}--${variant.replace(/\s+/g, '_')}` : baseId;
    }
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        const match = ogUrl.content.match(/\/item\/(\d+)\.html/);
        if (match) {
            const baseId = `item-${match[1]}`;
            return variant ? `${baseId}--${variant.replace(/\s+/g, '_')}` : baseId;
        }
    }
    return null;
}

function extractTitle(modal) {
    if (modal) {
        const titleEl = modal.querySelector('.title--wrap--UUHae_g h1, .title--wrap--UUHae_g');
        if (titleEl) {
            console.log('[AE_PT] Found modal title');
            return titleEl.textContent.trim();
        }
    }
    const titleEl = document.querySelector('.title--wrap--UUHae_g h1, .title--wrap--UUHae_g');
    if (titleEl) return titleEl.textContent.trim();
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && ogTitle.content.trim()) return ogTitle.content.trim();
    return document.title.trim();
}

function extractPrice(modal) {
    const context = modal || document;
    const priceEl = context.querySelector('.price-default--current--F8OlYIo, .product-price-current, .product-price-value');
    if (!priceEl || !isVisible(priceEl)) {
        console.log('[AE_PT] Price element not found or not visible');
        return null;
    }
    const text = priceEl.textContent.trim();
    const match = text.match(/(\d{1,3}(?:[\s\.]?\d{3})*[,\.]\d{2})/);
    if (!match) {
        console.log('[AE_PT] No price match in text:', text);
        return null;
    }
    const raw = match[1];
    const price = normalizePrice(raw);
    if (isNaN(price) || price <= 0) return null;
    console.log('[AE_PT] Found price:', price, 'from raw:', raw);
    return { price, raw };
}

function scanForPrice() {
    console.log('[AE_PT] Starting scan...');
    if (isComboBlastPage() && !isInModal()) {
        console.log('[AE_PT] Combo Blast main page, waiting for modal');
        return null;
    }
    const modal = document.querySelector('.pdp-mini-wrap') || null;
    const title = extractTitle(modal);
    if (!title) {
        console.log('[AE_PT] No title found');
        return null;
    }
    if (modal && lastModalTitle && lastModalTitle !== title) {
        console.log('[AE_PT] Modal changed, forcing update');
        lastModalTitle = title;
        currentProduct = null;
    }
    if (modal) {
        lastModalTitle = title;
    }
    const variant = extractVariant(modal);
    const productId = extractProductId(modal, variant);
    if (!productId) {
        console.log('[AE_PT] No product ID found');
        return null;
    }
    const priceData = extractPrice(modal);
    if (!priceData) {
        console.log('[AE_PT] No price found');
        return null;
    }
    console.log('[AE_PT] Scan complete:', { productId, title, price: priceData.price, variant });
    return { productId, title, price: priceData.price, raw: priceData.raw, variant, isModal: !!modal };
}

function updateHistory(productId, title, price, raw, variant) {
    if (!historyData[productId]) {
        historyData[productId] = {
            title,
            canonicalUrl: window.location.href.split('?')[0],
            records: []
        };
    }
    const history = historyData[productId];
    const lastRecord = history.records[history.records.length - 1];
    let skip = false;
    if (lastRecord && lastRecord.price === price && lastRecord.variant === variant) {
        skip = true;
        console.log('[AE_PT] Price and variant unchanged, skipping storage update');
    }
    if (skip) {
        return false;
    }
    history.title = title;
    history.records.push({
        ts: new Date().toISOString(),
        price,
        raw,
        variant: variant || null,
        pageUrl: window.location.href
    });
    storage_set(STORAGE_KEY, historyData);
    console.log(`[AE_PT] Saved new price: ${price} for ${productId}`);
    return true;
}

function createUI() {
    const panel = document.createElement('div');
    panel.id = 'ae-price-tracker-panel';
    panel.style.cssText = `
position: fixed;
top: 10px;
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
    document.getElementById('ae-pt-delete').onclick = deleteCurrentHistory;
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
<div style="font-weight: bold; margin-bottom: 4px; font-size: 11px;">${currentProduct.title}</div>
<div style="color: #ff6a00; font-weight: bold;">€${currentProduct.price}${currentProduct.variant ? ` <span style="color: #999; font-size: 9px; font-weight: normal;">${currentProduct.variant}</span>` : ''}</div>
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
    console.log('[AE_PT] Exported data');
}

function deleteCurrentHistory() {
    if (currentProduct && currentProduct.productId && historyData[currentProduct.productId]) {
        delete historyData[currentProduct.productId];
        storage_set(STORAGE_KEY, historyData);
        currentProduct = null;
        updateUI();
        console.log('[AE_PT] Deleted current product history');
    }
}

function performScan() {
    const result = scanForPrice();
    if (result) {
        const isDifferentProduct = !currentProduct || currentProduct.productId !== result.productId;
        const isDifferentVariant = currentProduct && currentProduct.variant !== result.variant;
        if (isDifferentProduct || isDifferentVariant) {
            currentProduct = result;
            const updated = updateHistory(result.productId, result.title, result.price, result.raw, result.variant);
            updateUI();
        } else if (currentProduct && currentProduct.price !== result.price) {
            currentProduct = result;
            const updated = updateHistory(result.productId, result.title, result.price, result.raw, result.variant);
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
    console.log('[AE_PT] Loaded history:', Object.keys(historyData).length, 'products');
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
    console.log('[AE_PT] Initialized with mutation observer');
}

window.AE_PT_force = performScan;
window.AE_PT_export = () => {
    console.log('[AE_PT] Current data:', historyData);
    return historyData;
};

init();

})();
