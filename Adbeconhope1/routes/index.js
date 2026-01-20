const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Home route → show all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}); 
    res.render("index",{layout:false, projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Server Error");
  }
});

router.get("/programs", async (req, res) => {
  try {
    const projects = await Project.find({}); 
    res.render("programs",{layout:false, projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Server Error");
  }
});

router.get("/project/:title", async (req, res) => {
  try {
    // Find the project by title (case-insensitive match)
    const project = await Project.findOne({
      title: { $regex: new RegExp("^" + req.params.title + "$", "i") },
    });

    if (!project) {
      return res.status(404).render("404", { message: "Project not found" });
    }

    // Render the template view
    res.render("template", {
      project, layout: false
      
    });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).send("Server Error");
  }
});

// About route
router.get("/about", (req, res) => {
  res.render("about", { layout: false });
});

// Contact route
router.get("/contact", (req, res) => {
  res.render("contact",{ layout: false });
});

// Team route
router.get("/team", (req, res) => {
  res.render("team",{ layout: false });
});

// donate route
router.get("/donate", (req, res) => {
  res.render("donate",{ layout: false });
});

// Gallery route → collect all images
router.get("/gallery", async (req, res) => {
  try {
    const projects = await Project.find({});

    // Flatten all images from all projects
    const images = projects.reduce((all, proj) => {
      if (Array.isArray(proj.images) && proj.images.length > 0) {
        return all.concat(proj.images.map(img => ({
          img,
          title: proj.title
        })));
      }
      return all;
    }, []);

    res.render("gallery", { images, projects , layout: false });
  } catch (err) {
    console.error("Error fetching gallery images:", err);
    res.status(500).send("Server Error");
  }
});
// 📂 Projects / Causes// more 
router.get('/activsm', (req, res) => res.render('activsm', { layout: false }));
router.get('/every-child-deserves-care', (req, res) => res.render('every-child-deserves-care', { layout: false }));
router.get('/alagbaka', (req, res) => res.render('alagbaka', { layout: false }));
router.get('/mentalawareness', (req, res) => res.render('mentalawareness', { layout: false }));
router.get('/girlvisionforthefuture', (req, res) => res.render('girlvisionforthefuture', { layout: false }));
router.get('/monthlyfooddrive', (req, res) => res.render('monthlyfooddrive', { layout: false }  ));
router.get('/padagirl', (req, res) => res.render('padagirl', { layout: false } ));

module.exports = router;
