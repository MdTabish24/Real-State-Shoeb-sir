export const siteConfig = {
  name: 'EstateHub',
  description: 'Premium Real Estate Platform - Connect with verified builders and find your dream property',
  url: 'https://estatehub.com',
  ogImage: 'https://estatehub.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/estatehub',
    facebook: 'https://facebook.com/estatehub',
    instagram: 'https://instagram.com/estatehub',
    linkedin: 'https://linkedin.com/company/estatehub',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'info@estatehub.com',
    address: 'Bhiwandi, Mumbai, Maharashtra, India',
    whatsapp: '+919876543210',
  },
  business: {
    commissionRate: 2, // 2% commission on deals
    leadFee: 500, // ₹500 per verified lead
    premiumListingFee: 5000, // ₹5000 per month for featured listing
  },
  features: {
    enableWhatsApp: true,
    enableEmailNotifications: true,
    enableSMSAlerts: true,
    enablePaymentGateway: false,
    enableVirtualTours: false,
  },
};

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'flat', label: 'Flat' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
];

export const budgetRanges = [
  { value: '0-25', label: 'Under 25 Lakhs' },
  { value: '25-50', label: '25L - 50L' },
  { value: '50-75', label: '50L - 75L' },
  { value: '75-100', label: '75L - 1 Crore' },
  { value: '100-200', label: '1Cr - 2Cr' },
  { value: '200+', label: 'Above 2 Crores' },
];

export const amenitiesList = [
  'Swimming Pool',
  'Gym',
  '24/7 Security',
  'Power Backup',
  'Parking',
  'Garden',
  'Kids Play Area',
  'Club House',
  'Lift',
  'CCTV',
  'Fire Safety',
  'Intercom',
  'Jogging Track',
  'Indoor Games',
  'Party Hall',
  'Meditation Area',
];

export const cities = [
  'Mumbai',
  'Thane',
  'Kalyan',
  'Bhiwandi',
  'Navi Mumbai',
  'Pune',
  'Nashik',
  'Nagpur',
];

export const possessionStatus = [
  { value: 'ready', label: 'Ready to Move' },
  { value: 'under-construction', label: 'Under Construction' },
  { value: 'upcoming', label: 'Upcoming' },
];

export const leadStatuses = [
  { value: 'new', label: 'New Lead', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'yellow' },
  { value: 'site-visit', label: 'Site Visit Scheduled', color: 'purple' },
  { value: 'negotiation', label: 'In Negotiation', color: 'orange' },
  { value: 'closed', label: 'Deal Closed', color: 'green' },
  { value: 'lost', label: 'Lost', color: 'red' },
];
