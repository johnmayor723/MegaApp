// routes/tenantAuthRoute.js
const express = require("express");
const router = express.Router();
const TenantAuthController = require("../controllers/tenantAuthController");

// 📌 Tenant signup (creates tenant + owner user)
router.post("/request-otp", TenantAuthController.requestOtp);
router.post("/verify-otp", TenantAuthController.verifyOtp);
router.post("/signup", TenantAuthController.completeSignup);
// 📌 Tenant login
router.post("/email-login", TenantAuthController.tenantLogin); 

// 📌 Verify tenant email
//router.get("/verify-email/:token", TenantAuthController.verifyEmail); 

// 📌 Request password reset (tenant admin only)
router.post("/request-password-reset", TenantAuthController.requestPasswordReset);

// 📌 Reset password (tenant admin only)
router.post("/reset-password", TenantAuthController.resetPassword);
router.post('/complete-signup', TenantAuthController.completeSignup);
router.post('/select-plan', TenantAuthController.selectPlan);
router.post('/update-branding', TenantAuthController.updateTenantBranding);
router.post('/update-domain', TenantAuthController.updateTenantDomain);

// get all tenants
router.get("/get-all-tenants", TenantAuthController.getAllTenants);
// 📌 Get tenant info
router.post("/get-one-tenant", TenantAuthController.getTenant);

router.get("/ping", (req, res) => {
  res.json({ ok: true });
});


router.get('/check-domain', async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    await axios.get(
      `https://rdap.nic.net.ng/domain/${domain}`,
      {
        headers: {
          Accept: 'application/rdap+json',
          'User-Agent': 'KeemaDomainChecker/1.0'
        },
        timeout: 10000
      }
    );

    // 200 → exists
    return res.json({
      domain,
      available: false,
      source: 'rdap'
    });

  } catch (err) {
    const status = err.response?.status;

    if (status === 404 || status === 500) {
      return res.json({
        domain,
        available: true,
        source: 'rdap'
      });
    }

    return res.status(500).json({
      domain,
      available: null,
      error: 'RDAP_UNREACHABLE'
    });
  }
});

module.exports = router;
