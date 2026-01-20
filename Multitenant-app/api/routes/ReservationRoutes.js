const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/ResevationsController');

// Create a reservation
router.post('/create', reservationController.createReservation);

// Get all reservations
router.get('/', reservationController.getAllReservations);

// Get all reservations for a tenant
router.get('/tenant/:tenantId', reservationController.getReservationsByTenant);

// Get one reservation by ID
router.get('/:id', reservationController.getReservation);

// Update reservation
router.put('/:id', reservationController.updateReservation);

// Delete reservation
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
