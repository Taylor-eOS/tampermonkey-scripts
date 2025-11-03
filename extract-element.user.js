// ==UserScript==
// @name         Extract Element
// @description  Find element similarity
// @version      5
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function(){
    try{
        const INDICATOR_ID = 'teach_indicator_key'
        const PANEL_ID = 'teach_panel_key'
        const STORAGE_KEY = 'teach_samples_key_v1'
        let samples = []
        let recording = false
        let lastMouse = {x:0,y:0}

        try{ GM_addStyle && GM_addStyle(`
#${INDICATOR_ID}{position:fixed;left:12px;top:12px;z-index:2147483647;background:#0fb87f;color:#022;padding:6px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-family:Arial,sans-serif;user-select:none}
#${PANEL_ID}{position:fixed;left:12px;top:52px;z-index:2147483646;background:#111;color:#fff;padding:10px;border-radius:6px;max-width:720px;max-height:60vh;overflow:auto;font-family:monospace;display:none;white-space:pre-wrap}
.teach_highlight{outline:3px solid #ff0;box-shadow:0 0 0 6px rgba(255,255,0,0.06) !important}
.teach_toast{position:fixed;z-index:2147483648;padding:6px 8px;border-radius:6px;background:#222;color:#fff;font-family:Arial,sans-serif;font-weight:700;pointer-events:none;transform:translate(-50%,-140%);opacity:0;transition:opacity .18s}
.teach_btn{background:#222;color:#fff;border:1px solid #444;padding:4px 8px;border-radius:4px;margin-right:6px;cursor:pointer;font-family:monospace}
.teach_input{width:56px;padding:4px;background:#222;color:#fff;border:1px solid #444;border-radius:4px;margin-right:6px}
`)}catch(e){ console.warn('GM_addStyle failed', e) }

        function ensureBody(cb){
            if(document.body){ cb(); return }
            let done = false
            const mo = new MutationObserver(()=>{ if(document.body && !done){ done = true; mo.disconnect(); cb() } })
            mo.observe(document.documentElement || document, {childList:true, subtree:true})
            setTimeout(()=>{ if(!done && document.body){ done = true; mo.disconnect(); cb() } }, 3000)
        }

        function tryEscapeId(id){
            try{ return CSS && CSS.escape ? CSS.escape(id) : id }catch(e){ return id }
        }

        function uniqueSelector(el){
            if(!el || el.nodeType!==1) return ''
            if(el.id) return '#'+tryEscapeId(el.id)
            const parts = []
            let node = el
            while(node && node.nodeType===1 && node.tagName.toLowerCase() !== 'html'){
                let part = node.tagName.toLowerCase()
                if(node.classList && node.classList.length){
                    const classes = Array.from(node.classList).slice(0,3).map(c=>'.'+(CSS&&CSS.escape?CSS.escape(c):c)).join('')
                    part += classes
                } else {
                    const sibs = node.parentNode ? Array.from(node.parentNode.children) : []
                    const idx = sibs.indexOf(node) + 1
                    part += `:nth-child(${idx})`
                }
                parts.unshift(part)
                node = node.parentElement
            }
            return parts.join('>')
        }

        function getElementPattern(el){
            if(!el || el.nodeType!==1) return null
            const attrs = {}
            if(el.hasAttributes()){
                for(const a of el.attributes){
                    if(a.name!=='style') attrs[a.name] = a.value
                }
            }
            return {
                tag: el.tagName.toLowerCase(),
                classes: el.className ? Array.from(el.classList) : [],
                attributes: attrs,
                role: el.getAttribute('role') || null,
                ariaLabel: el.getAttribute('aria-label') || null,
                dataAttributes: Object.keys(attrs).filter(k=>k.startsWith('data-')).reduce((acc,k)=>{acc[k]=attrs[k];return acc},{}),
                hasText: !!(el.textContent||'').trim(),
                hasChildren: el.children.length > 0,
                childCount: el.children.length
            }
        }

        function getContextChain(el, depth=4){
            const chain = []
            let node = el
            let d = 0
            while(node && node.nodeType===1 && node.tagName.toLowerCase()!=='html' && d<depth){
                chain.push(getElementPattern(node))
                node = node.parentElement
                d++
            }
            return chain
        }

        function findSimilarElements(pattern){
            if(!pattern) return []
            const all = Array.from(document.querySelectorAll(pattern.tag))
            return all.filter(el=>{
                if(pattern.classes.length > 0){
                    const hasAll = pattern.classes.every(c=>el.classList.contains(c))
                    if(!hasAll) return false
                }
                if(pattern.role && el.getAttribute('role') !== pattern.role) return false
                if(pattern.ariaLabel && el.getAttribute('aria-label') !== pattern.ariaLabel) return false
                const dataKeys = Object.keys(pattern.dataAttributes)
                if(dataKeys.length > 0){
                    const matchData = dataKeys.every(k=>el.getAttribute(k)===pattern.dataAttributes[k])
                    if(!matchData) return false
                }
                return true
            })
        }

        function saveSamples(){
            try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(samples)) }catch(e){ console.warn('saveSamples failed', e) }
        }

        function loadSamples(){
            try{ const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw) : [] }catch(e){ console.warn('loadSamples failed', e); return [] }
        }

        function addSampleFromElement(el){
            if(!el || el.nodeType!==1) return null
            const pattern = getElementPattern(el)
            const contextChain = getContextChain(el, 5)
            const similarElements = findSimilarElements(pattern)
            const classSelector = pattern.classes.length > 0 ? pattern.tag + '.' + pattern.classes.map(c=>CSS&&CSS.escape?CSS.escape(c):c).join('.') : pattern.tag
            const s = {
                elementPattern: pattern,
                contextChain,
                classSelector,
                matchCount: similarElements.length
            }
            samples.push(s)
            saveSamples()
            return s
        }

        function clearSamples(){
            samples = []
            saveSamples()
            const panel = document.getElementById(PANEL_ID)
            if(panel && panel.style.display==='block') showPanel()
            showToast(window.innerWidth/2, 24, 'cleared')
        }

        function copySamplesToClipboard(){
            try{
                const panel = document.getElementById(PANEL_ID)
                const text = JSON.stringify(samples, null, 2)
                if(!text){ showToast(window.innerWidth/2, 24, 'nothing to copy'); return }
                const done = ok=>{ try{ showToast(window.innerWidth/2, 24, ok ? 'copied' : 'copy failed') }catch(e){} }
                if(navigator.clipboard && typeof navigator.clipboard.writeText === 'function'){
                    navigator.clipboard.writeText(text).then(()=>{ done(true) }).catch(()=>{ tryFallbackCopy(text, done) })
                } else {
                    tryFallbackCopy(text, done)
                }
            }catch(e){
                try{ showToast(window.innerWidth/2, 24, 'copy failed') }catch(_){}
            }
        }

        function tryFallbackCopy(text, cb){
            try{
                const ta = document.createElement('textarea')
                ta.value = text
                ta.setAttribute('readonly', '')
                ta.style.position = 'fixed'
                ta.style.left = '-9999px'
                document.body.appendChild(ta)
                ta.focus()
                ta.select()
                const ok = document.execCommand && document.execCommand('copy')
                try{ ta.remove() }catch(e){}
                cb(!!ok)
            }catch(e){
                cb(false)
            }
        }

        function analyzeCommonPatterns(){
            if(samples.length < 2) return {message: 'Need at least 2 samples to find patterns'}
            const commonClasses = samples.map(s=>s.elementPattern.classes).reduce((acc,classes)=>{
                if(acc === null) return new Set(classes)
                return new Set([...acc].filter(c=>classes.includes(c)))
            }, null)
            const commonTag = samples.every(s=>s.elementPattern.tag === samples[0].elementPattern.tag) ? samples[0].elementPattern.tag : null
            const commonAttrs = {}
            if(samples.length > 0){
                const firstAttrs = Object.keys(samples[0].elementPattern.attributes)
                firstAttrs.forEach(attr=>{
                    const allHave = samples.every(s=>attr in s.elementPattern.attributes)
                    if(allHave) commonAttrs[attr] = samples.map(s=>s.elementPattern.attributes[attr])
                })
            }
            const commonDataAttrs = Object.keys(commonAttrs).filter(k=>k.startsWith('data-'))
            const commonContext = []
            if(samples.length > 1 && samples[0].contextChain.length > 0){
                const minDepth = Math.min(...samples.map(s=>s.contextChain.length))
                for(let i=0; i<minDepth; i++){
                    const tags = samples.map(s=>s.contextChain[i].tag)
                    if(tags.every(t=>t===tags[0])){
                        const classes = samples.map(s=>s.contextChain[i].classes)
                        const sharedClasses = classes.reduce((acc,cls)=>{
                            if(acc === null) return new Set(cls)
                            return new Set([...acc].filter(c=>cls.includes(c)))
                        }, null)
                        commonContext.push({
                            depth: i,
                            tag: tags[0],
                            sharedClasses: sharedClasses ? [...sharedClasses] : []
                        })
                    }
                }
            }
            return {
                sampleCount: samples.length,
                commonTag,
                commonClasses: commonClasses ? [...commonClasses] : [],
                commonAttributes: Object.keys(commonAttrs),
                commonDataAttributes: commonDataAttrs,
                commonContext,
                suggestedSelector: commonTag && commonClasses && commonClasses.size > 0 ? commonTag + '.' + [...commonClasses].join('.') : commonTag || null
            }
        }

        function showPanel(){
            const panel = document.getElementById(PANEL_ID)
            if(!panel) return
            panel.style.display = 'block'
            const analysis = analyzeCommonPatterns()
            const meta = {
                analysis,
                samples: samples.map(s=>({
                    tag: s.elementPattern.tag,
                    classes: s.elementPattern.classes,
                    matchCount: s.matchCount,
                    dataAttrs: Object.keys(s.elementPattern.dataAttributes)
                }))
            }
            const header = document.createElement('div')
            header.style.marginBottom = '8px'
            const btnClear = document.createElement('button')
            btnClear.className = 'teach_btn'
            btnClear.textContent = 'Clear all samples'
            btnClear.addEventListener('click', ()=>{ if(confirm('Clear all samples?')) clearSamples() })
            const btnCopy = document.createElement('button')
            btnCopy.className = 'teach_btn'
            btnCopy.textContent = 'Copy all samples'
            btnCopy.addEventListener('click', ()=>{ copySamplesToClipboard() })
            header.appendChild(btnCopy)
            header.appendChild(btnClear)
            const pre = document.createElement('pre')
            pre.style.whiteSpace = 'pre-wrap'
            pre.textContent = JSON.stringify(meta, null, 2)
            panel.innerHTML = ''
            panel.appendChild(header)
            panel.appendChild(pre)
        }

        function createIndicator(){
            if(document.getElementById(INDICATOR_ID)) return
            const el = document.createElement('div')
            el.id = INDICATOR_ID
            el.textContent = 'Teach ON  (press "a" to capture)'
            el.style.userSelect = 'none'
            el.addEventListener('click', ev=>{ ev.stopPropagation(); const p = document.getElementById(PANEL_ID); if(p && p.style.display==='block') p.style.display='none'; else showPanel() })
            el.addEventListener('contextmenu', ev=>{ ev.preventDefault(); ev.stopPropagation(); if(recording) stopRecording(); else startRecording() })
            document.body.appendChild(el)
        }

        function createPanel(){
            if(document.getElementById(PANEL_ID)) return
            const p = document.createElement('div')
            p.id = PANEL_ID
            p.style.display = 'none'
            document.body.appendChild(p)
        }

        function showToast(x,y,text){
            try{
                const t = document.createElement('div')
                t.className = 'teach_toast'
                t.textContent = text
                document.body.appendChild(t)
                t.style.left = (x)+'px'
                t.style.top = (y)+'px'
                requestAnimationFrame(()=>{ t.style.opacity = '1' })
                setTimeout(()=>{ t.style.opacity = '0'; setTimeout(()=>{ try{ t.remove() }catch(e){} },200) },600)
            }catch(e){}
        }

        function captureAtCursor(clientX, clientY){
            const el = document.elementFromPoint(clientX, clientY)
            if(!el) return null
            const s = addSampleFromElement(el)
            try{ el.classList && el.classList.add('teach_highlight') }catch(e){}
            setTimeout(()=>{ try{ el.classList && el.classList.remove('teach_highlight') }catch(e){} },600)
            const rect = el.getBoundingClientRect()
            const cx = Math.round(rect.left + rect.width/2)
            const count = s ? s.matchCount : 0
            showToast(cx, Math.max(8, rect.top), `captured (${count} similar)`)
            const panel = document.getElementById(PANEL_ID)
            if(panel && panel.style.display==='block') showPanel()
            return s
        }

        function onKeyDown(e){
            if(e.key === 'a'){
                const ae = document.activeElement
                if(ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return
                try{ e.preventDefault() }catch(_){}
                captureAtCursor(lastMouse.x, lastMouse.y)
                return
            }
            if(e.key === 'R' && e.ctrlKey && e.shiftKey){
                try{ e.preventDefault() }catch(_){}
                if(recording) stopRecording()
                else startRecording()
                return
            }
            if(e.key === 'Escape' && recording){
                stopRecording()
                return
            }
        }

        function onMouseMove(e){
            lastMouse.x = e.clientX
            lastMouse.y = e.clientY
        }

        function startRecording(){
            if(recording) return
            recording = true
            const ind = document.getElementById(INDICATOR_ID)
            if(ind){ ind.textContent = 'Teach RECORD  (press "a" to capture)'; ind.style.background = '#ff8a00' }
            window.addEventListener('keydown', onKeyDown, true)
            window.addEventListener('mousemove', onMouseMove, true)
        }

        function stopRecording(){
            if(!recording) return
            recording = false
            const ind = document.getElementById(INDICATOR_ID)
            if(ind){ ind.textContent = 'Teach ON  (press "a" to capture)'; ind.style.background = '#0fb87f' }
            window.removeEventListener('keydown', onKeyDown, true)
            window.removeEventListener('mousemove', onMouseMove, true)
        }

        ensureBody(()=>{
            try{
                samples = loadSamples()
                createIndicator()
                createPanel()
                window.addEventListener('mousemove', onMouseMove, true)
                window.addEventListener('keydown', onKeyDown, true)
                if(typeof GM_registerMenuCommand === 'function'){
                    try{ GM_registerMenuCommand('Teach: Show panel', ()=>{ showPanel() }) }catch(e){}
                    try{ GM_registerMenuCommand('Teach: Clear all samples', ()=>{ if(confirm('Clear all samples?')) clearSamples() }) }catch(e){}
                }
            }catch(e){
                console.error('Teach initialization failed inside ensureBody', e)
            }
        })
    }catch(initErr){
        try{ console.error('Teach top-level error', initErr) }catch(e){}
    }
})()
