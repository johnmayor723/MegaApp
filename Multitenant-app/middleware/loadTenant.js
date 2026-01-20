// middleware/loadTenant.js
const axios = require("axios");
const getTenantSlug = require("../utils/getTenantSlug");

const API_BASE = "http://easyhostnet.localhost:3060/api";

module.exports = async function loadTenant(req, res, next) {
  try {
    const tenantInfo = getTenantSlug(req);
    if (!tenantInfo) return res.status(404).send("Tenant not found");

    const { tenantId, slug, mode } = tenantInfo;

    // --- Skip if already in session ---
    if (
      req.session.tenant &&
      req.session.tenant.slug === slug &&
      (mode === "production" || req.session.tenant.tenantId === tenantId)
    ) {
      res.locals.tenant = req.session.tenant;
      return next();
    }

    // --- Fetch tenant info by slug ---
    const response = await axios.get(`${API_BASE}/tenant-auth/${slug}`);
    const tenant = response.data.tenant;

    // --- Security check for local mode ---
    if (mode === "local" && tenant._id !== tenantId) {
      return res.status(403).send("Invalid tenant access");
    }

    // --- Save everything to session for branding + filtering ---
    req.session.tenant = {
      tenantId: tenant._id,
      slug,
      name: tenant.name,
      storeName: tenant.storeName || tenant.name,
      owner: tenant.owner,
      branding: {
        logo: tenant.logo || null,
        primaryColor: tenant.primaryColor || "#2563eb",
        secondaryColor: tenant.secondaryColor || "#111827",
        contactColor: tenant.contactColor || "#10b981",
      },
      contact: {
        phone: tenant.phone || "",
        email: tenant.email || "",
      },
    };

    res.locals.tenant = req.session.tenant;
    next();
  } catch (err) {
    console.error("Tenant load error:", err.message);
    res.status(404).send("Tenant not found");
  }
};
