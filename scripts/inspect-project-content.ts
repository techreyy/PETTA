import { getPayload } from 'payload';
import config from '../src/payload.config';
const p = await getPayload({ config });
try {
 for (const collection of ['projects', 'portfolioCategories'] as const) {
 const result = await p.find({collection, pagination:false,depth:0});
 console.log(collection, JSON.stringify(result.docs.map(d => ({id:d.id,title:d.title,slug:d.slug,...(collection === 'projects' ? {status: 'status' in d ? d.status : '',legacyId:'legacyId' in d ? d.legacyId : '',heroImage:'heroImage' in d ? d.heroImage : null} : {})})),null,2));
 }
} finally { await p.destroy(); }
process.exit(0);
