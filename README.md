# QuickBite - Food Ordering Platform

University assignment project featuring a food ordering website with A/B testing capabilities for studying micro-interactions.

## 📋 Project Overview

QuickBite is a full-stack food ordering platform designed to compare user experience with and without micro-interactions (Site A vs Site B). The project demonstrates modern web development practices while serving as a research platform for UI/UX studies.

## 🎯 Project Goals

1. **Educational**: Demonstrate React + Node.js full-stack development
2. **Research**: A/B testing of micro-interactions impact on user engagement
3. **Practical**: Functional food ordering system with realistic features
4. **Professional**: Production-ready code structure and best practices

## 🏗️ Architecture

```
quickbite/
├── frontend/                 # React + Vite + Tailwind CSS
│   ├── src/pages/           # AuthPage, HomePage, etc.
│   ├── src/components/      # Reusable UI components
│   └── public/              # Static assets
├── backend/                  # Node.js + Express API
│   ├── src/routes/          # API endpoints
│   ├── src/controllers/     # Business logic
│   └── src/models/          # Data models
└── supabase/                 # Study database schema
```

## 🚀 Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

### Backend Development
```bash
cd backend
npm install
npm run dev
```
API runs on http://localhost:3000

## 🔧 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **React Router DOM v7** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing

### Planned Integrations
- **Supabase** - Database, authentication, real-time
- **Netlify** - Frontend hosting
- **Railway/Render** - Backend hosting

## 📊 A/B Testing Features

### Site B Micro-Interactions
1. **Active border on auth fields** - Visual focus indication
2. **Inline validation** - Real-time form feedback
3. **Password strength ticks** - Progressive disclosure
4. **CTA hover transition** - Smooth button effects
5. **CTA click confirmation** - Visual feedback on click
6. **Add-to-basket animation** - Item addition feedback
7. **Basket count bounce** - Attention-grabbing counter
8. **Loading indicator** - Within 100ms response
9. **Checkout progress** - Visual workflow tracking
10. **Success messages** - Confirmation feedback

### Tracking Metrics
- Task completion times (login, order, checkout)
- CTA interaction rates and patterns
- User hesitation and misclicks
- Session duration and engagement
- Data stored in Supabase with participant demographics

## 🎨 Design System

### Color Palette
- Primary: `#FF6B35` (Vibrant orange for food/branding)
- Secondary: `#4ECDC4` (Calm teal for accents)
- Accent: `#FFD166` (Warm yellow for highlights)
- Dark: `#2D3047` (Dark blue for text)
- Light: `#F7F7F7` (Clean background)

### Typography
- Primary font: Inter (system-ui fallback)
- Consistent spacing scale
- Mobile-responsive typography
- Clear visual hierarchy

## 📁 Project Structure Details

### Frontend (`frontend/`)
- **Pages**: Complete login/register and homepage
- **Components**: Modular, reusable UI elements
- **Routing**: Clean navigation between views
- **State Management**: React hooks for local state
- **Styling**: Tailwind CSS with custom utilities

### Backend (`backend/`)
- **REST API**: JSON-based endpoints
- **Middleware**: CORS, JSON parsing, error handling
- **Simulated Data**: Menu items, order processing
- **Analytics Endpoint**: A/B test data collection

## 🧪 Testing Approach

### A/B Testing Methodology
1. **Control Group (Site A)**: Basic functionality
2. **Experimental Group (Site B)**: Enhanced micro-interactions
3. **Random Assignment**: Participants randomly assigned
4. **Data Collection**: Supabase storage with timestamps
5. **Analysis**: Comparative metrics analysis

### Technical Testing
- Component testing with React Testing Library
- API endpoint testing with Jest
- End-to-end testing with Cypress (planned)
- Performance monitoring with Lighthouse

## 📈 Future Roadmap

### Phase 1 (Current)
- ✅ Basic frontend with login/homepage
- ✅ Tailwind CSS integration
- ✅ Site A/B toggle functionality
- ✅ Basic backend API structure

### Phase 2 (Next)
- Supabase integration (auth, database)
- Complete food menu with categories
- Shopping cart functionality
- Checkout process
- Order history

### Phase 3 (Future)
- Real-time order tracking
- Payment processing (Stripe)
- Restaurant admin panel
- Customer reviews and ratings
- Mobile app (React Native)

## 👥 Team & Contribution

This is a university assignment project designed for:
- **Computer Science Students**: Full-stack development practice
- **UX Researchers**: A/B testing methodology
- **Instructors**: Teaching modern web development

## 📝 License & Academic Use

This project is created for educational purposes as part of a university assignment. The code is open for academic use with proper attribution.

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Express Documentation](https://expressjs.com)

---

**University Assignment Project** • **Food Ordering Platform** • **A/B Testing Research**