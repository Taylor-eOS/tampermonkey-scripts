// ==UserScript==
// @name         Teach Helper Select-and-Capture
// @version      1.0.1
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

const INDICATOR_ID='ae_teach_indicator_select'
const PANEL_ID='ae_teach_panel_select'
const BTN_ID='ae_teach_button_select'
const HIGHLIGHT_CLS='ae_teach_highlight_select'
GM_addStyle(`
#${INDICATOR_ID}{position:fixed;left:12px;top:12px;z-index:2147483647;background:#0fb87f;color:#022;padding:6px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-family:Arial,sans-serif}
#${PANEL_ID}{position:fixed;left:12px;top:52px;z-index:2147483647;background:#111;color:#fff;padding:10px;border-radius:6px;max-width:640px;max-height:60vh;overflow:auto;font-family:monospace;display:none}
#${BTN_ID}{position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#0b74de;color:#fff;padding:10px 14px;border-radius:8px;cursor:pointer;font-family:Arial,sans-serif}
.${HIGHLIGHT_CLS}{outline:3px solid #ff0;box-shadow:0 0 0 6px rgba(255,255,0,0.06) !important}
`)

function ensureBody(cb){ if(document.body){cb();return} new MutationObserver((m,o)=>{ if(document.body){ o.disconnect(); cb() } }).observe(document.documentElement,{childList:true}) }

function tryEscapeId(id){ try{return CSS && CSS.escape ? CSS.escape(id) : id }catch(e){return id} }

function uniqueSelector(el){
  if(!el||el.nodeType!==1) return ''
  if(el.id) return '#'+tryEscapeId(el.id)
  const parts=[]
  let node=el
  while(node&&node.nodeType===1&&node.tagName.toLowerCase()!=='html'){
    let part=node.tagName.toLowerCase()
    if(node.classList&&node.classList.length){
      const classes=Array.from(node.classList).slice(0,3).map(c=>'.'+(CSS&&CSS.escape?CSS.escape(c):c)).join('')
      part+=classes
    } else {
      const sibs=node.parentNode?Array.from(node.parentNode.children):[]
      const idx=sibs.indexOf(node)+1
      part+=`:nth-child(${idx})`
    }
    parts.unshift(part)
    node=node.parentElement
  }
  return parts.join('>')
}

function buildClassSelector(el){
  if(!el||el.nodeType!==1||!el.classList||el.classList.length===0) return null
  const classes=Array.from(el.classList).map(c=>CSS&&CSS.escape?CSS.escape(c):c).join('.')
  return '.'+classes
}

function getElementChain(el, maxDepth=5){
  const chain=[]
  let node=el
  let depth=0
  while(node&&node.nodeType===1&&node.tagName.toLowerCase()!=='html'&&depth<maxDepth){
    const info={
      tag:node.tagName.toLowerCase(),
      classes:node.className?Array.from(node.classList):[]
    }
    if(node.id) info.id=node.id
    const attrs={}
    if(node.hasAttributes()){
      for(const attr of node.attributes){
        if(attr.name!=='class'&&attr.name!=='id'&&attr.name!=='style'){
          attrs[attr.name]=attr.value
        }
      }
    }
    if(Object.keys(attrs).length>0) info.attributes=attrs
    chain.push(info)
    node=node.parentElement
    depth++
  }
  return chain
}

function findModalContext(el){
  let node=el
  while(node&&node!==document.body){
    const classList=node.className||''
    if(typeof classList==='string'){
      if(classList.includes('comet-v2-modal')||classList.includes('pdp-mini-wrap')||classList.includes('mini--container')){
        return {
          isModal:true,
          modalClasses:Array.from(node.classList),
          modalTag:node.tagName.toLowerCase()
        }
      }
    }
    node=node.parentElement
  }
  return {isModal:false}
}

function xpathFor(el){
  if(!el||el.nodeType!==1) return ''
  const parts=[]; let node=el
  while(node&&node.nodeType===1){
    let idx=1; let sib=node.previousSibling
    while(sib){ if(sib.nodeType===1&&sib.nodeName===node.nodeName) idx++; sib=sib.previousSibling }
    parts.unshift(node.nodeName.toLowerCase()+'['+idx+']')
    node=node.parentNode
  }
  return '/'+parts.join('/')
}

function normalizeNumericText(raw){
  const t=(raw||'').replace(/\u00A0/g,' ').trim()
  const m=t.match(/(\d{1,3}(?:[.\s]\d{3})*[.,]\d{1,2}|\d+[.,]\d{1,2}|\d+)/)
  if(!m) return {value:null,raw:t}
  const s=m[0]
  const decimalSep=s.indexOf(',')>-1?',' : (s.indexOf('.')>-1?'.':null)
  let norm=s
  if(decimalSep===',') norm=s.replace(/[.\s]/g,'').replace(',','.')
  else norm=s.replace(/[\s,]/g,'')
  const num=Number(norm)
  return {value:Number.isFinite(num)?num:null,raw:s,normalized:String(num)}
}

function makeRegexForText(raw){
  const esc=(raw||'').replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&')
  const digitPat='[\\d\\s\\.\\,]+'
  const r=esc.replace(/\d[\d\.\s,]*\d/,digitPat)
  return r.replace(/\s+/g,'\\s*')
}

function clearHighlights(){ Array.from(document.querySelectorAll('.'+HIGHLIGHT_CLS)).forEach(e=>e.classList.remove(HIGHLIGHT_CLS)) }

function highlightMatches(selector,rx){
  clearHighlights()
  let els=[]
  try{
    if(selector){ els=Array.from(document.querySelectorAll(selector)); if(rx) els=els.filter(e=>rx.test(e.textContent)) }
    else { els=Array.from(document.body.querySelectorAll('*')).filter(e=>getComputedStyle(e).display!=='none'&&rx.test(e.textContent)).slice(0,200) }
  }catch(e){ els=[] }
  els.forEach(e=>e.classList.add(HIGHLIGHT_CLS))
  return els.length
}

function showPanel(json){
  const panel=document.getElementById(PANEL_ID)
  panel.style.display='block'
  panel.textContent = JSON.stringify(json,null,2)
  try{ navigator.clipboard.writeText(JSON.stringify(json)).catch(()=>{}) }catch(e){}
}

function captureSelection(){
  const sel = window.getSelection()
  if(!sel || sel.toString().trim()==='') return {error:'no selection'}
  const text = sel.toString().trim()
  const range = sel.rangeCount? sel.getRangeAt(0) : null
  const common = range? range.commonAncestorContainer : null
  const el = common ? (common.nodeType===3? common.parentElement : common) : document.activeElement || document.body
  const parent = el.nodeType===3 ? el.parentElement : el
  const numeric = normalizeNumericText(text || (parent.textContent||''))
  const selector = uniqueSelector(parent)
  const classSelector = buildClassSelector(parent)
  const xpath = xpathFor(parent)
  const regex = makeRegexForText(numeric.raw || text)
  const rect = parent.getBoundingClientRect()
  const modalContext = findModalContext(parent)
  const elementChain = getElementChain(parent)
  const json = {
    sampleSelection: text,
    sampleTextNode: numeric.raw || null,
    numericValue: numeric.value,
    normalized: numeric.normalized,
    selector,
    classSelector,
    xpath,
    regex,
    elementChain,
    modalContext,
    boundingRect:{top:rect.top,left:rect.left,width:rect.width,height:rect.height},
    pageUrl: location.href,
    ts: (new Date()).toISOString()
  }
  return json
}

function createIndicator(){
  if(document.getElementById(INDICATOR_ID)) return
  const el=document.createElement('div'); el.id=INDICATOR_ID; el.innerHTML='AE Teach ON'; el.title='AE Teach helper active'
  el.style.userSelect='none'
  el.addEventListener('click',()=>{ const p=document.getElementById(PANEL_ID); if(p) p.style.display = p.style.display==='none' ? 'block' : 'none' })
  document.body.appendChild(el)
}

function createPanel(){
  if(document.getElementById(PANEL_ID)) return
  const panel=document.createElement('pre'); panel.id=PANEL_ID; panel.style.display='none'; document.body.appendChild(panel)
}

function createButton(){
  if(document.getElementById(BTN_ID)) return
  const b=document.createElement('button'); b.id=BTN_ID; b.textContent='Teach element'; document.body.appendChild(b)
  b.addEventListener('click',()=>{
    const result = captureSelection()
    if(result.error){ const panel=document.getElementById(PANEL_ID); panel.style.display='block'; panel.textContent = 'No selection found. Select visible element text then click the button.'; return }
    showPanel(result)
    try{ clearHighlights(); highlightMatches(result.selector, new RegExp(result.regex,'g')) }catch(e){}
  })
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ const panel=document.getElementById(PANEL_ID); if(panel) panel.style.display='none' } })
}

ensureBody(()=>{
  createIndicator()
  createPanel()
  createButton()
  GM_registerMenuCommand && GM_registerMenuCommand('Show AE Teach Panel',()=>{ const p=document.getElementById(PANEL_ID); if(p) p.style.display='block' })
})
