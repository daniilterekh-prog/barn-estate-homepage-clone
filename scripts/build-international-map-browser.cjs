/* Reuse the resort map browser, but never its object data or geographic preview. */
const fs = require('node:fs/promises');
(async () => {
  const target = 'mezhdunarodnaya-nedvizhimost';
  const drawer = await fs.readFile(target + '/map-filters-template.html', 'utf8');
  let code = await fs.readFile('kurortnaya/map-fullscreen.js', 'utf8');
  code = code.replace("if (!trigger || !source || document.querySelector('.map-browser')) return;", "if (!trigger || !source || document.querySelector('.map-browser')) return;\n  source.dataset.nodeMapBrowser = 'true';");
  code = code.replace("source.dataset.nodeMapBrowser = 'true';", "source.dataset.nodeMapBrowser = 'true';\n  var filterTemplate=document.createElement('template');filterTemplate.id='source-map-filters';filterTemplate.innerHTML="+JSON.stringify(drawer)+";document.body.appendChild(filterTemplate);");
  code = code.replace("new URL('map-fullscreen.css?v=2', assetsBase)", "new URL('node-map-browser.css?v=20261012-map-drawer-1', assetsBase)");
  code = code.replace("new URL('map-preview.png', assetsBase)", "new URL('assets/map-browser-preview.png', assetsBase)");
  code = code.replace('var items = window.BarnesMapProjects || [];', `var cardElements = Array.from(document.querySelectorAll('.catalog-grid__item'));
  var items = cardElements.map(function (element) {
    var name = element.querySelector('.apartment-card__name-text');
    var photo = element.querySelector('.apartment-card__image');
    var link = element.querySelector('.apartment-card__media-link');
    var price = element.querySelector('.apartment-card__price').textContent.trim();
    return { name: name.textContent.trim(), href: link.href, image: photo ? photo.src : null, price: price,
      type: element.dataset.listingMode === 'new-build' ? 'rc' : 'lot',
      priceRub: /₽/.test(price) ? Number(price.replace(/[^\\d]/g, '')) || null : null };
  });
  var applied = null;
  window.addEventListener('international-filters-applied', function () {
    applied = cardElements.map(function (element) { return !element.hidden; });
    render();
  });`);
  code = code.replace("element !== dialog && !['SCRIPT'", "element !== dialog && !element.classList.contains('hero-filter-modal') && !['SCRIPT'");
  code = code.replace("var result = items.filter(function (item) {", "var result = items.filter(function (item, index) {\n      if (applied && !applied[index]) return false;");
  code = code.replace('image.src = item.image;', 'if (item.image) image.src = item.image;');
  code = code.replace('link.append(image, heading);', 'if (item.image) link.append(image);\n      link.append(heading);');
  code = code.replace("trigger.addEventListener('click', function () {", "window.BARNES_OPEN_MAP = function () {\n    if (!dialog.hidden) return;");
  code = code.replace("dialog.querySelector('.map-browser__close').focus();\n  });", "dialog.querySelector('.map-browser__close').focus();\n  };\n  trigger.addEventListener('click', window.BARNES_OPEN_MAP);");
  code = code.replace("var extra = dialog.querySelector('.map-browser__extra');\n    extra.hidden = !extra.hidden;\n    event.currentTarget.setAttribute('aria-expanded', String(!extra.hidden));\n    expand(true);", "window.BARNES_OPEN_FILTER(event.currentTarget);\n    expand(true);");
  code = code.replace("[query, type, price, sort].forEach(function (input) { input.value = ''; });", "applied = null;\n    [query, type, price, sort].forEach(function (input) { input.value = ''; });");
  code = code.replace('if (dialog.hidden) return;\n    if (event.key', "if (dialog.hidden || event.defaultPrevented || document.querySelector('.hero-filter-modal')) return;\n    if (event.key");
  await fs.writeFile(target + '/node-map-browser.css', await fs.readFile('kurortnaya/map-fullscreen.css', 'utf8'));
  await fs.writeFile(target + '/node-map-browser.js', code);
  for (const file of ['index.html', 'standalone/index.html']) {
    const prefix = file.startsWith('standalone/') ? '../' : '';
    let html = await fs.readFile(target + '/' + file, 'utf8');
    html = html.replace(/<script[^>]+src="[^"]*node-map-browser\.js[^"]*"[^>]*><\/script>/g, '');
    html = html.replace(/(<script src="[^"]*source-runtime\.js[^>]+><\/script>)/, '<script src="' + prefix + 'node-map-browser.js?v=20261012-map-drawer-1" defer></script>$1');
    await fs.writeFile(target + '/' + file, html);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
