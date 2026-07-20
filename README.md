# Meeting Companion

An elegant, local-first meeting companion for organizing agendas, tracking action items, and exporting briefs.

## Features

- **Local-First**: All data is saved automatically to your browser's local storage. No cloud required.
- **Meeting Timer**: Built-in timer with audio cues (5 minutes and 30 seconds remaining).
- **Agenda Editor**: Simple text editor with adjustable font size and Markdown heading support.
- **Action Items**: Track action items, assign owners, and set deadlines.
- **Export Options**: 
  - Copy as Markdown
  - Export to PDF
  - Download as Markdown (GenAI ready)
- **Organization**: Custom colored ribbons for meeting tabs and title obfuscation for privacy.

## Development

This project is built with React, Vite, and Tailwind CSS.

### Setup

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

The built assets will be located in the `dist` folder.

## Deployment

### Cloudflare Pages

This app is fully compatible with Cloudflare Pages as a static site.

1. Connect your GitHub repository to Cloudflare Pages.
2. Set the **Framework preset** to `Vite` (or None).
3. Set the **Build command** to `npm run build`.
4. Set the **Build output directory** to `dist`.

A `public/_redirects` file is included to handle client-side routing if you decide to add React Router in the future.

### GitHub Pages

To deploy to GitHub Pages, you can use the `gh-pages` package or GitHub Actions. 
Note: If deploying to a subdirectory (e.g., `https://username.github.io/repo-name/`), you may need to update the `base` path in `vite.config.ts`.
