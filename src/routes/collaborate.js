const express = require('express');
const router = express.Router();

const collaboratorController = require('../controllers/collaboratorController');

router.get('/wikis/:id/collaborate', collaboratorController.index);
router.post('/wikis/:id/collaborate/add', collaboratorController.create);
router.get('/wikis/:id/collaborate/edit', collaboratorController.edit);
router.post('/wikis/:id/collaborate/remove', collaboratorController.remove);

module.exports = router;
