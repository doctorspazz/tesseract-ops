# Tesseract-Ops · Astro port

Drop the contents of `astro/` into your existing Astro project. The structure
mirrors a default `npm create astro@latest` layout — `src/styles/`,
`src/content/`, `src/components/`, `src/layouts/`, `src/pages/`, plus
`astro.config.mjs` at the project root.

## Install dependencies

```bash
npx astro add mdx
npx astro add astro-expressive-code
```

That's everything beyond a default Astro install. No Tailwind, no UI
framework, no CSS-in-JS — just one stylesheet, Astro components, and MDX.

## File map

```
astro.config.mjs                            ← MDX + expressive-code wiring
src/
  styles/
    global.css                              ← single stylesheet · design tokens
  content/
    config.ts                               ← Zod schema for posts + series
    series/
      building-the-lab.json                 ← series record (JSON)
    posts/
      04-coral-tpu-frigate.mdx              ← full sample post
      03-closet-ups.mdx                     ← frontmatter-only stub
      2026-04-28-letter-to-2024.mdx         ← essay stub (no series)
  components/
    Topbar.astro      Footer.astro
    Tags.astro        Callout.astro
    Placeholder.astro PostHeader.astro
    PostRow.astro     SeriesProgress.astro
  layouts/
    BaseLayout.astro                        ← html shell, fonts, topbar, footer
  pages/
    index.astro                             ← directory-style blog index
    about.astro                             ← two-column about
    404.astro                               ← big-number 404
    posts/
      [...slug].astro                       ← article page
```

## How the design tokens work

Everything visual lives in `src/styles/global.css` as CSS custom properties on
`:root`. Light mode is a single block of overrides under `[data-theme="light"]`.

To switch the whole site to light mode, set the attribute on `<html>` in
`BaseLayout.astro`:

```diff
- <html lang="en" data-theme="dark">
+ <html lang="en" data-theme="light">
```

…or wire a small `<script>` that toggles it based on `localStorage` /
`prefers-color-scheme`. Code blocks stay dark in both modes by design.

To rescale body type, change the one number in `global.css`:

```css
--scale: 1.05;   /* nudge between 0.9 and 1.15 */
```

To swap the signal accent, change `--accent`:

```css
--accent: oklch(76% 0.14 65);    /* amber (current) */
/* --accent: oklch(72% 0.14 210); */  /* cyan */
```

## Writing posts

Posts live in `src/content/posts/*.mdx`. Frontmatter is validated by the Zod
schema in `src/content/config.ts` — if you omit a required field or use the
wrong type, the build fails loudly.

Minimum frontmatter:

```yaml
---
title: "..."
dek: "..."
date: 2026-05-24
readTime: "14m"
kind: "deep-dive"            # deep-dive | essay | changelog | note
tags: ["..."]
---
```

Series posts add two more:

```yaml
series: "building-the-lab"    # references src/content/series/*.json by slug
part: 4
```

The article body uses standard Markdown plus two MDX-only conveniences:

1. **Code blocks** — fenced code with an optional `title=` attribute renders
   with a filename header bar:

   ````md
   ```bash title="/etc/udev/rules.d/99-edgetpu.rules"
   SUBSYSTEM=="usb", ATTRS{idVendor}=="1a6e", GROUP="plugdev"
   ```
   ````

2. **Callouts** — import once at the top of the MDX, then use anywhere:

   ```mdx
   import Callout from '../../components/Callout.astro';

   <Callout type="warn" title="If your fans are still screaming">
     ffmpeg is doing detection in software. Check that…
   </Callout>
   ```

   `type` is `warn | note | tip`.

## H2 auto-numbering

The article body has `counter-reset: h2-c -1` and every `<h2>` gets a
`§ 01`, `§ 02`, … prefix via `::before` — so you write plain Markdown
headings and the numbers just appear:

```md
## The rack         →   § 00  The rack
## The udev tax     →   § 01  The udev tax
```

If you want a heading to NOT be numbered, drop it to `h3` (`###`).

## Adding a hero image

Replace the placeholder for a post by setting `hero:` in frontmatter. Astro's
image service handles optimization automatically:

```yaml
hero: ./images/rack-02.jpg
heroCaption: "Rack 02 · Beelink SER6, USB-Coral…"
```

Put the image next to the MDX file (or anywhere under `src/`). `PostHeader`
swaps the striped placeholder for an `<img>` when `hero` is set.

## Pages already wired

| Route               | Source                          |
|---------------------|---------------------------------|
| `/`                 | `pages/index.astro`             |
| `/posts/<slug>`     | `pages/posts/[...slug].astro`   |
| `/about`            | `pages/about.astro`             |
| 404                 | `pages/404.astro`               |

Routes that still need stubs (the topbar links to them) — easy to add later:

- `/series` — list of series and their posts
- `/series/<id>` — single series timeline
- `/rack` — a static page about the lab hardware
- `/tags/<tag>` — tag archive

## Things consciously left out

- **RSS** — wire with `@astrojs/rss` when you're ready.
- **Filter buttons on the index** — they render but are static. Wire to
  `pages/kinds/<kind>.astro` (or a tiny client-side filter) when you have more
  posts to actually filter.
- **Sitemap** — `npx astro add sitemap`.
- **Search** — Pagefind is the obvious move for a static site.
- **Dark/light toggle UI** — site is dark-first; add a button to the topbar
  when you want it.

## Differences vs. the HTML mockups

- The mockup's "right gutter address column" (the `0016 0032 0048…` strip on
  the article page) was decoration that didn't survive the port — easy to
  add back as a CSS pseudo-element if you miss it.
- Code blocks are rendered by `astro-expressive-code` instead of the
  hand-styled `<pre>` in the JSX mockup. You get filename titles, line
  numbers, and proper syntax highlighting in exchange.
- Inline syntax tinting in YAML/Python (keys, strings) is now Shiki's job.
