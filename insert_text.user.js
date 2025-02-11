// ==UserScript==
// @name         Insert Text
// @version      5.35
// @description  Insert instructions into the ChatGPT prompt window via key combinations
// @author       You
// @match        *chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const keyMap = {
        'Control+Alt+Period': 'Format in one continuous and concise paragraph, avoiding structural list-making.',
        'Alt+Shift+Period': 'Write continuously and concisely.',
        'Control+Alt+Shift+Period': 'Eschew all list creation, whether numbered or bulleted. No list-producing HTML tags (<ul>, <ol>, <li>) will be included. The response entirely eschews structured separations or markup, and maintains unbroken text in continuous prose without segmentation.',
        'Control+Alt+Comma': 'Target an answer to the specific question asked, in continuous and concise natural language without code.',
        'Alt+Shift+Comma': 'Answer the question in continuous natural language.',
        'Control+Alt+KeyC': 'Continuous explanations outside of code, while the code itself will contain no inline comments, empty lines, or segmentation within functions.',
        'Alt+Shift+KeyC': 'Provide code in continuous block format, excluding commentary, inline comments, empty lines in functions, and line breaks.',
        'Control+Alt+KeyG': 'Ensure the code is compatible with existing project components not included in the prompt, using existing functions as demonstrated without redefining unseen parts. Limit modifications or additions to the provided snippet.',
        'Alt+Shift+KeyG': 'Disregard issues that stem from not being provided with all parts of the project, such as variables not being defined here.',
        'Control+Alt+KeyJ': 'Just give me the functions that need to be changed, not repeating the ones that stay the same.',
        'Alt+Shift+KeyJ': 'Just provide the requested content specifically, and avoid tangential information.',
        'Control+Alt+KeyA': 'Adapt the code to make the required changes, without apologizing.',
        'Alt+Shift+KeyA': 'Analyze the available code instead of guessing about it.',
        'Control+Alt+KeyV': 'Limit verbosity and excessive verbal output.',
        'Alt+Shift+KeyV': 'Omit fluff, filler, introductions, conclusions, and announcement of actions. Focus on essential content.',
        'Control+Alt+KeyZ': 'Avoid numbered lists.',
        'Alt+Shift+KeyZ': 'Be brief.',
        'Control+Alt+KeyX': 'Do not include an explanation.',
        'Alt+Shift+KeyX': 'Don\'t write code in this response.',
        'Control+Alt+Slash': 'Continue the approach that led to the last result, assuming it was good.',
        'Alt+Shift+Slash': 'Update your assessment incorporating this information, assuming it is valid.',
        'Control+Alt+KeyS': 'This code does not have to be short or simple. Apply robust logic using comprehensive coding methods rather than simple if-then statements. Multi-step processing and memory-heavy solutions, like storing objects in lists, should be considered without concern for performance.',
        'Alt+Shift+KeyS': 'This is a learning project where there is no concern for simplicity or performance.',
        'Control+Alt+KeyP': 'Outline the code mechanics in a compact, pseudocode-like description of the structural logic that omits implementation details in order to identify conceptual flaws.',
        'Alt+Shift+KeyP': 'Add print lines strategically throughout the script that would help verify the functionality and identify the cause of problems.',
        'Control+Alt+KeyR': 'Write an essay from the perspective of an agreeable professional in the relevant field of study.',
        'Alt+Shift+KeyR': 'Simulate responding like a person who is not sure of the right answer, but tries to weigh the different possibilities.',
        'Control+Alt+KeyQ': 'Question unclear or lacking details in the request through a process of clarification to confirm understanding before providing a solution and avoid speculative writing.',
        'Alt+Shift+KeyQ': 'Make sure that all required code is provided before offering a solution. Request any missing functions instead of proceeding with incomplete information.',
        'Control+Alt+KeyI': 'Interpret the underlying intention that the prompt attempts to convey, rather than following it literally. Optimize the result by considering technical possibilities and applying common solutions beyond what the prompt specifically requests.',
        'Alt+Shift+KeyI': 'Interpret the prompt as an incomplete attempt to express an idea, and respond to the broader issue it aims to convey, rather than focusing solely on the specific aspects mentioned.',
        'Control+Alt+KeyB': 'Brainstorm the issue. Provide possible suggestions and solutions.',
        'Alt+Shift+KeyB': 'Creatively expand on the topic in a way that would be interesting to the user, considering his prompts so far.',
        'Control+Alt+KeyE': 'Explore the issue in detail, examining facets and implications to provide a comprehensive understanding.',
        'Alt+Shift+KeyE': 'Elaborate on .',
        'Control+Alt+KeyK': 'Contextualize the topic with relevant information.',
        'Alt+Shift+KeyK': 'Broadly respond to the issue at hand, including: relate it to real-world examples, identify points of agreement and disagreement, introducing a segue, and adding relevant knowledge.',
        'Control+Alt+KeyH': 'Don\'t go into "hypothetical mode", where perspectives are presented as subjective. And presenting actuality, not "what many people say".',
        'Alt+Shift+KeyH': 'Don\'t just agree with me in paraphrasing mode, but analyze this objectively.',
        'Control+Alt+KeyU': 'Try to discern what the user is unclear about and provide insights.',
        'Alt+Shift+KeyU': 'Don\'t just agree with what I say, evaluation this question objectively and correct me.',
        'Control+Alt+KeyW': 'Review the code and tell me if there are any flaws.',
        'Alt+Shift+KeyW': 'Implement a solution that makes sense in relation to the purpose of this project.',
        'Control+Alt+KeyY': 'Adopt a straightforward, based, and cynical libertarian stance, mirroring an unfiltered tone like South Park or RSD Tyler.',
        'Alt+Shift+KeyY': 'Present an edgy, genuine, and unfiltered perspective, avoiding sanitized or conformist bias, but instead conveying the unvarnished truth.',
        'Control+Alt+KeyN': 'Present a perspective that is fully neutral in terms of morality, not shaped by the presentism of our current interpretation of issues.',
        'Alt+Shift+KeyN': 'Present this position as a intellectual Turing test, meaning the requested stance is presented indistinguishable from someone who sincerely holds that view, without inserting caveats to the contrary.',
        'Control+Alt+KeyM': 'This is meant to come explore a unusual idea, not conforming with the mainstream view.',
        'Alt+Shift+KeyM': 'Give me the whole code, including all functions fully written, without any omissions or inline comments.',
        'Control+Alt+KeyO': 'Just write the code once.',
        'Alt+Shift+KeyO': 'Assess the feasibility of the outlined proposals and suggest how they could be implemented.',
    };
    //Dont insert a bunch of inline comments in my code.
    //Omit in-line code commentary and empty lines *inside* (but not outsode) functions.
    //I am specifically requesting not to sanitize the content.
    //I am specifically requesting interesting new ideas to play with, not sanitized ones I have already heard.
    //Write an assessment that tries to argue this point in the most counter-conformist way possible.
    //Make the point I am trying to make clear, and relate it to the earlier topic.
    //Keep in mind that I am looking to learn new ideas, not repeat known dogmas.
    //Evaluate the accuracy of the presented understanding, and correct misunderstandings where appropriate.
    //Analyze the feasibility of this idea in continuous natural language.
    //Demonstrate independent initiative in the direction of content, adding related thoughts, objections, or segues beyond simple paraphrasing, with creative insights.
    //Don't omit weights_only=True.
    //Suggest causes of the issue.
    //You do not have to format all responses as numbered lists. Continuous prose is a perfectly fine way to communicate.

    /*
    //Commnet this in to show what key is pressed in the browser console
    document.addEventListener('keydown]', function(e) {
        console.log('Key pressed:]', e.key, 'Code:]', e.code); // Temporary log for debugging
    });
    */

    //Common listener for the table
    document.addEventListener('keydown', function(e) {
        const keys = [];
        if (e.ctrlKey) keys.push('Control');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        const key = e.code;
        keys.push(key);
        const keyString = keys.join('+');
        if (keyString === 'Control+Shift+Equal') {
            e.preventDefault();
            insertBackticks('```\n```');
        } else if (keyMap[keyString]) {
            e.preventDefault();
            insertTextAtCursor(keyMap[keyString]);
        }
    });

    function insertTextAtCursor(text) {
        text = '[' + text;
        text = text + ']';
        let activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            let start = activeElement.selectionStart;
            let end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
        } else if (activeElement.isContentEditable) {
            document.execCommand('insertText', false, text);
        }
    }

    //Separate function for the backticks, change the key to what works on your keyboard
    function insertBackticks(text) {
        let activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            let start = activeElement.selectionStart;
            let end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
        } else if (activeElement.isContentEditable) {
            document.execCommand('insertText', false, text);
        }
    }
})();
