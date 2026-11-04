# Jermaine Dayrit · Portfolio

React + Vite single-page portfolio.

## Edit content
Everything on the page comes from `src/data.js` (profile, experience, projects, skills).
Any value starting with `TODO:` shows on the page as a highlighted placeholder until replaced.

## Run
```bash
npm install
npm run dev      # local dev server
npm run build    # static site in dist/ (deploy anywhere: Netlify, Vercel, GitHub Pages)
```

## Structure
- `src/App.jsx`: page sections (hero, experience, projects, skills, contact)
- `src/components/`: `Section` heading wrapper, `Text` placeholder renderer
- `src/index.css`: theme tokens (dark default, light toggle) and styles
