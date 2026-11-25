/* Keep the first two infrastructure paragraphs visible; disclose the rest. */
(()=>{
  'use strict';
  const section=document.querySelector('#territory');
  const text=section?.querySelector('.infrastructure-text');
  const button=section?.querySelector('.infrastructure-toggle');
  if(!text||!button)return;
  let expanded=false,more;
  const observer=new MutationObserver(render);
  function normalizePlainParagraphs(){
    const nodes=Array.from(text.childNodes);
    if(nodes.some(n=>n.nodeType===1&&n.nodeName!=='BR'))return;
    const value=nodes.map(n=>n.nodeName==='BR'?'\n':n.textContent).join('');
    const paragraphs=value.split(/\n+/).map(s=>s.trim()).filter(Boolean);
    if(paragraphs.length<2)return;
    text.replaceChildren(...paragraphs.map(value=>{
      const p=document.createElement('p');p.textContent=value;return p;
    }));
  }
  function render(){
    observer.disconnect();
    const existing=Array.from(text.children).find(e=>e.classList.contains('infrastructure-more'));
    if(existing)existing.replaceWith(...existing.childNodes);
    normalizePlainParagraphs();
    const paragraphs=Array.from(text.children).filter(e=>e.tagName==='P');
    paragraphs.filter(p=>!p.textContent.trim()).forEach(p=>p.remove());
    const filled=paragraphs.filter(p=>p.textContent.trim());
    more=document.createElement('div');more.className='infrastructure-more';more.id='project-infrastructure-more';
    const hasMore=filled.length>2;
    if(hasMore){
      const nodes=Array.from(text.childNodes),start=nodes.indexOf(filled[2]);
      more.append(...nodes.slice(start));
    }else expanded=false;
    more.hidden=!hasMore||!expanded;text.append(more);
    button.hidden=!hasMore;button.textContent=expanded?'Свернуть':'Читать далее';
    button.setAttribute('aria-expanded',String(expanded));
    section.dataset.infrastructureParagraphs=String(filled.length);
    observer.observe(text,{childList:true,subtree:true,characterData:true});
  }
  button.addEventListener('click',()=>{
    expanded=!expanded;more.hidden=!expanded;
    button.textContent=expanded?'Свернуть':'Читать далее';button.setAttribute('aria-expanded',String(expanded));
    if(!expanded)requestAnimationFrame(()=>{
      const bounds=button.getBoundingClientRect();
      if(bounds.top<110||bounds.bottom>innerHeight-90)button.scrollIntoView({block:'nearest',behavior:'instant'});
    });
  });
  render();section.dataset.infrastructureReady='true';
})();
