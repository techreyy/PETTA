import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { getPayload } from 'payload';
import config from '../src/payload.config';
import { CATEGORY_DEFINITIONS, discoverProjects } from './project-import-plan';

const root = path.resolve('../PROJECT');
async function walk(dir: string): Promise<string[]> {
 const entries = await readdir(dir,{withFileTypes:true});
 return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir,e.name)) : Promise.resolve([path.relative(root,path.join(dir,e.name))])))).flat();
}
const plan = discoverProjects(await walk(root));
if (!process.argv.includes('--apply')) {
 console.log(JSON.stringify(plan.map(p => ({...p,images:p.images.length})),null,2));
 process.exit(0);
}
const payload = await getPayload({config});
const aliases: Record<string,string> = {
 'GEDUNG REKTORAT UMkendari':'gedung-rektorat-fk-umkendari',
 'HOTEL BARAKA':'baraka-hotel-kolaka',
 'N-HOUSE':'n-house-orinunggu-kendari',
 'RG. KERJA REKTOR UMKendari':'modern-executive-office-umkendari',
};
const report: object[] = [];
try {
 await mkdir('.cache',{recursive:true});
 const before = await payload.find({collection:'projects',pagination:false,depth:0});
 const categoriesBefore = await payload.find({collection:'portfolioCategories',pagination:false,depth:0});
 await writeFile(`.cache/project-import-backup-${Date.now()}.json`,JSON.stringify({projects:before.docs,categories:categoriesBefore.docs},null,2));
 const categoryIds = new Map<string,number>();
 for (const [order,category] of CATEGORY_DEFINITIONS.entries()) {
  const found = categoriesBefore.docs.find(c => c.slug === category.slug);
  const data = {...category,order,active:true};
  const doc = found ? await payload.update({collection:'portfolioCategories',id:found.id,data}) : await payload.create({collection:'portfolioCategories',data});
  categoryIds.set(category.slug,doc.id);
 }
 for (const [order,project] of plan.entries()) {
  const slug = aliases[project.title] || project.slug;
  const existing = before.docs.find(p => p.slug === slug);
  // Never overwrite an administrator's uploaded gallery on a rerun.
  if (existing?.heroImage && existing.gallery?.some(g => g.image)) { report.push({slug,skipped:'already has uploaded media'}); continue; }
  const images: number[] = [];
  for (const file of project.images) {
   const filename = `petta-${project.slug}-${createHash('sha256').update(file.replaceAll('\\','/')).digest('hex').slice(0,12)}.webp`;
   const found = await payload.find({collection:'media',where:{filename:{equals:filename}},limit:1,depth:0});
   if (found.docs[0]) {images.push(found.docs[0].id);continue;}
   const data = await sharp(path.join(root,file)).rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer();
   const media = await payload.create({collection:'media',data:{alt:`${project.title} — ${path.basename(file,path.extname(file))}`,caption:`PROJECT/${file.replaceAll('\\','/')}`},file:{data,name:filename,mimetype:'image/webp',size:data.length}});
   images.push(media.id);
   console.log(`Media ${images.length}/${project.images.length}: ${project.title}`);
  }
  const data = {category:categoryIds.get(project.categorySlug)!,heroImage:images[0],heroImageUrl:'',gallery:images.map(image => ({image})),year:project.year};
  const doc = existing ? await payload.update({collection:'projects',id:existing.id,data}) : await payload.create({collection:'projects',data:{...data,title:project.title,slug,legacyId:`folder:${project.slug}`,order:order+10,status:'',_status:'published'}});
  const category = await payload.findByID({collection:'portfolioCategories',id:categoryIds.get(project.categorySlug)!,depth:0});
  if (!category.coverImage) await payload.update({collection:'portfolioCategories',id:category.id,data:{coverImage:images[0],coverImageUrl:''}});
  report.push({id:doc.id,slug,images:images.length,status:doc.status || 'unconfirmed'});
 }
 const services = [
  ['Architecture','Perancangan arsitektur yang merespons kebutuhan, tapak, iklim, dan karakter pengguna.'],
  ['Interior Design','Perencanaan ruang interior, material, pencahayaan, dan detail untuk hunian maupun ruang usaha.'],
  ['Masterplanning & Urban Design','Perencanaan kawasan, tata massa, sirkulasi, ruang terbuka, dan pengembangan tapak.'],
  ['BIM & Technical Documentation','Pemodelan informasi bangunan dan penyusunan dokumentasi teknis untuk koordinasi desain.'],
  ['3D Visualization','Visualisasi tiga dimensi untuk mengomunikasikan ruang, material, dan suasana rancangan.'],
  ['Construction Supervision','Pendampingan dan pengawasan pelaksanaan agar pekerjaan selaras dengan dokumen perancangan.'],
  ['Project Management','Koordinasi lingkup pekerjaan, jadwal, dan pihak terkait sepanjang proses proyek.'],
 ];
 for (const [order,[title,description]] of services.entries()) {
  const found = await payload.count({collection:'services',where:{title:{equals:title}}});
  if (!found.totalDocs) await payload.create({collection:'services',data:{title,description,order,active:true}});
 }
 await writeFile('.cache/project-import-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
} finally {await payload.destroy();}
process.exit(0);
