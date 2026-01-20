// routes/restaurantManagementRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});



// Render the create menu form
router.get('/create-menu', (req, res) => {
  res.render('create-menu'); // your EJS form template
});

// Handle form submission
router.post('/create-menu', upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price, available, tenantId } = req.body;

    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`; // public folder path
    }

    // Build data to send to API
    const payload = {
      name,
      description,
      category,
      price: parseFloat(price),
      available: available === 'on' || available === true,
      tenantId,
      image: imagePath,
    };

    // Axios POST to your API
    const response = await axios.post('http://easyhostnet.localhost:3060/api/restaurant/create-menu', payload);

    // Render dashboard with response data
    res.render('menu-dashboard', { data: response.data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// ------------------- GET ALL MENUS -------------------
router.get('/menus/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const response = await axios.get(`http://easyhostnet.localhost:3060/api/restaurant/menus/${tenantId}`);
    res.render('menu-dashboard', { data: response.data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ------------------- GET ONE MENU -------------------
router.get('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`http://easyhostnet.localhost:3060/api/restaurant/menu/${id}`);
    res.render('edit-menu', { menu: response.data.menu });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ------------------- EDIT MENU -------------------
router.post('/edit-menu/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, available, tenantId } = req.body;

    const payload = {
      name,
      description,
      category,
      price: parseFloat(price),
      available: available === 'on' || available === true,
      tenantId,
    };

    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }

    const response = await axios.put(`http://easyhostnet.localhost:3060/api/restaurant/edit-menu/${id}`, payload);
    res.redirect(`/restaurant-management/menus/${tenantId}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ------------------- DELETE MENU -------------------
router.get('/delete-menu/:id/:tenantId', async (req, res) => {
  try {
    const { id, tenantId } = req.params;
    await axios.delete(`http://easyhostnet.localhost:3060/api/restaurant/delete-menu/${id}`);
    res.redirect(`/restaurant-management/menus/${tenantId}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
router.get('/create-reservation', (req, res) => {
  res.render('create-reservation'); // EJS form for reservation
});

router.post('/create-reservation', async (req, res) => {
  try {
    const { tenantId, customerName, phone, date, time, guests, table, notes, confirmed } = req.body;

    const payload = {
      tenantId,
      customerName,
      phone,
      date,
      time,
      guests: parseInt(guests),
      table: table || null,
      notes: notes || '',
      confirmed: confirmed === 'on' || confirmed === true,
    };

    const response = await axios.post('http://easyhostnet.localhost:3060/api/reservations/create', payload);
    
    // Render reservation dashboard with API response
    res.render('reservation-dashboard', { data: response.data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ------------------- GET ALL RESERVATIONS FOR TENANT -------------------
router.get('/reservations/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;

    const response = await axios.get(`http://easyhostnet.localhost:3060/api/reservations/tenant/${tenantId}`);
    
    res.render('reservation-dashboard', { data: response.data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ------------------- GET ONE RESERVATION -------------------
router.get('/reservation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`http://easyhostnet.localhost:3060/api/reservations/${id}`);

    res.render('edit-reservation', { reservation: response.data.reservation });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ------------------- EDIT RESERVATION -------------------
router.post('/edit-reservation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, customerName, phone, date, time, guests, table, notes, confirmed } = req.body;

    const payload = {
      tenantId,
      customerName,
      phone,
      date,
      time,
      guests: parseInt(guests),
      table: table || null,
      notes: notes || '',
      confirmed: confirmed === 'on' || confirmed === true,
    };

    await axios.put(`http://easyhostnet.localhost:3060/api/reservations/${id}`, payload);

    res.redirect(`/restaurant-management/reservations/${tenantId}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ------------------- DELETE RESERVATION -------------------
router.get('/delete-reservation/:id/:tenantId', async (req, res) => {
  try {
    const { id, tenantId } = req.params;

    await axios.delete(`http://easyhostnet.localhost:3060/api/reservations/${id}`);

    res.redirect(`/restaurant-management/reservations/${tenantId}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;


