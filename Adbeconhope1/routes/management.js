const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Admin homepage
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('management/dashboard', { projects, layout: false});
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Server Error");
  }
});
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('management/projects', { projects, layout: false });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Server Error");
  }
}); 
router.post('/projects', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, raised, goal, status } = req.body;
    const imagePaths = req.files.map(f => f.filename);

    //const imagePaths = req.files ? req.files.map(f => f.filename) : [];
    console.log('Uploaded files:', req.files);
    console.log('Image paths:', imagePaths);

    if (!title || !description) {
      return res.status(400).send("Title and description are required");
    }
    const project = new Project({ title, description, images: imagePaths, raised, goal, status });
    await project.save();
    res.redirect('/management');
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).send("Server Error");
  }
});

// New project form
router.get('/projects/new', (req, res) => {
    res.render('management/createprojects', { layout: false });
});




// GET /management/project?title=Project+Title
router.get("/project", async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).send("Project title is required in query.");
    }

    // Find project by title (case-insensitive)
    const project = await Project.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, "i") } 
    });

    if (!project) {
      return res.status(404).render("template", { project: null, error: "Project not found." });
    }

    // Render EJS with project data
    res.render("template", { project, error: null });

  } catch (err) {
    console.error(err);
    res.status(500).render("template", { project: null, error: "Server Error" });
  }
});




// Show project
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render('admin/show', { project });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).send("Server Error");
  }
});

// Edit form
router.get('/projects/:id/edit', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render('admin/edit', { project });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Server Error");
  }
});

// Update project
router.post('/projects/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description } = req.body;
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.filename);
    }

    await Project.findByIdAndUpdate(req.params.id, {
      title,
      description,
      ...(imagePaths.length && { images: imagePaths })
    });

    res.redirect('/admin');
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).send("Server Error");
  }
});

// Delete project
router.delete('/projects/:id', async (req, res) => {
   try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/management/projects');
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).send("Server Error");
  } res.send("Delete route - to be implemented");
});
// Using DELETE method with method-override

module.exports = router;
