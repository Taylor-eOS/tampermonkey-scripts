// ==UserScript==
// @name         Text String Extractor
// @version      1.0.1
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

const INDICATOR_ID='ae_text_extractor_indicator'
const PANEL_ID='ae_text_extractor_panel'
const BTN_ID='ae_text_extractor_button'
const DOWNLOAD_BTN_ID='ae_text_extractor_download'

GM_addStyle(`
#${INDICATOR_ID}{position:fixed;left:12px;top:12px;z-index:2147483647;background:#8b5cf6;color:#fff;padding:6px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-family:Arial,sans-serif}
#${PANEL_ID}{position:fixed;left:12px;top:52px;z-index:2147483647;background:#111;color:#fff;padding:10px;border-radius:6px;width:90vw;max-width:1200px;max-height:70vh;overflow:auto;font-family:monospace;display:none}
#${BTN_ID}{position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#8b5cf6;color:#fff;padding:10px 14px;border-radius:8px;cursor:pointer;font-family:Arial,sans-serif;font-weight:600}
#${DOWNLOAD_BTN_ID}{position:fixed;right:12px;bottom:60px;z-index:2147483647;background:#10b981;color:#fff;padding:10px 14px;border-radius:8px;cursor:pointer;font-family:Arial,sans-serif;font-weight:600;display:none}
.ae_text_stats{color:#10b981;margin-bottom:10px;font-size:14px}
`)

function ensureBody(cb){ if(document.body){cb();return} new MutationObserver((m,o)=>{ if(document.body){ o.disconnect(); cb() } }).observe(document.documentElement,{childList:true}) }

function isVisible(el){
  if(!el || el.nodeType !== 1) return false;
  const style = getComputedStyle(el);
  if(style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  const rect = el.getBoundingClientRect();
  if(rect.width === 0 && rect.height === 0) return false;
  return true;
}

function extractTextStrings(){
  const strings=new Set()
  const metadata=[]
  const skipSelector=`[data-ae-text-extractor],#${INDICATOR_ID},#${PANEL_ID},#${BTN_ID},#${DOWNLOAD_BTN_ID}`
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false)
  let node
  while(node=walker.nextNode()){
    const parent=node.parentElement
    if(!parent) continue
    if(parent.closest && parent.closest(skipSelector)) continue
    if(!isVisible(parent)) continue
    const text=node.textContent.replace(/\u200B/g,'').trim()
    if(text.length===0) continue
    const tag=parent.tagName
    if(tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT') continue
    strings.add(text)
    metadata.push({
      text:text,
      length:text.length,
      tag:tag.toLowerCase(),
      classes:parent.className?Array.from(parent.classList):[],
      id:parent.id||null,
      isNumeric:/^\d[\d\s\.\,]*\d?$/.test(text),
      hasLetters:/[a-zA-Z]/.test(text),
      hasDigits:/\d/.test(text),
      wordCount:text.split(/\s+/).filter(Boolean).length
    })
  }
  return {
    uniqueStrings:Array.from(strings).sort(),
    metadata:metadata,
    stats:{
      totalStrings:metadata.length,
      uniqueStrings:strings.size,
      pageUrl:location.href,
      pageTitle:document.title,
      timestamp:new Date().toISOString()
    }
  }
}

function downloadJSON(data,filename){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a')
  a.href=url
  a.download=filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function showPanel(data){
  const panel=document.getElementById(PANEL_ID)
  const downloadBtn=document.getElementById(DOWNLOAD_BTN_ID)
  panel.style.display='block'
  downloadBtn.style.display='block'
  const statsHTML=`<div class="ae_text_stats">Extracted ${data.stats.totalStrings} strings (${data.stats.uniqueStrings} unique)</div>`
  panel.innerHTML=statsHTML+'<div>'+JSON.stringify(data,null,2)+'</div>'
  try{ navigator.clipboard.writeText(JSON.stringify(data)).catch(()=>{}) }catch(e){}
  downloadBtn.onclick=()=>{
    const domain=new URL(location.href).hostname.replace(/[^a-z0-9]/gi,'_')
    const timestamp=new Date().toISOString().split('T')[0]
    downloadJSON(data,`text_strings_${domain}_${timestamp}.json`)
  }
}

function createIndicator(){
  if(document.getElementById(INDICATOR_ID)) return
  const el=document.createElement('div')
  el.id=INDICATOR_ID
  el.setAttribute('data-ae-text-extractor','1')
  el.innerHTML='Text Extractor'
  el.title='Text extractor active'
  el.style.userSelect='none'
  el.addEventListener('click',()=>{
    const p=document.getElementById(PANEL_ID)
    const d=document.getElementById(DOWNLOAD_BTN_ID)
    if(p){
      const newDisplay=p.style.display==='none'?'block':'none'
      p.style.display=newDisplay
      d.style.display=newDisplay
    }
  })
  document.body.appendChild(el)
}

function createPanel(){
  if(document.getElementById(PANEL_ID)) return
  const panel=document.createElement('pre')
  panel.id=PANEL_ID
  panel.setAttribute('data-ae-text-extractor','1')
  panel.style.display='none'
  document.body.appendChild(panel)
}

function createDownloadButton(){
  if(document.getElementById(DOWNLOAD_BTN_ID)) return
  const b=document.createElement('button')
  b.id=DOWNLOAD_BTN_ID
  b.setAttribute('data-ae-text-extractor','1')
  b.textContent='Download JSON'
  b.style.display='none'
  document.body.appendChild(b)
}

function createButton(){
  if(document.getElementById(BTN_ID)) return
  const b=document.createElement('button')
  b.id=BTN_ID
  b.setAttribute('data-ae-text-extractor','1')
  b.textContent='Extract Text'
  document.body.appendChild(b)
  b.addEventListener('click',()=>{
    const data=extractTextStrings()
    showPanel(data)
  })
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      const panel=document.getElementById(PANEL_ID)
      const downloadBtn=document.getElementById(DOWNLOAD_BTN_ID)
      if(panel) panel.style.display='none'
      if(downloadBtn) downloadBtn.style.display='none'
    }
  })
}

ensureBody(()=>{
  createIndicator()
  createPanel()
  createDownloadButton()
  createButton()
  GM_registerMenuCommand&&GM_registerMenuCommand('Extract Text Strings',()=>{
    const data=extractTextStrings()
    showPanel(data)
  })
})

