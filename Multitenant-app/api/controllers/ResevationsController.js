const Reservations = require('../models/Resevations');

// ------------------- CREATE RESERVATION -------------------
exports.createReservation = async (req, res) => {
  try {
    const { tenantId, customerName, phone, date, time, guests, table, notes, confirmed } = req.body;

    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Tenant ID is required' });
    }

    const reservation = await Reservations.create({
      tenantId,
      customerName,
      phone,
      date,
      time,
      guests,
      table: table || null,
      notes: notes || '',
      confirmed: confirmed === true || confirmed === 'on' || false,
    });

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// ------------------- GET ALL RESERVATIONS -------------------
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservations.find().sort({ date: -1, time: 1 });

    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (err) {
    console.error("Get all reservations error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching reservations",
    });
  }
};
// ------------------- GET ALL RESERVATIONS FOR A TENANT -------------------
exports.getReservationsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Tenant ID is required' });
    }

    const reservations = await Reservations.find({ tenantId }).sort({ date: 1, time: 1 });

    res.json({ success: true, reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ------------------- GET ONE RESERVATION -------------------
exports.getReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservations.findById(id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ------------------- UPDATE RESERVATION -------------------
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, phone, date, time, guests, table, notes, confirmed } = req.body;

    const updateData = {
      customerName,
      phone,
      date,
      time,
      guests,
      table: table || null,
      notes: notes || '',
      confirmed: confirmed === true || confirmed === 'on' || false,
    };

    const updatedReservation = await Reservations.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedReservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ------------------- DELETE RESERVATION -------------------
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservations.findById(id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    await reservation.deleteOne();

    res.json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
