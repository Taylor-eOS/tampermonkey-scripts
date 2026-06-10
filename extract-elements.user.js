// ==UserScript==
// @name         Extract Elements
// @description  Streamlined element selector recorder with hover preview
// @version      5.7
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==
(function(){
    try{
        const INDICATOR_ID = 'teach_indicator_key'
        const COPY_ID = 'teach_copy_key'
        let samples = []
        let recording = false
        let lastHoveredEl = null
        try{ GM_addStyle && GM_addStyle(`
#${INDICATOR_ID}{position:fixed;left:12px;top:12px;z-index:2147483647;background:#0fb87f;color:#022;padding:6px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-family:Arial,sans-serif;user-select:none}
#${COPY_ID}{position:fixed;left:240px;top:12px;z-index:2147483647;background:#222;color:#fff;padding:6px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-family:Arial,sans-serif;user-select:none;border:1px solid #444}
.teach_highlight{outline:3px solid #ff0;box-shadow:0 0 0 6px rgba(255,255,0,0.06) !important}
.teach_toast{position:fixed;z-index:2147483648;padding:6px 8px;border-radius:6px;background:#222;color:#fff;font-family:Arial,sans-serif;font-weight:700;pointer-events:none;transform:translate(-50%,-140%);opacity:0;transition:opacity .18s}
.teach_hover{outline:2px dashed #0fb87f !important}
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
        function getAttr(el,name){
            try{ const v = el.getAttribute(name); return v ? v.substring(0,80) : null }catch(e){ return null }
        }
        function extractAttributes(el){
            const attrs = {}
            const relevant = ['id','class','href','src','type','name','value','placeholder','role','aria-label','aria-expanded','aria-pressed','contenteditable','disabled','title','target','rel','method','action']
            for(const a of relevant){
                const v = getAttr(el,a)
                if(v) attrs[a] = v
            }
            const dataAttrs = Array.from(el.attributes).filter(a=>a.name.startsWith('data-')).slice(0,5)
            for(const a of dataAttrs){
                const v = getAttr(el,a.name)
                if(v) attrs[a.name] = v
            }
            return attrs
        }
        function extractData(el){
            const rect = el.getBoundingClientRect()
            const sample = {
                selector: uniqueSelector(el),
                tagName: el.tagName.toLowerCase(),
                text: (el.textContent || '').trim().substring(0, 120),
                attributes: extractAttributes(el),
                rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
            }
            const parent = el.parentElement
            if(parent && parent.nodeType===1 && parent.tagName.toLowerCase() !== 'html'){
                sample.parentSelector = uniqueSelector(parent)
                sample.parentTag = parent.tagName.toLowerCase()
            }
            const role = el.getAttribute('role')
            if(role) sample.byRole = `[role="${role}"]`
            if(el.id) sample.byId = `#${tryEscapeId(el.id)}`
            if(el.classList && el.classList.length) sample.byClass = '.'+Array.from(el.classList).slice(0,3).map(c=>CSS&&CSS.escape?CSS.escape(c):c).join('.')
            return sample
        }
        function copySamplesToClipboard(){
            try{
                const text = JSON.stringify(samples, null, 2)
                const done = ok=>{ try{ showToast(window.innerWidth/2, 24, ok ? 'Copied results!' : 'Copy failed') }catch(e){} }
                if(navigator.clipboard && typeof navigator.clipboard.writeText === 'function'){
                    navigator.clipboard.writeText(text).then(()=>{ done(true) }).catch(()=>{ tryFallbackCopy(text, done) })
                } else {
                    tryFallbackCopy(text, done)
                }
            }catch(e){
                try{ showToast(window.innerWidth/2, 24, 'Copy failed') }catch(_){}
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
        function createInterface(){
            if(document.getElementById(INDICATOR_ID)) return
            const ind = document.createElement('div')
            ind.id = INDICATOR_ID
            ind.textContent = 'Teach OFF (Click to Record)'
            ind.addEventListener('click', ev=>{ ev.preventDefault(); ev.stopPropagation(); if(recording) stopRecording(); else startRecording() })
            const cop = document.createElement('div')
            cop.id = COPY_ID
            cop.textContent = 'Copy Results'
            cop.addEventListener('click', ev=>{ ev.preventDefault(); ev.stopPropagation(); copySamplesToClipboard() })
            document.body.appendChild(ind)
            document.body.appendChild(cop)
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
        function onWindowClick(e){
            const el = document.elementFromPoint(e.clientX, e.clientY)
            if(el && (el.id === INDICATOR_ID || el.id === COPY_ID)) return
            e.preventDefault()
            e.stopPropagation()
            if(!el) return
            samples.push(extractData(el))
            try{ el.classList && el.classList.add('teach_highlight') }catch(e){}
            setTimeout(()=>{ try{ el.classList && el.classList.remove('teach_highlight') }catch(e){} },400)
            const rect = el.getBoundingClientRect()
            showToast(Math.round(rect.left + rect.width/2), Math.max(8, rect.top), `Captured (${samples.length})`)
        }
        function onMouseMove(e){
            const el = document.elementFromPoint(e.clientX, e.clientY)
            if(lastHoveredEl !== el){
                if(lastHoveredEl){
                    try{ lastHoveredEl.classList.remove('teach_hover') }catch(_){}
                }
                lastHoveredEl = el
                if(el && el.id !== INDICATOR_ID && el.id !== COPY_ID){
                    try{ el.classList.add('teach_hover') }catch(_){}
                }
            }
        }
        function startRecording(){
            if(recording) return
            recording = true
            const ind = document.getElementById(INDICATOR_ID)
            if(ind){ ind.textContent = 'RECORDING (Click elements)'; ind.style.background = '#ff8a00' }
            window.addEventListener('click', onWindowClick, true)
            window.addEventListener('mousemove', onMouseMove, true)
        }
        function stopRecording(){
            if(!recording) return
            recording = false
            const ind = document.getElementById(INDICATOR_ID)
            if(ind){ ind.textContent = 'Teach OFF (Click to Record)'; ind.style.background = '#0fb87f' }
            window.removeEventListener('click', onWindowClick, true)
            window.removeEventListener('mousemove', onMouseMove, true)
            if(lastHoveredEl){
                try{ lastHoveredEl.classList.remove('teach_hover') }catch(_){}
                lastHoveredEl = null
            }
        }
        ensureBody(()=>{
            try{ createInterface() }catch(e){ console.error('Teach initialization failed', e) }
        })
    }catch(initErr){
        console.error('Teach initialization context breakdown', initErr)
    }
})()
