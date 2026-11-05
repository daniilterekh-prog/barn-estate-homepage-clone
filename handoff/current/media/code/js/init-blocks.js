import {initBlock} from './blocks-runtime.js';
for(const root of document.querySelectorAll('[data-handoff-block]'))initBlock(root,{page:"media",kind:root.dataset.blockKind,preview:false});
