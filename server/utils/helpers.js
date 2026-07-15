const Listing = require('../models/Listing.js');

async function generateListingId() {
  let id;
  let exists = true;
  while (exists) {
    id = Math.floor(100_000_000 + Math.random() * 900_000_000);
    exists = await Listing.exists({ _id: id });
  }
  return id;
}

function generateUploadFilename(originalName = '') {
  const ext = (originalName.split('.').pop() || 'jpg').toLowerCase();
  const code = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  return `${code}.${ext}`;
}

module.exports = { generateListingId, generateUploadFilename };