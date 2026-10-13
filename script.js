(function () {
  const P = window.PORTFOLIO || {};
  const $ = (id) => document.getElementById(id);

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    github: '<svg viewBox="0 0 24 24" class="fill" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.8 6.1L19.8 6H4.2ZM20 7.6l-7.4 5.8a1 1 0 0 1-1.2 0L4 7.6V18h16V7.6Z"/></svg>',
    resume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V9h5.5L13 3.5ZM8 13v1.5h8V13H8Zm0 3.5V18h8v-1.5H8Z"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>',
  };
  const LABELS = { github: "GitHub", linkedin: "LinkedIn", twitter: "X / Twitter", email: "Email", resume: "Résumé" };

  // ── Header / hero ──
  const firstName = (P.name || "").split(" ")[0];
  $("brand").textContent = P.name || "";
  $("heroRole").textContent = [P.role, P.location].filter(Boolean).join(" · ");
  $("heroName").innerHTML = `Hi, I'm ${esc(firstName || P.name)}.`;
  $("heroTagline").textContent = P.tagline || "";
  document.title = `${P.name} — ${P.role || "Portfolio"}`;

  const links = P.links || {};
  const socialHTML = ["github", "linkedin", "twitter", "email", "resume"]
    .filter((k) => links[k])
    .map((k) => {
      const href = k === "email" ? `mailto:${links[k]}` : links[k];
      const ext = k !== "email" ? ' target="_blank" rel="noopener"' : "";
      return `<li><a href="${esc(href)}"${ext} aria-label="${LABELS[k]}" title="${LABELS[k]}">${ICONS[k]}</a></li>`;
    })
    .join("");
  $("heroSocials").innerHTML = socialHTML;
  $("contactSocials").innerHTML = socialHTML;

  // ── About ──
  $("aboutText").innerHTML = (P.about || []).map((p) => `<p>${esc(p)}</p>`).join("");
  $("skills").innerHTML = (P.skills || [])
    .map(
      (g) =>
        `<div class="skill-group"><h3>${esc(g.group)}</h3><ul class="chips">${g.items
          .map((s) => `<li class="chip">${esc(s)}</li>`)
          .join("")}</ul></div>`
    )
    .join("");

  // ── Projects ──
  const cardHTML = (p) => {
    const actions = [
      p.repo && `<a href="${esc(p.repo)}" target="_blank" rel="noopener" aria-label="Source code">${ICONS.github}</a>`,
      p.demo && `<a href="${esc(p.demo)}" target="_blank" rel="noopener" aria-label="Live site">${ICONS.external}</a>`,
    ]
      .filter(Boolean)
      .join("");
    const meta = p.stars != null
      ? `<div class="meta"><span>★ ${p.stars}</span>${p.updated ? `<span>Updated ${esc(p.updated)}</span>` : ""}</div>`
      : "";
    return `<article class="card reveal">
      <div class="card-top"><span class="card-icon">${ICONS.folder}</span><div class="card-links">${actions}</div></div>
      ${p.featured ? '<span class="badge">Featured</span>' : ""}
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description || "No description yet.")}</p>
      <ul class="tags">${(p.tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      ${meta}
    </article>`;
  };

  const cards = $("projectCards");
  const featured = (P.featured || []).map((p) => ({ ...p, featured: true }));
  cards.innerHTML = featured.map(cardHTML).join("");

  const gh = P.githubRepos || {};
  if (gh.enabled && gh.username) {
    const status = $("repoStatus");
    const exclude = new Set((gh.exclude || []).map((s) => s.toLowerCase()));
    // Cache the API response for an hour; fall back to a stale copy if rate-limited.
    const cacheKey = `gh-repos:${gh.username}`;
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(cacheKey)); } catch (e) {}
    const fresh = cached && Date.now() - cached.t < 3600e3;
    (fresh
      ? Promise.resolve(cached.data)
      : fetch(`https://api.github.com/users/${encodeURIComponent(gh.username)}/repos?sort=updated&per_page=100`)
          .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
          .then((data) => {
            try { localStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), data })); } catch (e) {}
            return data;
          })
          .catch((err) => (cached ? cached.data : Promise.reject(err)))
    )
      .then((repos) => {
        const list = repos
          .filter((r) => !r.fork && !r.archived && !exclude.has(r.name.toLowerCase()))
          .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, gh.max || 6)
          .map((r) => ({
            title: r.name.replace(/[-_]/g, " "),
            description: r.description,
            tags: [r.language, ...(r.topics || []).slice(0, 3)].filter(Boolean),
            repo: r.html_url,
            demo: r.homepage || "",
            stars: r.stargazers_count,
            updated: new Date(r.pushed_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }),
          }));
        if (list.length) {
          cards.insertAdjacentHTML("beforeend", list.map(cardHTML).join(""));
          observeReveals();
        }
        if (!list.length && !featured.length) {
          status.hidden = false;
          status.textContent = "Projects coming soon.";
        }
      })
      .catch(() => {
        if (!featured.length) {
          status.hidden = false;
          status.innerHTML = `See my work on <a href="https://github.com/${esc(gh.username)}" target="_blank" rel="noopener">GitHub</a>.`;
        }
      });
  }

  // ── Experience (hidden when empty) ──
  const exp = P.experience || [];
  if (exp.length) {
    $("timeline").innerHTML = exp
      .map(
        (e) => `<li class="reveal">
        <h3>${esc(e.role)} <span class="org">· ${esc(e.org)}</span></h3>
        <p class="period">${esc(e.period)}</p>
        ${e.points && e.points.length ? `<ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      </li>`
      )
      .join("");
  } else {
    $("experience").remove();
    document.querySelector('[data-section="experience"]')?.remove();
    $("contactNum").textContent = "03";
  }

  // ── Contact ──
  if (links.email) {
    $("contactEmail").href = `mailto:${links.email}`;
  } else {
    $("contactEmail").remove();
  }

  $("year").textContent = new Date().getFullYear();
  $("footerName").textContent = P.name || "";

  // ── Theme toggle ──
  $("themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ── Reveal on scroll ──
  let io;
  function observeReveals() {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
    io = io || new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }
  document.querySelectorAll(".section-title, .about-grid, .contact .lede").forEach((el) => el.classList.add("reveal"));
  observeReveals();
})();
