import assert from 'node:assert/strict';
import { getPayload } from 'payload';
import config from '../src/payload.config';
import { CATEGORY_DEFINITIONS } from './project-import-plan';
const p = await getPayload({config});
try {
 const categories = await p.find({collection:'portfolioCategories',pagination:false,depth:0,where:{active:{equals:true}}});
 for(const c of CATEGORY_DEFINITIONS) assert.ok(categories.docs.some(d=>d.slug===c.slug && d.title===c.title));
 const media = await p.find({collection:'media',pagination:false,depth:0,where:{filename:{like:'petta-'}}});
 const imported = media.docs.filter(d=>d.filename?.startsWith('petta-') && d.caption?.startsWith('PROJECT/'));
 assert.equal(imported.length,75);
 const projects=await p.find({collection:'projects',pagination:false,depth:1});
 const withMedia=projects.docs.filter(d=>typeof d.heroImage==='object' && d.heroImage?.filename?.startsWith('petta-'));
 assert.equal(withMedia.length,12);
 assert.equal(withMedia.reduce((n,d)=>n+(d.gallery?.length||0),0),75);
 const services=await p.find({collection:'services',pagination:false,where:{active:{equals:true}}});
 assert.equal(services.totalDocs,7);
 console.log(JSON.stringify({categories:categories.totalDocs,importedProjects:withMedia.length,media:imported.length,galleryImages:75,services:services.totalDocs,optimizedMB:Number((imported.reduce((n,d)=>n+(d.filesize||0),0)/1024/1024).toFixed(2)),unconfirmedStatuses:withMedia.filter(d=>!d.status).map(d=>d.title)},null,2));
}finally{await p.destroy();}
process.exit(0);
