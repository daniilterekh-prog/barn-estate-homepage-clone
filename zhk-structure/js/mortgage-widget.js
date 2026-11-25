/* Official free Calcus embed. Keep its visible attribution and calculation engine. */
(()=>{
  'use strict';
  const root=document.querySelector('#calcus-container');
  const status=document.querySelector('#mortgage-status');
  const retry=document.querySelector('#mortgage-retry');
  let loaded=false,timer;
  window.addEventListener('message',event=>{
    if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='barn-mortgage-theme')return;
    const width=event.data.width;if(!Number.isFinite(width)||width<=0)return;
    document.documentElement.style.setProperty('--mortgage-button-height',width<=540?'58px':'70px');
    document.documentElement.style.setProperty('--mortgage-button-size',width<=540?'18px':width>1440?'19px':'17px');
  });
  const height=()=>parent.postMessage({type:'barn-mortgage-height',height:document.body.getBoundingClientRect().height+8},location.origin);
  new ResizeObserver(height).observe(document.body);
  function fail(){
    clearTimeout(timer);root.setAttribute('aria-busy','false');
    status.hidden=false;status.textContent='Калькулятор временно недоступен. Попробуйте ещё раз или обратитесь к эксперту.';
    retry.hidden=false;height();
  }
  function enhance(form){
    clearTimeout(timer);loaded=true;status.hidden=true;root.setAttribute('aria-busy','false');
    const labels={creditSum:'Стоимость недвижимости',startSum:'Первоначальный взнос',period:'Срок кредита',percent:'Годовая процентная ставка'};
    for(const [name,label] of Object.entries(labels)){
      const input=form.elements.namedItem(name);if(!input)continue;
      input.id='mortgage-'+name;input.setAttribute('aria-label',label);input.required=true;
      if(name==='creditSum'||name==='percent')input.placeholder=name==='creditSum'?'Введите стоимость':'Введите ставку';
    }
    form.elements.namedItem('startSumType')?.setAttribute('aria-label','Единица первоначального взноса');
    form.elements.namedItem('periodType')?.setAttribute('aria-label','Единица срока кредита');
    const placeholder=document.createElement('div');placeholder.className='mortgage-result-placeholder';
    placeholder.innerHTML='<p>Ваш ежемесячный платёж</p><span>Укажите стоимость и ставку — результат появится после расчёта.</span>';
    form.append(placeholder);
    const result=form.querySelector('#calc-result-monthlyPayment');
    const sync=()=>{
      const shown=!!result&&getComputedStyle(result).display!=='none'&&!!result.querySelector('.calc-fright')?.textContent.trim();
      placeholder.hidden=shown;form.classList.toggle('has-mortgage-result',shown);height();
    };
    if(result){result.setAttribute('aria-live','polite');new MutationObserver(sync).observe(result,{attributes:true,childList:true,subtree:true});}
    form.addEventListener('submit',event=>{
      const amount=name=>Number(String(form.elements.namedItem(name)?.value||'').replace(/[\s\u00a0]/g,'').replace(',','.'));
      const fields=['creditSum','startSum','period','percent'];
      fields.forEach(name=>{const input=form.elements.namedItem(name);input.setAttribute('aria-invalid','false');input.removeAttribute('aria-describedby');});
      let invalid=fields.find(name=>!form.elements.namedItem(name).value.trim()||!Number.isFinite(amount(name)));
      if(!invalid&&amount('creditSum')<=0)invalid='creditSum';
      const downLimit=form.elements.namedItem('startSumType').value==='2'?100:amount('creditSum');
      if(!invalid&&(amount('startSum')<0||amount('startSum')>=downLimit))invalid='startSum';
      if(!invalid&&(!form.elements.namedItem('period').checkValidity()||amount('period')<1))invalid='period';
      if(!invalid&&amount('percent')<0)invalid='percent';
      if(invalid){
        event.preventDefault();event.stopImmediatePropagation();
        const input=form.elements.namedItem(invalid);input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby','mortgage-status');
        status.hidden=false;status.textContent=invalid==='startSum'?'Первоначальный взнос должен быть меньше стоимости недвижимости.':'Проверьте поле «'+labels[invalid]+'».';
        input.focus();height();return;
      }
      status.hidden=true;height();
    },{capture:true});sync();
  }
  const observer=new MutationObserver(()=>{const form=root.querySelector('.calc-form');if(form&&!loaded){observer.disconnect();enhance(form);}});
  observer.observe(root,{childList:true,subtree:true});
  function load(){
    retry.hidden=true;status.hidden=false;status.textContent='Загружаем калькулятор…';root.setAttribute('aria-busy','true');
    // The provider's extra styles/chart scripts use root-relative URLs.
    // Our own deferred script and stylesheet have already loaded from this site.
    if(!document.querySelector('base')){const base=document.createElement('base');base.href='https://calcus.ru/';document.head.append(base);}
    const show=()=>{
      window.CalcusWidget.show('Mortgage',{
        currency:'RUB',defaults:{startSumType:'2',startSum:30,period:20,periodType:'Y',paymentType:'1'},
        hideFields:['paymentType','payStart']
      });
    };
    timer=setTimeout(fail,20000);
    if(window.CalcusWidget){show();return;}
    const script=document.createElement('script');script.src='https://calcus.ru/dist/widget.js';script.onload=show;script.onerror=fail;document.head.append(script);
  }
  retry.addEventListener('click',load);
  document.fonts.ready.then(height);load();
})();
