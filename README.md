# Vetrik Private Limited — Website

Company website for **Vetrik Private Limited** — *Turning vision to mission.*

A white-first, animation-rich static site. No build step and no dependencies: open `index.html` in a browser, or deploy the folder to any static host (GitHub Pages, Netlify, Vercel, cPanel, …).

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: story-led hero, client logos, products, journey teaser, why Vetrik, process, industries |
| `about.html` | About us: our journey from 2024 told as a scroll story (7 chapters) |
| `billing-software.html` | Billing & POS Software |
| `haccp-software.html` | HACCP Food Safety Software |
| `ecommerce-website.html` | E-commerce Website |
| `food-delivery-app.html` | Food Delivery App (customer app, rider app, admin portal — Home2Local) |
| `custom-software.html` | Custom Software Development |
| `contact.html` | Contact / Book a demo (supports `?product=Billing` etc. to pre-select) |

## Animations (all in `assets/js/main.js`, vanilla JS)

- Word-by-word headline reveals and scroll-triggered fade/slide/scale reveals
- Hero dashboard that tilts flat in 3D as you scroll, with parallax floating cards
- Scroll-lit statement text (words light up as you scroll)
- Pinned **horizontal product scroller** on the home page
- Stacking sticky cards ("Why Vetrik")
- Timeline whose progress line fills as you scroll
- Sticky **scroll-storytelling** on product pages (screens change with each step)
- Animated counters, chart bars and line charts, magnetic buttons, card spotlight, page transitions
- Respects `prefers-reduced-motion`; mobile-friendly layouts throughout

## Things to update before going live

- Contact details: email `support@vetrik.in`, phone and WhatsApp `+91 63826 25776` (footer of every page + `contact.html`). The office address still says "Tamil Nadu, India"; add the full address when ready.
- The contact form currently opens the visitor's email app (`mailto:`). Connect it to a form backend (e.g. Formspree, your own API) to receive enquiries directly.
- **Client logos** appear as a logo wall (one card per client with a short "what we did" caption) on the home and About pages. Files are in `assets/img/clients/` (1000 Vibes, CCD, Thenkadal Meenavan, Tulasi Foundation) plus `assets/img/home2local-logo.png`. To add a client, copy one `<li class="client">` in the CLIENTS section of `index.html` and `about.html`.
- Product mockups are HTML/CSS illustrations — they can be swapped for real screenshots later.

## Assets

- `assets/img/screens/` — real product screenshots (billing dashboard with the Vetrik logo, Home2Local delivery admin portal, Chef2Comply HACCP dashboard)
- `assets/img/home2local-logo.png` — Home2Local logo

- `assets/img/logo-*.png` — transparent versions of the logo for light (`dark-text`) and dark (`white-text`) backgrounds
- `assets/img/mark.png` — logo mark only; `favicon.png`
