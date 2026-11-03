#!/usr/bin/env python3
import json,pathlib,re,collections
root=pathlib.Path(__file__).resolve().parents[2]/'handoff/catalog-2026-11-03/design';data=json.loads((root/'MEASUREMENTS.json').read_text());states={s['id']:s for s in data['states']}
def value(e,k,sid):
 v=e['properties'].get(k,'—')
 return v if isinstance(v,str) else next((x['value'] for x in v if sid in x['states']),'—')
def cell(v):return str(v).replace('|','\\|').replace('\n',' ')
def widths(ids):return ', '.join(map(str,sorted({states[i]['viewport'] for i in ids})))
font_file=root/'TYPOGRAPHY.md';text=font_file.read_text().split('## Межстрочные интервалы')[0]
text+='''\n## Межстрочные интервалы, разрядка, регистр и выравнивание

Таблица ниже содержит фактические текстовые стили: размер / насыщенность / line-height / letter-spacing / text-transform / text-align. Ширины — именно снятые состояния; основные диапазоны адаптива указаны выше. Семейство — Tilda Sans с системным fallback. Точные цвета и все варианты доступны в MEASUREMENTS.json. Одинаковые стили повторяющихся элементов объединены.

| CSS-селектор | Ширины замеров, px | Размер | Вес | Межстрочный | Разрядка | Регистр | Выравнивание |
| --- | --- | --- | --- | --- | --- | --- | --- |
'''
archive=json.loads((pathlib.Path(__file__).resolve().parents[1]/'verification/font-sizes/computed.json').read_text())
font_selectors={g['selector'] for s in archive['states'] for g in s.get('groups',[])};profiles={}
for e in data['elements']:
 if e['selector'] not in font_selectors:continue
 for sid in e['visibleAt']:
  sig=tuple(value(e,k,sid) for k in ['fontSize','fontWeight','lineHeight','letterSpacing','textTransform','textAlign']);profiles.setdefault((e['selector'],sig),set()).add(sid)
for (selector,sig),ids in sorted(profiles.items()):text+='| `'+selector+'` | '+widths(ids)+' | '+' | '.join(map(cell,sig))+' |\n'
font_file.write_text(text)
text='''# Цвета, рамки и состояния

| Назначение | Значение |
| --- | --- |
| Белый фон страницы, полей и карточек | `#FFFFFF` |
| Основной текст | `#1E1E1E` |
| Текст фильтров и вторичный текст | `#4F4D49` |
| Подписи, ID, хлебные крошки, placeholder | `#656462` |
| Бордовый акцент, выбранная половина покупки/аренды | `#8B1D25` |
| Текст выбранной половины покупки/аренды | `#FFFFFF` |
| Контур полей | `#8B8986`, 1px solid |
| Разделители полей и светлые рамки | `#E4E4E4`, 1px solid |
| Светлое выделение выбранного условия / варианта | `#F9F3F3` |
| Наведение на поле или вариант | `#F7F7F7` |
| Клавиатурный focus | outline 2px `#8B1D25`, offset 3px; у ссылок меню offset 2px |
| Нижняя линия белого хедера | `rgba(30,30,30,0.1)`; при открытом меню `rgba(30,30,30,0.12)` |
| Тень выпадающего меню хедера | `0 8px 24px rgba(0,0,0,0.08)` |
| Тень обычного dropdown | `0 8px 24px rgba(30,30,30,0.04)` |

Ниже перечислены фактически снятые цвета/рамки/тени, включая формы, карту, меню и состояния. Цвета официальных иконок находятся в SVG в `code/assets/images/`; цвет `currentColor` наследуется от элемента. Фотографии не перекрашиваются.

'''
for prop,title in [('color','Текст'),('backgroundColor','Фоны'),('borderColor','Цвета рамок'),('borderWidth','Толщина рамок'),('borderRadius','Скругления'),('boxShadow','Тени'),('outline','Outline'),('fill','SVG fill'),('stroke','SVG stroke')]:
 variants=collections.defaultdict(set)
 for e in data['elements']:
  for sid in e['visibleAt']:
   v=value(e,prop,sid)
   if v not in ['none','—']:variants[v].add(e['selector'])
 text+='## '+title+'\n\n| Значение | Где используется, примеры селекторов |\n| --- | --- |\n'
 for v,selectors in sorted(variants.items()):text+='| `'+cell(v)+'` | '+', '.join('`'+s+'`' for s in sorted(selectors)[:6])+' |\n'
 text+='\n'
(root/'COLORS.md').write_text(text)
text='''# Размеры блоков, отступы и адаптив

Все значения — CSS px. Порядок shorthand `padding`/`margin`: сверху → справа → снизу → слева. Отрицательный margin у тела карточки создаёт наложение белой панели на фотографию. Высота текстовых блоков зависит от текста; ширина карточек — от сетки. Таблицы ниже — фактические замеры, а не фиксированные ширины для вёрстки.

## Общие направляющие

- Контейнер: максимум 1920px, по центру.
- Горизонтальный gutter до 540px: 22px. Выше: `clamp(24px, calc(-26.66667px + 6.59722vw), 100px)`. С 1921px внутренний gutter 0px, контейнер остаётся по центру шириной до 1920px.
- Верх от хедера до хлебных крошек: 28px до 540px; 32px до 1024px; 40px выше.
- Под H1: 28px на телефоне до 540px, 40px выше.
- Высота быстрых полей: 58px до 767px, 64px выше; рамка 1px, радиус 1px.
- Покупка/аренда: две равные половины общего контура, без внутреннего отступа и вложенного шейпа.
- Десктоп от 1024px: основные поля в верхнем ряду; четыре быстрых параметра и кнопка всех фильтров ниже; gap 16px.
- 768–1023px: сетка из четырёх равных колонок, gap 16px; параметры занимают полный ряд.
- До 767px: один столбец основных полей; четыре параметра в сетке 2×2 высотой 116px; расстояние между рядами основных блоков 12px. Поиск и кнопка фильтров стоят рядом, кнопка 58×58px.
- Мобильная панель результата: первая строка сброс / сортировка, вторая карта / количество. Gap 8px по вертикали и 12px по горизонтали; до 359px горизонтальный gap 6px.
- Между карточками: 24px. Число колонок и фактические размеры — в таблице сетки ниже.
- Под карточками: кнопка «Смотреть больше», затем количество; gap 14px.
- Хедер: полный 153px при 1281–1440px и 155px выше; без строки направлений 111px при 541–1280px; 77px до 540px. Логотип 36px по высоте на телефоне, 48px выше.
- От строки направления до первого подпункта: 31px. Текст подпунктов выровнен с названием направления; белая рамка сдвинута левее на padding+border (19px).
- Рамка dropdown хедера 1px; padding 30px 18px 8px; промежуток между подпунктами 12px.
- Карта: панель до 420px слева на десктопе, крестик 44×44px с отступами 20px; на телефоне нижняя раскрывающаяся шторка. Полные значения каждого состояния ниже.

Браузер замеров использует вертикальную полосу прокрутки 15px, поэтому `clientWidth` страницы обычно на 15px меньше ширины окна. Высота окна замеров — 1000px; ограничения через vh/dvh меняются вместе с окном. Для точного CSS-селектора таблицы указывают border-box ширину/высоту, padding, margin, gap и border-radius. Все остальные min/max-размеры, grid-template, position и выравнивание сохранены в MEASUREMENTS.json.

## Как читать MEASUREMENTS.json

`states` содержит номер состояния, ширину окна, клиентскую ширину и название. В `elements` — CSS-селектор, порядковое вхождение, пример текста, `visibleAt` и все свойства. Если свойство постоянно, записана строка. Если меняется, для каждого `value` указан список номеров `states`. Так сохранены точные параметры без многократного повторения одинаковых значений.

'''
layout=['body','.base-container','.site-header','.site-header__top','.site-header__logo img','.site-header__icon-btn','.site-header__favorites-btn','.site-header__messenger','.home-header-contacts-toggle','.catalog-page-intro','.catalog-breadcrumbs','.catalog-page-title','.catalog-mode-toolbar','.catalog-toolbar__primary','.catalog-toolbar__secondary','.catalog-mode-switch','.catalog-mode-switch__button.is-active','.catalog-direction','.catalog-direction>.resort-select-trigger','.catalog-mode-filters','.catalog-quick-filters__item','.catalog-quick-filters__button','.catalog-text-search','.catalog-text-search svg','#catalog-search','.catalog-mode-detailed-filters','.catalog-results-toolbar','.catalog-collections-row','.catalog-result-summary','.catalog-active-filter','.catalog-grid__sort','.catalog-map-trigger','.catalog-map-trigger svg','.catalog-grid__inner','.catalog-grid__list','.catalog-grid__item','.apartment-card','.apartment-card__image','.apartment-card__body','.apartment-card__actions','.apartment-card__favorite','.listing-card-fact','.catalog-grid__footer','.catalog-grid__more','.catalog-empty','.resort-quick-dropdown','.catalog-quick-filters__dropdown-header','.catalog-quick-filters__options','.resort-filters','.hero-filter-modal__content','.hero-filter-modal__header','.hero-filter-modal__body','.hero-filter-modal__footer','.hero-filter-panel-content__group','.hero-filter-panel-content__range-input','.ui-checkbox--chip','.ui-checkbox__box','.site-menu','.site-menu__inner','.site-menu__main','.site-menu__nav','.site-menu__bottom','.catalog-header-dropdown','.catalog-header-dropdown__list','.map-browser','.map-browser__panel','.map-browser__handle','.map-browser__search-row','.map-browser__search','.map-browser__filters','.map-browser__field','.map-browser__market','.map-browser__card','.map-browser__close','.map-browser__zoom','.site-footer','.site-footer__inner','.site-footer__grid','.site-footer__logo img','.site-footer__column','.floating-expert','.floating-expert__avatar','.home-owner-form','.home-owner-form__body','.home-owner-form__layout','.home-owner-form__hero','.home-owner-form__input','.home-quiz__panel','.home-quiz__options','.home-quiz__option','.home-owner-form__submit','.home-owner-form__consent-box']
for selector in layout:
 e=next((e for e in data['elements'] if e['selector']==selector and e['occurrence']==1),None)
 if not e:continue
 text+='## `'+selector+'`\n\n| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n'
 used=set()
 for sid in e['visibleAt']:
  st=states[sid];values=tuple(value(e,k,sid) for k in ['boxWidth','boxHeight','padding','margin','gap','borderRadius']);key=(st['viewport'],values)
  if key in used:continue
  used.add(key);text+='| '+str(st['viewport'])+' | '+st['state']+' | '+' | '.join(map(cell,values))+' |\n'
 text+='\n'
(root/'SPACING.md').write_text(text)
print({'textStyles':len(profiles),'designStates':len(states),'components':len(layout)})
