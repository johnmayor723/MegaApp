// models/Tenant.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

const TenantSchema = new Schema({
  tenantId: {
    type: String,
    unique: true, // still enforce uniqueness
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true, // used as subdomain
    lowercase: true,
    trim: true,
  },
  url: {
  type: String,
  required: true,
  trim: true,
},
ourStory: {
  type: String,
  
  trim: true,
},    

  type: {
    type: String,
    enum: [
      'restaurant', 'ecommerce', 'blog',
       'portfolio', 'saas', 'education',
       'nonprofit', 'agency', 'freelancer',
       'school', 'saloon-spa', 'fitness',
       'real-estate', 'event', 'travel',
       'technology', 'finance', 'legal',
       'marketing', 'media', 'entertainment',
       'fashion', 'food-beverage', 'automotive',
       'hospital', 'others', 'individual'
      ],
    required: true,
  },
  domain: {
    type: String,
    sparse: true, // optional custom domain
    trim: true,
  },
  owner: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  plan: {
    type: String,
    enum: ['growth', 'free', 'pro', 'bumpa'],
    default: 'free',
  },
  branding: {
    logoUrl: { type: String, default: '' },
    primaryColor: { type: String, default: '#000000' },
    secondaryColor: { type: String, default: '#FFFFFF' },
    theme: { type: String, default: 'default' },
  },
  settings: {
    type: Schema.Types.Mixed,
    default: {},
  },
  // 🔹 Array of customer IDs linked to this tenant
  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
