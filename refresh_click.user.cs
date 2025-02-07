// ==UserScript==
// @name         Refresh Click
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Click a button
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles for the control button
    GM_addStyle(`
        #retryButton {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #ececec;
            color: black;
            border: none;
            padding: 8px;
            cursor: pointer;
            font-size: 10px;
            z-index: 9999;
        }
    `);

    // Create the control button and append it to the page
    const button = document.createElement('button');
    button.id = 'retryButton';
    button.innerHTML = 'Start';
    document.body.appendChild(button);

    let checking = false;
    let intervalId;

    // This function checks if the busy message exists and, if so, clicks the appropriate <rect>
    const checkAndClick = () => {
        const busyMessage = "The server is busy. Please try again later.";

        if (document.body.innerText.includes(busyMessage)) {
            // Locate the element containing the busy message via XPath
            const xpath = `//*[contains(text(), "${busyMessage}")]`;
            const busyElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (busyElement) {
                const busyRect = busyElement.getBoundingClientRect();
                // Gather all <rect> elements with id "重新生成"
                const rectElements = Array.from(document.querySelectorAll('[id="重新生成"]'));
                // Filter to those whose top is below the busy message's bottom
                const candidates = rectElements.filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.top >= busyRect.bottom;
                });
                if (candidates.length > 0) {
                    // Choose the one with the greatest top coordinate (i.e. the lowest one on the page)
                    candidates.sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top);
                    const targetRect = candidates[0];
                    console.log("Clicking target rect:", targetRect);
                    // Simulate a click on the target <rect> element
                    const rectBounds = targetRect.getBoundingClientRect();
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        clientX: rectBounds.left + 10, // adjust as needed
                        clientY: rectBounds.top + 10
                    });
                    targetRect.dispatchEvent(clickEvent);
                } else {
                    console.log("No <rect> elements found below the busy message.");
                }
            } else {
                console.log("Busy message element not found.");
            }
        }
    };

    // Toggle the checking interval when the control button is clicked
    button.addEventListener('click', () => {
        if (checking) {
            // Stop checking: clear the interval, update the button text and color
            clearInterval(intervalId);
            button.innerHTML = 'Start';
            button.style.backgroundColor = '#ececec';
        } else {
            // Start checking: set the interval, update the button text and color
            intervalId = setInterval(checkAndClick, 2000);
            button.innerHTML = 'Stop';
            button.style.backgroundColor = 'red';
        }
        checking = !checking;
    });
})();
