const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post('/create-menu', menuController.createMenu);
router.get('/', menuController.allMenu);
router.put('/edit-menu/:id', menuController.updateMenu);
router.delete('/delete-menu/:id', menuController.deleteMenu);

module.exports = router;
