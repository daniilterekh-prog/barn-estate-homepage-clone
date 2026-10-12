/* Autonomous desktop/mobile bootstrap. No Nuxt runtime or remote render resources. */
(function(){
  function load(file){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='js/'+file;s.onload=resolve;s.onerror=reject;document.body.append(s)})}
  function nativeControls(){
    const toggle=document.querySelector('.site-header__icon-btn');
    let menu=null,overflow='';
    function closeMenu(){
      if(!menu)return;menu.remove();menu=null;document.body.style.overflow=overflow;
      toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');toggle.focus();
    }
    toggle?.addEventListener('click',()=>{
      if(menu){closeMenu();return;}
      const t=document.createElement('template');t.innerHTML=window.BarnesCityMenuTemplate;
      menu=t.content.firstElementChild;menu.setAttribute('role','dialog');menu.setAttribute('aria-label','Навигация');
      document.body.append(menu);overflow=document.body.style.overflow;document.body.style.overflow='hidden';
      toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Закрыть меню');
    });
    document.addEventListener('keydown',event=>{if(menu&&event.key==='Escape'){event.preventDefault();closeMenu()}});
    document.querySelector('.catalog-intro__toggle')?.addEventListener('click',()=>{
      const intro=document.querySelector('.catalog-intro');
      const expanded=intro.classList.toggle('catalog-intro--expanded');
      const text=intro.querySelector('.catalog-intro__text');
      if(text)text.style.display=expanded?'block':'';
      const button=intro.querySelector('.catalog-intro__toggle');button.setAttribute('aria-expanded',String(expanded));
      const label=button.querySelector('.ui-more-link__label');if(label)label.textContent=expanded?'Свернуть':'Читать далее';
    });
    document.querySelectorAll('.catalog-faq__question').forEach(button=>{
      button.addEventListener('click',()=>{
        const item=button.closest('.catalog-faq__item'),open=button.getAttribute('aria-expanded')!=='true';
        button.setAttribute('aria-expanded',String(open));item.classList.toggle('catalog-faq__item--open',open);
        const answer=item.querySelector('.catalog-faq__answer');if(answer)answer.style.height=open?answer.scrollHeight+'px':'';
      });
    });
    document.querySelector('.floating-expert__close')?.addEventListener('click',()=>document.querySelector('.floating-expert').hidden=true);
    document.querySelector('.catalog-hero-filters__bar')?.addEventListener('submit',event=>{
      event.preventDefault();const query=document.querySelector('.catalog-hero-filters__search-input').value.trim().toLocaleLowerCase('ru');
      document.querySelectorAll('.catalog-grid__item').forEach(item=>{if(query&&!item.textContent.toLocaleLowerCase('ru').includes(query))item.hidden=true});
      document.querySelector('.catalog-grid')?.scrollIntoView({behavior:'smooth'});
    });
    document.querySelectorAll('.catalog-consultation__form,.catalog-contact__form').forEach(form=>{
      const methods=form.closest('section')?.querySelectorAll('.catalog-consultation__method,.catalog-contact__method')||[];
      methods.forEach(button=>button.addEventListener('click',()=>{
        methods.forEach(item=>{item.setAttribute('aria-pressed',String(item===button));item.classList.toggle('is-active',item===button);item.classList.toggle('catalog-consultation__method--active',item===button);item.classList.toggle('catalog-contact__method--active',item===button)});
      }));
      form.addEventListener('submit',event=>{
        event.preventDefault();if(!form.reportValidity())return;
        let status=form.querySelector('[role=status]');
        if(!status){status=document.createElement('p');status.setAttribute('role','status');form.append(status)}
        status.textContent='Демонстрационная форма: заявка не отправлена. Для связи используй телефон или мессенджер.';
      });
    });
  }
  async function start(){
    await load('menu-template.js');await load('node-reference.js');await load('node-modal.js');await load('news-slider.js');nativeControls();
    document.dispatchEvent(new CustomEvent('barnes:node-ready'));
  }
  if(matchMedia('(max-width:540px)').matches&&!document.documentElement.dataset.cityMobile){
    fetch('mobile.html').then(r=>{if(!r.ok)throw Error('mobile snapshot');return r.text()}).then(html=>{
      document.open();document.write(html);document.close();
    }).catch(start);
  }else start();
}());
