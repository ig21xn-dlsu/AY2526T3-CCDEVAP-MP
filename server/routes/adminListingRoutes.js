const express = require('express');
const router = express.Router();
const { getListings, createListing, setListingDeleted, updateListing } = require('../controllers/adminListingController');

router.get('/', getListings);
router.post('/', createListing);
router.patch('/:id', setListingDeleted);
router.put('/:id', updateListing);

module.exports = router;