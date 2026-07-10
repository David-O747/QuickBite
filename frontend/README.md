# QuickBite - Food Ordering Website

University assignment project for a food ordering website with A/B testing capabilities.

## Project Overview

QuickBite is a food ordering platform built with modern web technologies. The project includes two versions:
- **Site A**: Basic functionality without micro-interactions
- **Site B**: Enhanced user experience with micro-interactions for A/B testing

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Backend**: Node.js + Express (planned)
- **Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Hosting**: Netlify

## Features Implemented

### Login/Register Page (Completed)
- Toggle between login and registration
- Form validation with inline feedback
- Password strength indicator (Site B only)
- Active field borders (Site B only)
- Success messages with animations (Site B only)
- CTA hover and click effects (Site B only)

### Homepage (Completed)
- Responsive food menu grid
- Basket functionality with count animation (Site B only)
- Checkout progress indicator (Site B only)
- Mobile-responsive design
- Consistent color scheme and typography

### Site B Micro-Interactions
1. Active border on auth fields
2. Inline validation (email/username on register)
3. Password strength ticks
4. CTA hover transition
5. CTA click confirmation
6. Add-to-basket animation + basket count bounce
7. Loading indicator within 100ms
8. Checkout progress indicator
9. Success messages (auth + order confirmation)

## Getting Started

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173

### Build for Production
```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── AuthPage.jsx     # Login/Register page
│   │   └── HomePage.jsx     # Homepage with menu
│   ├── components/          # Reusable components
│   ├── App.jsx             # Main app with routing
│   ├── App.css             # Custom CSS styles
│   ├── index.css           # Tailwind setup + custom vars
│   └── main.jsx            # Entry point
├── public/                  # Static assets
├── vite.config.js          # Vite + Tailwind config
└── package.json
```

## Design System

### Colors
- Primary: `#FF6B35` (Orange)
- Primary Dark: `#E85A2A`
- Secondary: `#4ECDC4` (Teal)
- Accent: `#FFD166` (Yellow)
- Dark: `#2D3047` (Dark Blue)
- Light: `#F7F7F7` (Background)

### Typography
- Font Family: Inter, system-ui, sans-serif
- Responsive font sizes
- Consistent spacing and hierarchy

## A/B Testing Metrics (Planned)

The project is designed to track:
- Task completion times (3 tasks)
- CTA metrics (click rate, misclicks, hesitation)
- User engagement with micro-interactions
- Data saved to Supabase with: `participant_id`, `age_group`, `timestamp`, `task_label`
- CSV export functionality

## Next Steps

1. **Backend Setup**: Node.js + Express API
2. **Supabase Integration**: Database, authentication, real-time updates
3. **Additional Pages**: Restaurant details, order history, profile
4. **Admin Panel**: Restaurant management, order tracking
5. **Payment Integration**: Stripe or similar payment processor
6. **Deployment**: Netlify hosting configuration

## University Requirements Met

- ✅ React + Vite stack
- ✅ Tailwind CSS for styling
- ✅ Mobile responsive design
- ✅ Clean, consistent UI
- ✅ Simple, readable code (uni-level)
- ✅ Clear variable naming
- ✅ No duplicate logic
- ✅ Appropriate comments

## License

University Assignment Project - For educational purposes only.