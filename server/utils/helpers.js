import { Listing } from '../models/Listing.js';

/**
 * generates a 9-digit random integer and retries
 * on the (very unlikely) chance of a collision.
 */
export async function generateListingId() {
  let id;
  let exists = true;

  while (exists) {
    id = Math.floor(100_000_000 + Math.random() * 900_000_000); // 9 digits
    exists = await Listing.exists({ _id: id });
  }

  return id;
}

export function generateUploadFilename(originalName = '') {
  const ext = (originalName.split('.').pop() || 'jpg').toLowerCase();
  const code = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  return `${code}.${ext}`;
}
