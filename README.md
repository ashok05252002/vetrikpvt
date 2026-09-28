# Vetrik Private Limited — Website

Company website for **Vetrik Private Limited** — *Turning vision to mission.*

A white-first, animation-rich static site. No build step and no dependencies: open `index.html` in a browser, or deploy the folder to any static host (GitHub Pages, Netlify, Vercel, cPanel, …).

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — hero, products showcase, why Vetrik, process, industries |
| `billing-software.html` | Billing & POS Software |
| `haccp-software.html` | HACCP Food Safety Software |
| `ecommerce-website.html` | E-commerce Website |
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

- Phone number `+91 00000 00000`, WhatsApp link `wa.me/910000000000`, email `hello@vetrik.in` and office address (header/footer of every page + `contact.html`)
- The contact form currently opens the visitor's email app (`mailto:`). Connect it to a form backend (e.g. Formspree, your own API) to receive enquiries directly.
- **Client logos** (home page carousel) are placeholders in `assets/img/clients/client-01.svg` … `client-08.svg`. Replace each file with the real logo (keep the same name), or change the `src`/`alt` in the "CLIENTS" section of `index.html` (e.g. to `.png` files). Logos show in grey and turn full colour on hover. Transparent-background PNG or SVG works best.
- Product mockups are HTML/CSS illustrations — they can be swapped for real screenshots later.

## Assets

- `assets/img/logo-*.png` — transparent versions of the logo for light (`dark-text`) and dark (`white-text`) backgrounds
- `assets/img/mark.png` — logo mark only; `favicon.png`
