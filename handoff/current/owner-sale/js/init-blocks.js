import {initBlock} from './blocks-runtime.js';
for(const root of document.querySelectorAll('[data-handoff-block]'))initBlock(root,{page:"owner-sale",kind:root.dataset.blockKind,preview:false});
