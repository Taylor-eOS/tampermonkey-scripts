// ==UserScript==
// @name         Replace Em Dashes
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replaces em dashes with commas intelligently
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

    function clean(value) {
        if (typeof value !== 'string' || !value.includes('—')) return value;
        return value
            .replace(/\s*—\s*/g, ', ');
    }

  const textContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  Object.defineProperty(Node.prototype, 'textContent', {
    get() { return textContent.get.call(this); },
    set(v) { textContent.set.call(this, clean(v)); }
  });

  const data = Object.getOwnPropertyDescriptor(CharacterData.prototype, 'data');
  Object.defineProperty(CharacterData.prototype, 'data', {
    get() { return data.get.call(this); },
    set(v) { data.set.call(this, clean(v)); }
  });

  const nodeValue = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeValue');
  Object.defineProperty(Node.prototype, 'nodeValue', {
    get() { return nodeValue.get.call(this); },
    set(v) { nodeValue.set.call(this, clean(v)); }
  });

  const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  Object.defineProperty(Element.prototype, 'innerHTML', {
    get() { return innerHTML.get.call(this); },
    set(v) { innerHTML.set.call(this, clean(v)); }
  });

  const originalCreateTextNode = Document.prototype.createTextNode;
  Document.prototype.createTextNode = function (v) {
    return originalCreateTextNode.call(this, clean(v));
  };
})();
