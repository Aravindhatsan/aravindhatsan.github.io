# aravindhatsan.github.io

My personal portfolio site, served by GitHub Pages at **https://aravindhatsan.github.io**.

It's plain HTML, CSS and JavaScript, so there's no build step.

## Editing content

Everything on the page comes from **`content.js`**. That's where you set your name, role, tagline, about text, links, skills, featured projects and experience.
- Fields you leave empty are hidden. If `experience` is empty, that whole section disappears.
- Public GitHub repos are pulled in live (see `githubRepos`). Forks and archived repos are skipped.
- To add a résumé, put `resume.pdf` in the repo root and set `links.resume: "resume.pdf"`.

## Running locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

| File         | Purpose                                     |
|--------------|---------------------------------------------|
| `index.html` | Page structure                              |
| `content.js` | **Your content.** Edit this one             |
| `styles.css` | Styling, light/dark themes                  |
| `script.js`  | Rendering, GitHub repo fetch, theme toggle  |
