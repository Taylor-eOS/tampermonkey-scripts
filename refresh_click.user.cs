// ==UserScript==
// @name         Refresh Click
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button that checks for "server is busy"
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles for the button
    GM_addStyle(`
        #retryButton {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #ececec;
            color: black;
            border: none;
            padding: 8px 8px;
            cursor: pointer;
            font-size: 10px;
            z-index: 9999;
        }
    `);

    // Create the button and append it to the body
    const button = document.createElement('button');
    button.id = 'retryButton';
    button.innerHTML = 'Start';
    document.body.appendChild(button);

    let checking = false; // Flag to track whether we're checking
    let intervalId; // To store the interval for stopping the checking

    // Function to check for the text and click the rect element if found
    const checkAndClick = () => {
        const busyMessage = "The server is busy. Please try again later.";

        // Check if the "server is busy" message exists on the page
        if (document.body.innerText.includes(busyMessage)) {
            // Find the rect element with the id "重新生成"
            const rectElement = document.getElementById("重新生成");

            if (rectElement) {
                console.log("Found the rect element! Clicking...");

                // Simulate a click on the <rect> element
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    clientX: rectElement.getBoundingClientRect().left + 10, // Arbitrary X inside the rect
                    clientY: rectElement.getBoundingClientRect().top + 10 // Arbitrary Y inside the rect
                });
                rectElement.dispatchEvent(clickEvent);
            }
        }
    };

    // Button click handler to start/stop checking
    button.addEventListener('click', () => {
        if (checking) {
            // If already checking, stop it
            clearInterval(intervalId);
            button.innerHTML = 'Start Checking';
        } else {
            // If not checking, start checking
            intervalId = setInterval(checkAndClick, 2000);
            button.innerHTML = 'Stop Checking';
        }
        checking = !checking;
    });
})();
