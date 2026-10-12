(function () {
  'use strict';
  if (document.querySelector('.resort-quick-dropdown')) return;
  var base = new URL('../', document.currentScript.src);
  var stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('css/quick-filters.css?v=4', base).href;
  document.head.appendChild(stylesheet);
  var configs = window.BarnesQuickConfig || [
    { title:'Локация', key:'directions', reset:'Все направления', choices:['Сочи','Анапа','Алтай','Архыз'] },
    { title:'Тип', key:'propertyTypes', reset:'Любой тип', choices:['Апартаменты','Квартира','Квартира в новостройке','Пентхаус'], values:['apartment','flat','new_build','penthouse'] },
    { title:'Стоимость', key:'priceRanges', reset:'Любая', choices:['до 50 млн ₽','50 – 100 млн ₽','100 – 200 млн ₽','от 200 млн ₽'], values:['50m','50-100m','100-200m','200m+'] },
    { title:'Спальни', key:'bedrooms', reset:'Любые', choices:['1','2','3','Более 3'], values:['1','2','3','4+'] }
  ];
  var popup = document.createElement('div');
  popup.className = 'catalog-quick-filters__dropdown resort-quick-dropdown';
  popup.setAttribute('data-v-6fd45cc6','');
  popup.id = 'resort-quick-dropdown';
  popup.setAttribute('role','dialog');
  popup.hidden = true;
  popup.style.display = 'none';
  popup.innerHTML = '<div class="catalog-quick-filters__dropdown-header"><span></span><button type="button" class="catalog-quick-filters__dropdown-close" aria-label="Закрыть">×</button></div><div class="catalog-quick-filters__options" role="listbox"></div>';
  document.body.appendChild(popup);
  popup.querySelectorAll('*').forEach(el=>el.setAttribute('data-v-6fd45cc6',''));
  var list = popup.querySelector('.catalog-quick-filters__options');
  var activeButton = null;
  var savedPopupInert = false;
  var selectConfigs = new Map();
  // Map parameters use the same configuration, options and state as the listing.
  configs.forEach(function (config, index) {
    var field = document.querySelector('.map-browser [data-filter="' + ['type','price','area','district'][index] + '"]');
    if (!field) return;
    field.hidden = true;
    field.setAttribute('aria-hidden','true');
    field.tabIndex = -1;
    field.dataset.sharedMapQuick = 'true';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'resort-select-trigger commercial-map-quick';
    button.dataset.quickIndex = index;
    button.innerHTML = '<span class="catalog-quick-filters__caption"></span>';
    field.before(button);
    var parent = field.closest('label');
    parent.classList.add('map-browser__field--select');
    if (!parent.querySelector('.map-browser__chevron')) {
      var chevron = document.createElement('span');
      chevron.className = 'map-browser__chevron';
      chevron.setAttribute('aria-hidden','true');
      parent.appendChild(chevron);
    }
  });
  function mountSelectDropdowns() {
    document.querySelectorAll('.catalog-mode-toolbar .catalog-grid__sort select, .map-browser select[data-filter]').forEach(function (select) {
      if (select.dataset.customDropdownReady || select.dataset.sharedMapQuick) return;
      select.dataset.customDropdownReady = 'true';
      var button = document.createElement('button');
      button.type = 'button';
      var sorting = select.matches('.catalog-grid__sort-select, [data-filter="sort"]');
      var title = sorting ? 'Сортировка' : select.getAttribute('aria-label');
      button.className = select.className + (sorting ? ' resort-sort-trigger' : ' resort-select-trigger');
      Array.from(select.attributes).filter(function (a) { return a.name.startsWith('data-v-'); }).forEach(function (a) { button.setAttribute(a.name, a.value); });
      button.setAttribute('aria-haspopup','dialog');
      button.setAttribute('aria-controls',popup.id);
      button.setAttribute('aria-expanded','false');
      select.before(button);
      select.hidden = true;
      select.setAttribute('aria-hidden','true');
      select.tabIndex = -1;
      var options = Array.from(select.options);
      selectConfigs.set(button, { title:title, select:select, choices:options.map(function (o) { return o.textContent; }), values:options.map(function (o) { return o.value; }) });
      function sync() {
        button.textContent = select.selectedOptions[0].textContent;
        button.setAttribute('aria-label',title + ': ' + button.textContent);
      }
      select.addEventListener('input',sync);
      select.addEventListener('change',sync);
      sync();
    });
    if (selectConfigs.size === 5 && selectObserver) selectObserver.disconnect();
  }
  var selectObserver = new MutationObserver(mountSelectDropdowns);
  selectObserver.observe(document.body, { childList:true, subtree:true });
  mountSelectDropdowns();
  function buttons() { return Array.from(document.querySelectorAll('.catalog-mode-filters .catalog-quick-filters__button')); }
  function state() { return window.BarnesFilters ? window.BarnesFilters.getState() : {}; }
  function selection(config, value) {
    if (config.select) return [config.select.value];
    var current = value[config.key];
    return config.key === 'bedrooms' ? (current ? [current] : []) : current || [];
  }
  function update() {
    var value = state();
    buttons().concat(Array.from(document.querySelectorAll('.commercial-map-quick'))).forEach(function (button, index) {
      var config = configs[button.dataset.quickIndex === undefined ? index : Number(button.dataset.quickIndex)];
      if (!config) return;
      var selected = selection(config,value);
      if(config.range){const min=value[config.range.min]||'',max=value[config.range.max]||'';const caption=button.querySelector('.catalog-quick-filters__caption');caption.textContent=min||max?`${min?'от '+min:''}${min&&max?' ':''}${max?'до '+max:''} ${config.range.unit}`:config.title;button.setAttribute('aria-label',config.title+': '+caption.textContent);button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',popup.id);button.classList.toggle('is-active',!!(min||max));return;}
      var labels = selected.map(function (v) {
        var i = (config.values || config.choices).indexOf(v);
        return i >= 0 ? config.choices[i] : v;
      });
      var caption = button.querySelector('.catalog-quick-filters__caption');
      caption.dataset.quickCaption = '';
      caption.textContent = labels.length === 1 ? labels[0] : labels.length > 1 ? config.title + ': ' + labels.length : config.title;
      button.classList.toggle('is-active',!!selected.length);
      button.title = config.title + ': ' + (labels.join(', ') || config.reset);
      button.setAttribute('aria-label',button.title);
      button.setAttribute('aria-haspopup','dialog');
      button.setAttribute('aria-controls',popup.id);
    });
  }
  function close(focus) {
    if (!activeButton) return;
    var previous = activeButton;
    previous.classList.remove('is-open');
    previous.setAttribute('aria-expanded','false');
    activeButton = null;
    popup.hidden = true;
    popup.style.display = 'none';
    popup.inert = savedPopupInert;
    if (focus) previous.focus({preventScroll:true});
  }
  function place() {
    if (!activeButton) return;
    var rect = activeButton.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var width = Math.min(Math.max(rect.width,220),vw-32);
    popup.style.width = width + 'px';
    popup.style.left = Math.max(16,Math.min(rect.left,vw-width-16)) + 'px';
    list.style.maxHeight = '240px';
    var height = popup.getBoundingClientRect().height;
    var availableBelow = window.innerHeight-rect.bottom-16;
    var above = rect.top-16;
    var top = rect.bottom+6;
    if (height > availableBelow && above > availableBelow) top = rect.top-6-height;
    top = Math.max(16,Math.min(top,window.innerHeight-height-16));
    popup.style.top = top + 'px';
    list.style.maxHeight = Math.max(48,Math.min(240,window.innerHeight-top-80)) + 'px';
  }
  function open(button,index) {
    if (!window.BarnesFilters) return;
    if (button === activeButton) { close(true); return; }
    close(false);
    var config = typeof index === 'number' ? configs[index] : index;
    if (!config) return;
    activeButton = button;
    savedPopupInert = popup.inert;
    popup.inert = false; // The map isolates page siblings; this shared popup belongs to its active control.
    button.classList.add('is-open');
    button.setAttribute('aria-expanded','true');
    popup.setAttribute('aria-label',config.title);
    popup.querySelector('.catalog-quick-filters__dropdown-header > span').textContent = config.title;
    list.setAttribute('aria-label',config.title);
    list.replaceChildren();
    list.setAttribute('role',config.range?'group':'listbox');
    if(config.range){
      const current=state();
      for(const [key,label] of [[config.range.min,'Площадь от, м²'],[config.range.max,'Площадь до, м²']]){const input=document.createElement('input');input.type='number';input.min='0';input.name=key;input.value=current[key]||'';input.placeholder=label;input.setAttribute('aria-label',label);input.className='commercial-quick-range';list.append(input);}
      const apply=document.createElement('button');apply.type='button';apply.textContent='Применить';apply.className='catalog-quick-filters__option';
      apply.addEventListener('click',()=>{const inputs=[...list.querySelectorAll('input')];if(inputs.some(input=>!input.reportValidity()))return;if(inputs[0].value&&inputs[1].value&&+inputs[0].value>+inputs[1].value){inputs[0].setCustomValidity('Значение «от» не должно превышать «до»');inputs[0].reportValidity();inputs[0].oninput=()=>inputs[0].setCustomValidity('');return;}window.BarnesFilters.patch(Object.fromEntries(inputs.map(input=>[input.name,input.value])));close(true);});list.append(apply);
      popup.hidden=false;popup.style.display='block';place();list.firstElementChild.focus({preventScroll:true});return;
    }
    var selected = selection(config,state());
    (config.select ? config.choices : [config.reset].concat(config.choices)).forEach(function (label,index) {
      var value = config.select ? config.values[index] : index ? (config.values || config.choices)[index-1] : '';
      var option = document.createElement('button');
      option.type = 'button';
      option.className = 'catalog-quick-filters__option';
      option.setAttribute('data-v-6fd45cc6','');
      option.setAttribute('role','option');
      option.setAttribute('aria-label',label);
      var checked = config.select ? selected.includes(value) : value ? selected.includes(value) : !selected.length;
      option.setAttribute('aria-selected',String(checked));
      option.classList.toggle('is-selected',checked);
      option.textContent = label;
      option.addEventListener('click',function () {
        if (config.select) {
          config.select.value = value;
          config.select.dispatchEvent(new Event('input',{bubbles:true}));
          config.select.dispatchEvent(new Event('change',{bubbles:true}));
          close(true);
          return;
        }
        var fields = {};
        fields[config.key] = config.key === 'bedrooms' ? value : value ? [value] : [];
        if (config.key === 'priceRanges') { fields.priceMin = ''; fields.priceMax = ''; }
        window.BarnesFilters.patch(fields);
        close(true);
      });
      list.appendChild(option);
    });
    popup.hidden = false;
    popup.style.display = 'block';
    place();
    (list.querySelector('[aria-selected=true]') || list.firstElementChild).focus({preventScroll:true});
  }
  popup.querySelector('.catalog-quick-filters__dropdown-close').addEventListener('click',function () { close(true); });
  document.addEventListener('click',function (event) {
    var mapButton = event.target.closest('.commercial-map-quick');
    if (mapButton) { event.preventDefault(); update(); open(mapButton,Number(mapButton.dataset.quickIndex)); return; }
    var sortButton = event.target.closest('.resort-sort-trigger, .resort-select-trigger');
    if (sortButton) { event.preventDefault(); open(sortButton,selectConfigs.get(sortButton)); return; }
    var button = event.target.closest('.catalog-mode-filters .catalog-quick-filters__button');
    if (button) { event.preventDefault(); update(); open(button,buttons().indexOf(button)); }
    else if (!popup.contains(event.target)) close(false);
  });
  popup.addEventListener('keydown',function (event) {
    var options = Array.from(list.children);
    var index = options.indexOf(document.activeElement);
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); }
    if (event.key === 'Tab') { event.preventDefault(); event.stopPropagation(); close(true); }
    if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      var next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length-1 : (index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;
      options[next].focus();
    }
  });
  document.addEventListener('focusin',function (event) {
    if (activeButton && !popup.contains(event.target) && event.target!==activeButton) close(false);
  });
  document.addEventListener('scroll',function (event) {
    if (!activeButton || popup.contains(event.target)) return;
    var rect = activeButton.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) close(false);
    else place();
  },true);
  window.addEventListener('resize',function () { close(false); });
  document.addEventListener('barnes:filters-apply',update);
  document.addEventListener('barnes:filters-apply',function () {
    selectConfigs.forEach(function (config,button) { button.textContent = config.select.selectedOptions[0].textContent; button.setAttribute('aria-label',config.title + ': ' + button.textContent); });
  });
  document.addEventListener('barnes:filters-open',function () { close(false); });
  update();
}());
