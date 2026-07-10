# QuickBite Deployment Guide

This guide covers deployment options for both frontend and backend components.

## Frontend Deployment (Netlify)

### Option 1: Netlify Drag & Drop
1. Build the frontend: `cd frontend && npm run build`
2. Drag the `dist` folder to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18.x

### Option 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from frontend directory
cd frontend
netlify deploy --prod
```

### Option 3: Connect GitHub Repository
1. Push code to GitHub
2. Connect repository in Netlify dashboard
3. Configure automatic deployments

### Environment Variables for Frontend
Set these in Netlify dashboard:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=https://your-backend-api.com
VITE_SITE_VERSION=B
```

## Backend Deployment

### Option 1: Railway.app
1. Create new project in Railway
2. Connect GitHub repository or upload code
3. Configure environment variables
4. Deploy automatically

### Option 2: Render.com
1. Create new Web Service
2. Connect repository
3. Build command: `npm install && npm start`
4. Set environment variables

### Option 3: Heroku
```bash
# Create Heroku app
heroku create quickbite-backend

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key

# Deploy
git push heroku main
```

### Backend Environment Variables
```
PORT=3000
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
CORS_ORIGIN=https://your-frontend-domain.com
```

## Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### 2. Database Schema
Run the following SQL in Supabase SQL editor:

```sql
-- Users table for authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Analytics table for A/B testing
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id VARCHAR(100),
  age_group VARCHAR(20),
  timestamp TIMESTAMP DEFAULT NOW(),
  task_label VARCHAR(50),
  site_version VARCHAR(1), -- 'A' or 'B'
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  image_url TEXT,
  popular BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true
);
```

### 3. Enable Row Level Security (RLS)
Enable RLS on each table and create policies as needed.

## Domain Configuration

### Custom Domain (Optional)
1. Purchase domain from registrar
2. Add custom domain in Netlify/Render
3. Configure DNS records:
   - A record for frontend (Netlify IP)
   - CNAME for backend API

### SSL Certificates
- Netlify: Automatic SSL via Let's Encrypt
- Render: Automatic SSL
- Railway: Automatic SSL

## Monitoring & Analytics

### Frontend Analytics
- Netlify Analytics for traffic
- Custom A/B test tracking in Supabase
- Error tracking with Sentry (optional)

### Backend Monitoring
- Railway/Render dashboard for logs
- Uptime monitoring with UptimeRobot
- Error tracking

## Continuous Deployment

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm ci && npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --dir=frontend/dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd backend && npm ci
      - uses: railway/action@v1
        with:
          service: backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Cost Estimation

### Free Tier Options
- **Netlify**: Free for frontend hosting
- **Render**: Free tier for backend
- **Railway**: Free credits monthly
- **Supabase**: Free tier with limitations

### Production Scaling
- Netlify Pro: $19/month
- Render Pro: $7+/month
- Supabase Pro: $25/month
- Custom domain: $10-15/year

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS origin includes frontend domain
   - Check environment variables

2. **Environment Variables Not Loading**
   - Verify variable names match code
   - Restart deployment after changes
   - Check for typos

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Check build logs for specific errors

4. **Database Connection Issues**
   - Verify Supabase URL and key
   - Check network access from hosting platform
   - Verify SSL certificate validity

### Support Resources
- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)

## Security Considerations

1. **Environment Variables**: Never commit secrets
2. **CORS**: Restrict origins to known domains
3. **Database**: Use RLS policies in Supabase
4. **API Keys**: Rotate regularly, use least privilege
5. **Dependencies**: Keep updated, audit for vulnerabilities

## Performance Optimization

### Frontend
- Enable code splitting in Vite
- Optimize images
- Implement lazy loading
- Use CDN for assets

### Backend
- Implement caching
- Database query optimization
- Connection pooling
- Load balancing (if needed)

---

**Last Updated**: June 2024  
**Project Status**: Ready for deployment