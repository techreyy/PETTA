import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeView } from '../src/components/HomeView.tsx';
import { SettingsProvider } from '../src/lib/SettingsContext.tsx';
import { STUDIO_INFO } from '../src/lib/data.ts';
const render = (editorial) => renderToStaticMarkup(React.createElement(SettingsProvider,{settings:{...STUDIO_INFO,editorial}},React.createElement(HomeView)));
test('homepage renders uploaded logos with alt and links; empty groups disappear', () => {
 const empty = render({logos:[]});
 assert.ok(!empty.includes('Klien & Mitra Kolaborasi Studio'));
 const html = render({logos:[{id:'1',group:'collaborator',name:'Partner',alt:'Partner mark',image:'/media/partner.png',url:'https://example.org'}]});
 assert.ok(html.includes('alt="Partner mark"'));
 assert.ok(html.includes('href="https://example.org"'));
});

test('homepage honors editable positioning, section visibility, CTA and configured video', () => {
 const html = render({logos:[], homepage:{showPositioning:true,positioningTitle:'Edited positioning',showBusiness:false,showProjects:false,showCategories:false,showNews:false,showVideo:true,videoTitle:'Studio film',videoUrl:'https://www.youtube.com/watch?v=abcdefghijk',showCta:true,ctaTitle:'Start a conversation',ctaLabel:'Talk to us',ctaUrl:'/contact'}});
 assert.ok(html.includes('Edited positioning'));
 assert.ok(!html.includes('Unit Bisnis Petta Group'));
 assert.ok(!html.includes('What’s On'));
 assert.ok(html.includes('https://www.youtube-nocookie.com/embed/abcdefghijk'));
 assert.ok(html.includes('loading="lazy"'));
 assert.ok(html.includes('Talk to us'));
 const empty = render({logos:[],homepage:{showVideo:true,videoUrl:'javascript:alert(1)',showCta:false}});
 assert.ok(!empty.includes('<iframe'));
 assert.ok(!empty.includes('Start a conversation'));
});
