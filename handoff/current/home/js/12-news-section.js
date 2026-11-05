import {initBlock} from './blocks-runtime.js';
initBlock(document.querySelector('[data-handoff-block="12-news-section"]'),{page:"home",kind:"news-section",preview:document.body.hasAttribute('data-block-preview')});
