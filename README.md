# People

Local React workspace for people operations: sign in, dashboard, attendance, leave, team pages, and master settings.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Sign in

- Paste a **bearer token**, or
- Use **work email** and **password**

All routes are protected. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` for your backend.

## Pages

- `/login` — sign in
- `/forgot-password` — reset request
- `/dashboard` — home
- `/break` `/attendance` `/regularization` `/wfh` `/shift` `/overtime` `/leave`
- `/team` `/approvals`
- `/employees` `/holidays` `/profile`
- `/masters` — organisation master lists

Leave and punch submit forms stay on-screen only unless you wire them to your API.
