import type { CollectionConfig, Field } from 'payload';
import { canPublish, isOwner } from './access';

const activeRead: NonNullable<CollectionConfig['access']>['read'] = ({ req }) => req.user?.active ? true : { active: { equals: true } };
const access = { read: activeRead, create: canPublish, update: canPublish, delete: isOwner };
export const safeLink = (value: unknown) => !value || typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https:\/\//.test(value)) || 'Use a relative /path or https:// URL.';
const order: Field = { name: 'order', type: 'number', defaultValue: 0 };
const active: Field = { name: 'active', type: 'checkbox', defaultValue: false };
export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'order', 'active'] },
  defaultSort: 'order',
  access,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    order,
    active,
  ],
};

export const BrandLogos: CollectionConfig = {
  slug: 'brandLogos', admin: { useAsTitle: 'name', defaultColumns: ['name', 'group', 'order', 'active'] }, access,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'group', label: 'Kelompok logo', type: 'select', required: true, options: [{ label: 'Klien', value: 'client' }, { label: 'Mitra kolaborasi', value: 'collaborator' }, { label: 'Publikasi / media', value: 'media' }] },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'alt', type: 'text', label: 'Deskripsi logo (opsional)', admin: { description: 'Jika kosong, memakai deskripsi berkas atau nama mitra.' } },
    { name: 'url', label: 'Tautan website mitra (opsional)', type: 'text', validate: safeLink }, order, active,
  ],
};
