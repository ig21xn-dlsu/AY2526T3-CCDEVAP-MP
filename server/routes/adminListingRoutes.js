const express = require('express');
const router = express.Router();
const { getListings, createListing, setListingDeleted } = require('../controllers/adminListingController');

router.get('/', getListings);
router.post('/', createListing);
router.patch('/:id', setListingDeleted);

module.exports = router;