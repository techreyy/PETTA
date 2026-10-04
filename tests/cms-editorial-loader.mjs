import './content-loader.mjs';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const root = new URL('../src/', import.meta.url);
const stubs = {
  'next/image': `import React from 'react'; export default function Image({fill,priority,preload,...props}) { return React.createElement('img',props); }`,
  'next/link': `import React from 'react'; export default function Link(props) { return React.createElement('a',props); }`,
  'framer-motion': `import React from 'react'; export const useReducedMotion = () => true; export const useScroll = () => ({ scrollYProgress: 0 }); export const useTransform = () => 1; export const AnimatePresence = ({children}) => children; export const motion = new Proxy({}, {get: (_,tag) => ({initial,animate,exit,transition,whileInView,viewport,layoutId,...props}) => React.createElement(tag,props)});`,
};
registerHooks({
 resolve(s,c,next) {
   if (stubs[s]) return {url:'editorial-test:'+s,shortCircuit:true};
   if (s.startsWith('@/')) { const base = new URL(s.slice(2),root); for (const ext of ['.tsx','.ts']) { try {readFileSync(new URL(base.href+ext));return {url:base.href+ext,shortCircuit:true};} catch {} } }
   if (s.startsWith('.') && c.parentURL?.startsWith(root.href) && !/\.[a-z]+$/.test(s)) {for(const ext of ['.ts','.tsx']) {try {const u=new URL(s+ext,c.parentURL);readFileSync(u);return {url:u.href,shortCircuit:true};}catch{}}}
   return next(s,c.parentURL?.startsWith('editorial-test:') ? {...c,parentURL:import.meta.url} : c);
 },
 load(u,c,next) {
   if(u.startsWith('editorial-test:')) return {format:'module',source:stubs[u.slice(15)],shortCircuit:true};
   if(u.startsWith(root.href)&&/\.tsx?$/.test(u)) return {format:'module',source:ts.transpileModule(readFileSync(new URL(u),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,shortCircuit:true};
   return next(u,c);
 }
});
