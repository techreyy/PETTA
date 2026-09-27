import type { Access, CollectionBeforeChangeHook, FieldAccess } from 'payload';

export const isStaff: Access = ({ req }) => Boolean(req.user?.active);
export const isOwner: Access = ({ req }) => req.user?.active === true && req.user.role === 'owner';
export const canPublish: Access = ({ req }) => req.user?.active === true && ['owner', 'admin'].includes(req.user.role);
export const ownerField: FieldAccess = ({ req }) => req.user?.active === true && req.user.role === 'owner';
export const publishedOrStaff: Access = ({ req }) => req.user?.active ? true : { _status: { equals: 'published' } };

export const protectPublishing: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user?.role === 'editor' && data._status === 'published') {
    throw new Error('Editors can save drafts but cannot publish.');
  }
  if (req.user?.role === 'editor') data._status = 'draft';
  return data;
};
