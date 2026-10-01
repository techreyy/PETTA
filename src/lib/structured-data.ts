type StudioIdentity = {
  name: string; address: string; phone: string; email: string;
  instagram?: string; facebook?: string;
};

export function studioStructuredData(settings: StudioIdentity, url?: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.name,
    address: settings.address,
    telephone: settings.phone,
    email: settings.email,
    ...(url ? { url } : {}),
    sameAs: [settings.instagram, settings.facebook].filter(value => value && /^https:\/\//.test(value)),
  }).replace(/</g, '\\u003c');
}
