import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProjectCard } from '../src/components/ProjectCard.tsx';
import { HomeView } from '../src/components/HomeView.tsx';
import { PortfolioView } from '../src/app/(site)/portfolio/portfolio-view.tsx';
import { ProjectProvider } from '../src/lib/ProjectContext.tsx';
import { SettingsProvider } from '../src/lib/SettingsContext.tsx';
import { STUDIO_INFO } from '../src/lib/data.ts';
const project = { id:'p',slug:'project',title:'Test project',category:'House',categorySlug:'house',location:'Kendari',year:'2026',heroImage:'/media/project.jpg',status:'Completed',featured:true };
const render = (Component, projects=[project], homepage={}) => renderToStaticMarkup(
  React.createElement(SettingsProvider,{settings:{...STUDIO_INFO,editorial:{logos:[],homepage}}},
    React.createElement(ProjectProvider,{projects,categories:[],news:[],team:[]},React.createElement(Component))));

test('project cards expose normalized status, preserving ambiguous labels without claiming built', () => {
  const html = renderToStaticMarkup(React.createElement(ProjectCard,{project}));
  assert.match(html, /aria-label="Project status: BUILT"/);
  const mixed = renderToStaticMarkup(React.createElement(ProjectCard,{project:{...project,status:'Completed / Under Phasing'}}));
  assert.match(mixed, /Project status: Completed \/ Under Phasing/);
  assert.doesNotMatch(mixed, /Project status: BUILT/);
});

test('homepage hero exposes status and selected built section follows explicit status and visibility', () => {
  const html = render(HomeView);
  assert.match(html, /Project status: BUILT/);
  assert.match(html, /Selected Built Works/);
  assert.doesNotMatch(render(HomeView,[{...project,status:'Completed / Under Phasing'}]), /Selected Built Works/);
  assert.doesNotMatch(render(HomeView,[{...project,featured:false}]), /Selected Built Works/);
  assert.doesNotMatch(render(HomeView,[project],{showProjects:false}), /Selected Built Works/);
});

test('portfolio exposes separate accessible status and category filter groups', () => {
  const html = render(PortfolioView);
  assert.match(html, /aria-label="Project status filters"/);
  assert.match(html, /aria-label="Project category filters"/);
  for (const label of ['ALL','BUILT','ONGOING','PROPOSED','CONCEPT']) assert.ok(html.includes(label));
  assert.match(html, /aria-live="polite"/);
});
