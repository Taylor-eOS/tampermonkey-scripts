// ==UserScript==
// @name         Auto Reload WebApp
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Reload the web app shortly after access
// @author       YourName
// @match        https://chatgpt.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        setTimeout(function() {
            console.log('Reloading the page');
            window.location.reload();
        }, 400);
    }
})();
