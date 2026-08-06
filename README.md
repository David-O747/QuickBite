# QuickBite

Food ordering site made for my usability dissertation.

There are two versions of the same site:
- **Version B** has micro-interactions
- **Version A** is the same site but without them

## Links

- GitHub: https://github.com/David-O747/QuickBite
- Version B: https://quickestbites.netlify.app
- Version A: https://quickbites2.netlify.app
- API: https://quickbite-35e2.onrender.com

## Testing links

Participants need a `participant_id` and `age_group` in the URL.

Age groups used: `18-25` and `65+`

Version B examples:
```
https://quickestbites.netlify.app/?participant_id=P001&age_group=65+
https://quickestbites.netlify.app/?participant_id=P016&age_group=18-25
```

Version A examples:
```
https://quickbites2.netlify.app/?participant_id=P011&age_group=65+
https://quickbites2.netlify.app/?participant_id=P006&age_group=18-25
```

Just change the ID / age group for each person.

If the API is asleep, open this first and wait until it says ok:  
https://quickbite-35e2.onrender.com/api/health

## What it does

Users can:
- browse restaurants
- add food to the basket
- check out
- track the order

The site also times 3 study tasks:
1. find a product (home → menu)
2. add to basket (menu → add item)
3. finish checkout (basket → confirmation)

Times are saved in Supabase in milliseconds.

## Tech

- Frontend: React + Vite (Netlify)
- Backend: Node / Express (Render)
- Database: Supabase

## Run locally

Backend:
```bash
cd backend
npm install
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

You need `.env` files in `backend` and `frontend` with the Supabase / API values.

For Version A or B, set:
```
VITE_SITE_VERSION=A
```
or
```
VITE_SITE_VERSION=B
```

## Folders

```
frontend/   website
backend/    API
supabase/   database setup
exports/    cleaned study data
```
