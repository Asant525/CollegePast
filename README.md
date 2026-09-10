# CollegePast

A modern, mobile-first, frontend-only static website for College of Education past examination questions in Ghana.

## Features
- Home page with search, latest questions and six mentoring-university categories
- Guided 5-step browsing flow
- Course directory
- Search with level/course/year/semester/university filters
- University question page
- Dedicated PDF viewer page
- Empty states for unavailable papers
- Responsive mobile/tablet/desktop layout
- No login, backend, database, payments or admin dashboard

## Adding PDFs

Place PDF files using this pattern:

`questions/level-200/ict/2025-2026/first-semester/university-1.pdf`

The frontend expects:
- `level-100` through `level-400`
- course folder using the course `id` from `assets/js/data.js`
- academic year using hyphens
- semester folder using lowercase hyphenated text
- university filename such as `university-1.pdf`

Then add or update the matching object in `questions` inside `assets/js/data.js`.

## Replacing University Placeholder Names

Edit the `universities` array in:

`assets/js/data.js`

For example, change:

`{id:"university-1", name:"University 1", ...}`

to the official mentoring university name. The IDs should remain unchanged so existing file paths keep working.

## Run locally

Because this is a static site, you can open `index.html` directly in a browser. For the best local development experience, use VS Code with a simple Live Server extension.

No server-side code is required.
