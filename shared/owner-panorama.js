/* Selected "Panorama and arguments" component, shared by owner routes. */
(function () {
  'use strict';
  const script = document.currentScript;
  const direction = script.dataset.direction === 'rent' ? 'rent' : 'sale';
  const image = new URL('assets/barnes-private-salon.webp', script.src).href;
  const reasons = [
    { title: 'Доступ к аудитории', headline: 'Ваш объект — в поле внимания подходящей аудитории', text: 'Используем клиентскую базу, профессиональные связи и сообщество BARNES, чтобы представить недвижимость людям с подходящим запросом.', evidence: 'Клиентская база · Партнёрская сеть · BARNES Club' },
    { title: 'Собственные медиа', headline: 'Сильная подача в собственной медиасреде', text: 'Представляем недвижимость в контексте архитектуры, окружения и образа жизни. Подбираем каналы BARNES под особенности объекта.', evidence: 'Журнал BARNES · Цифровые обзоры · Мероприятия' },
    { title: 'Экспертиза сегмента', headline: 'Понимание рынка, на котором важны детали', text: 'Специализируемся на премиальной недвижимости. Анализ рынка и особенностей объекта помогает обосновать его позиционирование и вести переговоры.', evidence: 'Аналитика рынка · Позиционирование · Переговоры' },
    { title: 'Между­народная сеть', headline: 'Возможности BARNES за пределами одного рынка', text: 'Работаем с международными запросами через зарубежные офисы и партнёров, когда это соответствует объекту и вашим целям.', evidence: 'Международная сеть офисов и партнёров' }
  ];
  const content = reason => '<div class="be-argument-heading"><h3>' + reason.headline + '</h3></div><div><p class="be-body">' + reason.text + '</p><p class="be-evidence">' + reason.evidence + '</p></div>';
  const arrow = '<svg viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"/></svg>';

  function mount() {
    // Nuxt must finish mounting before inserting a sibling into its SSR tree.
    if (direction === 'rent') {
      const nuxt = document.querySelector('#__nuxt')?.__vue_app__?.$nuxt;
      if (!nuxt || nuxt.isHydrating) return false;
    }
    const page = document.querySelector('.owner-sale-page');
    const path = page?.querySelector(direction === 'rent' ? '.owner-sale-exclusive' : '.owner-sale-stages');
    if (!path) return false;
    if (page.querySelector('#why-barnes')) return true;
    const root = document.createElement('section');
    root.id = 'why-barnes';
    root.dataset.direction = direction;
    root.setAttribute('aria-labelledby', 'panorama-title');
    root.innerHTML = '<div class="be-stage"><div class="be-section"><p class="be-eyebrow">ДЛЯ СОБСТВЕННИКОВ</p><header class="be-panorama-header"><h2 id="panorama-title">ПОЧЕМУ СОБСТВЕННИКИ ВЫБИРАЮТ BARNES</h2></header><img class="be-panorama-image" src="' + image + '" alt="Светлое пространство для личных встреч, архитектурный образ BARNES" width="1536" height="1024" loading="lazy"><div class="be-tabs" role="tablist" aria-label="Возможности BARNES">' + reasons.map((reason, index) => '<button type="button" id="panorama-tab-' + index + '" role="tab" aria-selected="' + (index === 0) + '" aria-controls="panorama-panel" tabindex="' + (index === 0 ? 0 : -1) + '" data-reason="' + index + '"><span class="be-number">' + String(index + 1).padStart(2, '0') + '</span>' + reason.title + '</button>').join('') + '</div><div class="be-tab-panel" id="panorama-panel" role="tabpanel" tabindex="0" aria-labelledby="panorama-tab-0">' + content(reasons[0]) + '</div><div class="be-panorama-footer"><button type="button" class="be-cta">' + (direction === 'rent' ? 'Обсудить сдачу объекта' : 'Обсудить стратегию продажи') + arrow + '</button></div></div></div>';
    path.after(root);
    const section = root.querySelector('.be-section');
    const panel = root.querySelector('.be-tab-panel');
    panel.querySelector('.be-argument-heading').appendChild(root.querySelector('.be-panorama-footer'));
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    let active = 0;

    function measure() {
      // Measure only the four panels, without cloning interactive elements or IDs.
      const probe = document.createElement('div');
      probe.className = 'be-tab-panel';
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:0;left:0;min-height:0;width:' + panel.getBoundingClientRect().width + 'px';
      section.appendChild(probe);
      let height = 0;
      reasons.forEach(reason => {
        probe.innerHTML = content(reason);
        const footer = document.createElement('div');
        footer.className = 'be-panorama-footer';
        const actionPreview = document.createElement('span');
        actionPreview.className = 'be-cta';
        actionPreview.innerHTML = root.querySelector('.be-cta').innerHTML;
        footer.appendChild(actionPreview);
        probe.querySelector('.be-argument-heading').appendChild(footer);
        height = Math.max(height, probe.getBoundingClientRect().height);
      });
      probe.remove();
      root.style.setProperty('--be-panel-height', Math.ceil(height) + 'px');
    }
    function select(index) {
      active = index;
      panel.querySelector('h3').textContent = reasons[active].headline;
      panel.querySelector('.be-body').textContent = reasons[active].text;
      panel.querySelector('.be-evidence').textContent = reasons[active].evidence;
      panel.setAttribute('aria-labelledby', tabs[active].id);
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === active));
        tab.tabIndex = i === active ? 0 : -1;
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        const keys = { ArrowRight: (index + 1) % 4, ArrowLeft: (index + 3) % 4, Home: 0, End: 3 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        select(keys[event.key]);
        tabs[active].focus();
      });
    });
    const action = root.querySelector('.be-cta');
    let modal = null;
    action.addEventListener('click', () => {
      root.dispatchEvent(new CustomEvent('barnes:owner-request', { bubbles: true, detail: { direction, source: 'why-barnes-panorama' } }));
      page.querySelector('.owner-sale-hero__button')?.click();
      requestAnimationFrame(() => {
        modal = document.querySelector('.feedback-modal');
        if (!modal) return;
        modal.dataset.requestDirection = direction;
        modal.dataset.requestSource = 'why-barnes-panorama';
        modal.querySelector('.feedback-modal__input')?.focus();
      });
    });
    new MutationObserver(() => {
      if (!modal || (modal.isConnected && !modal.hidden && getComputedStyle(modal).display !== 'none')) return;
      modal = null;
      action.focus({ preventScroll: true });
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
    let width = 0;
    new ResizeObserver(() => {
      const next = section.getBoundingClientRect().width;
      if (next === width) return;
      width = next;
      measure();
    }).observe(section);
    measure();
    document.fonts.ready.then(() => {
      measure();
      if (location.hash === '#why-barnes') root.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    document.fonts.addEventListener('loadingdone', measure);
    return true;
  }
  if (!mount()) {
    const ready = setInterval(() => { if (mount()) clearInterval(ready); }, 100);
    window.addEventListener('pagehide', () => clearInterval(ready), { once: true });
  }
})();
