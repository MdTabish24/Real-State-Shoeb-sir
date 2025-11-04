# 🏠 Premium Real Estate Platform

A professional real estate middleman platform built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

### For Buyers
- 🔍 Advanced property search with filters
- 🏘️ Browse verified properties from trusted builders
- 📞 Easy contact and enquiry forms
- 🗓️ Schedule site visits
- 💬 Direct communication with builders

### For Builders/Agents
- 📝 List properties with detailed information
- 📸 Upload property images
- ✅ Property verification system
- 📊 Track leads and enquiries

### Admin Dashboard
- 📈 Real-time analytics and statistics
- 👥 Lead management system
- 🏗️ Property approval workflow
- 💰 Commission tracking
- 📊 Revenue reports

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image

## 📦 Installation

1. Navigate to the project directory:
```bash
cd real-estate-platform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
real-estate-platform/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── properties/           # Properties listing & details
│   ├── list-property/        # Builder property submission
│   ├── contact/              # Contact page
│   └── admin/                # Admin dashboard
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── Footer.tsx            # Footer
│   ├── SearchBar.tsx         # Property search
│   ├── FeaturedProjects.tsx  # Featured listings
│   ├── HowItWorks.tsx        # Process explanation
│   └── Testimonials.tsx      # Customer reviews
└── public/
    └── grid.svg              # Background pattern
```

## 🎨 Key Pages

### 1. Home Page (`/`)
- Hero section with search
- Featured properties
- How it works section
- Testimonials
- Call-to-action sections

### 2. Properties (`/properties`)
- Advanced filtering (type, price, bedrooms)
- Grid view of all properties
- Responsive design
- Quick property details

### 3. Property Details (`/properties/[id]`)
- Full property information
- Image gallery
- Amenities list
- Contact form for enquiries
- Builder information

### 4. List Property (`/list-property`)
- Multi-step form (3 steps)
- Builder information
- Property details
- Amenities selection
- Image upload

### 5. Contact (`/contact`)
- Contact information cards
- Message form
- Map integration placeholder

### 6. Admin Dashboard (`/admin`)
- Statistics overview
- Lead management
- Property approval
- Builder management
- Search and filter functionality

## 🎯 Business Model

### Commission Options
1. **Per Sale Commission**: 1-2% from builder on successful deals
2. **Per Lead Fees**: Charge builders for verified leads
3. **Premium Listing**: Monthly fees for featured placement
4. **Add-on Services**: Loan assistance, documentation, site visits

## 🔄 Lead Flow

1. **Buyer searches** properties on website
2. **Buyer submits** enquiry form
3. **Lead generated** in admin dashboard
4. **Admin/Sales team** contacts buyer
5. **Site visit** arranged
6. **Deal negotiation** with builder
7. **Booking confirmed** → Commission earned

## 🎨 Design Features

- **Premium UI/UX**: Modern, clean, professional design
- **Smooth Animations**: Framer Motion for fluid interactions
- **Responsive**: Works perfectly on all devices
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized images and lazy loading
- **SEO Ready**: Meta tags and structured data

## 🔧 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: '#3b82f6',
  secondary: '#06b6d4',
  // Add your colors
}
```

### Content
- Update property data in respective page files
- Modify testimonials in `components/Testimonials.tsx`
- Change contact info in `components/Footer.tsx`

## 📱 Features to Add (Future)

- [ ] User authentication (buyers & builders)
- [ ] Payment gateway integration
- [ ] WhatsApp API integration
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Google Maps integration
- [ ] Property comparison
- [ ] Saved favorites
- [ ] Advanced analytics
- [ ] CRM integration
- [ ] Document management
- [ ] Virtual tours (360° images)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
```bash
npm run build
npm start
```

## 📄 License

This project is created for demonstration purposes.

## 🤝 Support

For support, email info@estatehub.com or contact +91 98765 43210

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
