export const CATEGORY_DEFINITIONS = [
 ['Private House','private-house','Rumah tinggal, villa, luxury residence.'],
 ['Residential & Housing','residential-housing','Kos, townhouse, apartment, rusun, residential development.'],
 ['Commercial Building','commercial-building','Ruko, kantor, showroom, retail, commercial building.'],
 ['Hospitality','hospitality','Hotel, resort, café, restaurant, leisure.'],
 ['Religious Architecture','religious-architecture','Masjid, gereja, pura, vihara, klenteng, chapel, dan fasilitas pendukung ibadah.'],
 ['Institutional & Public','institutional-public','Sekolah, kampus, kantor pemerintahan, fasilitas kesehatan, fasilitas olahraga, dan fasilitas publik.'],
 ['Interior Design','interior-design','Interior rumah, kantor, retail, hospitality, commercial, dan public space.'],
 ['Masterplanning & Urban Design','masterplanning-residential','Masterplan kawasan, site planning, urban design, residential development.'],
 ['Renovation & Adaptive Reuse','renovation-adaptive-reuse','Renovasi, revitalisasi, restorasi, perubahan fungsi bangunan.'],
 ['Architecture Installation','architecture-installation','Pavilion, exhibition, installation, temporary structure, architectural art installation.'],
 ['Social and Cultural Function Buildings','social-cultural-function-buildings','Bangunan fungsi sosial dan budaya, ruang komunitas, serta fasilitas kegiatan sosial dan kebudayaan.'],
].map(([title,slug,description]) => ({title,slug,description}));

export function discoverProjects(files: string[]) {
 const projects = new Map<string,{title:string; slug:string; year:string; categorySlug:string; images:string[]}>();
 for (const file of [...files].sort((a,b) => a.localeCompare(b,undefined,{numeric:true}))) {
  const [folder,year,title,...image] = file.replaceAll('\\','/').split('/');
  if (!title || !/^\d{4}$/.test(year) || !image.length || !/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
  let categorySlug = CATEGORY_DEFINITIONS.find(c => c.title === folder)?.slug;
  if (folder === 'Commercial Building' && /HOTEL/i.test(title)) categorySlug = 'hospitality';
  if (folder === 'Commercial Building' && /REKTORAT|SPORT CENTER/i.test(title)) categorySlug = 'institutional-public';
  if (!categorySlug) throw new Error(`Unknown category: ${folder}`);
  const key = `${folder}/${year}/${title}`;
  if (!projects.has(key)) projects.set(key,{title,year,categorySlug,slug:title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),images:[]});
  projects.get(key)!.images.push(file);
 }
 return [...projects.values()];
}
