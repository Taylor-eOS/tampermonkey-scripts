// ==UserScript==
// @name         Insert Backticks Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Inserts backticks into a specific element, even if text already exists
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    const button = document.createElement('button');
    //button.textContent = '`';
    button.style.position = 'fixed';
    button.style.bottom = '53px';
    button.style.left = '370px';
    button.style.width = '12px';
    button.style.height = '12px';
    button.style.backgroundColor = '#ececec';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.zIndex = '1000';
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    button.style.padding = '0';
    button.style.margin = '0';

    // Function to insert text into a specific element
    const insertBackticks = () => {
        const targetElement = document.querySelector('p[data-placeholder="Message ChatGPT"]');
        if (targetElement) {
            const backticks = '```\n\n\n```';
            // Append backticks to existing content, handling <br> tags for new lines
            const existingContent = targetElement.innerHTML;
            targetElement.innerHTML = existingContent + backticks.replace(/\n/g, '<br>');
        }
    };

    // Attach the click event to the button
    button.addEventListener('click', insertBackticks);

    // Append the button to the body
    document.body.appendChild(button);
})();
