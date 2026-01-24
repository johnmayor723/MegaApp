const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  tenantId: { type: String, required: true }, // string tenant ID

  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // "HH:MM" format
  guests: { type: Number, required: true, min: 1 },
  table: { type: String, default: null }, // optional, can store table ID as string
  notes: { type: String, default: '' },
  confirmed: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Reservations', reservationSchema);
