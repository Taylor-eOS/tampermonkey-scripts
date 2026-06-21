// ==UserScript==
// @name         Replace Em Dashes
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces em dashes with commas intelligently
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function cleanText(text) {
    return text.replace(/\s*—\s*/g, ', ');
  }

  function replaceInTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('—')) {
      node.nodeValue = cleanText(node.nodeValue);
    }
  }

  let mutationQueue = [];
  let scheduled = false;

  const observer = new MutationObserver(mutations => {
    mutationQueue.push(...mutations);
    if (!scheduled) {
      scheduled = true;
      requestIdleCallback(processMutations, { timeout: 100 });
    }
  });

  function processMutations() {
    for (const mutation of mutationQueue) {
      if (mutation.type === 'characterData') {
        replaceInTextNode(mutation.target);
      } else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          walkAndReplace(node);
        });
      }
    }
    mutationQueue = [];
    scheduled = false;
  }

  function walkAndReplace(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      replaceInTextNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const child of node.childNodes) {
        walkAndReplace(child);
      }
    }
  }

  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true
  });
})();
