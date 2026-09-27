import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { getNews } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getNews(slug);
  return pageMetadata(result?.seo?.title || result?.item.title || 'Artikel', result?.seo?.description || result?.item.excerpt || 'Kabar studio Petta', `/news/${slug}`, result?.item.coverImage);
}
export default async function ArticlePage({ params }: Props) {
  const result = await getNews((await params).slug);
  if (!result) notFound();
  const { item, body } = result;
  return <article className="mx-auto max-w-5xl px-6 md:px-12 pt-36 pb-24">
    <Link href="/news" className="text-sm underline">Kembali ke kabar studio</Link>
    <p className="mt-10 text-sm text-[#39756B]">{item.category} / {item.date}</p>
    <h1 className="mt-4 text-4xl md:text-6xl font-light leading-tight">{item.title}</h1>
    <div className="relative aspect-[16/9] my-10"><Image src={item.coverImage} alt={item.title} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" /></div>
    <p className="text-lg leading-relaxed">{item.excerpt}</p>
    {body && <div className="article-body mt-8"><RichText data={body} /></div>}
  </article>;
}
