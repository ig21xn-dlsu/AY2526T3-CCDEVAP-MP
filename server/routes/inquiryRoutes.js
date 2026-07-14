const express = require("express")
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { createInquiry, getInquiries, markAsRead } = require("../controllers/inquiryController");

router.post('/', requireAuth, createInquiry);
router.get('/', requireAuth, getInquiries);
router.patch('/:id/read', requireAuth, markAsRead);

module.exports = router;


