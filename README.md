# Knot Crochet Co.

The website for **Knot Crochet Co.**, a small handmade crochet shop: checkered handbags, turtle plushies, loaf cats, strawberry keychains and scrunchies, each made by hand.

It is a plain static site (HTML, CSS and a little JavaScript) with no build step, no framework and no server code.

## What's on it

- **Home** (`index.html`): a hero where a crochet hook stitches a frame around the headline, a row of the creations, the about section and upcoming events with a Google Maps link.
- **Shop** (`shop.html`): every item with its photo, price, description and an *Add to cart* button.
- **Cart** (`cart.html`): quantities, a running total and a checkout button. The cart is saved in the visitor's own browser. **Checkout is a placeholder: no orders are taken and no payments are made yet.**
- **Policies**: privacy, terms, cookies, copyright (DMCA), disclaimer and accessibility pages, linked from every footer, plus a cookie-choice banner.

## Run it locally

The scripts are JavaScript modules, which browsers won't load from a double-clicked file, so serve the folder:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Test

The cart maths (totals, and ignoring bad data saved in the browser) has a small test, run with Node:

```bash
node --test
```

## Common changes

### Add a new item

1. Put a square photo in `images/` (JPEG, around 1000px wide), named in kebab-case, e.g. `images/bunny-plushie.jpg`.
2. **`shop.html`**: copy one `<article class="item">` block and change its `id`, photo, name, price, description, and the `data-add` and `aria-describedby` values on the button.
3. **`cart.js`**: add a line to `PRODUCTS` using the same id, with the name, the price in cents (`800` is $8) and the photo path.
4. **`index.html`** (optional): add it to the *My creations* gallery and to the rotating hero photos. The hero fade timing in `styles.css` (`.slides`) is set for five photos.

### Change a price

Prices live in two places that must match: the item in `shop.html` and its `cents` value in `cart.js`.

### Update the event

The event lives in the `#events` section of `index.html`. Change or remove it once the date has passed, since the page will keep calling it upcoming.

## Before going live

The policy pages contain placeholders in square brackets that need real details:

| Placeholder | Where |
| --- | --- |
| `[CONTACT EMAIL]` | home page and every policy page |
| `[OPERATOR LEGAL NAME]` | privacy, terms (the adult responsible for the site) |
| `[HOSTING PROVIDER]` | privacy |
| `[RETENTION PERIOD]` | privacy |
| `[JURISDICTION]` | terms |
| `[DMCA AGENT NAME]`, `[MAILING ADDRESS]` | copyright |

Have the policies looked over by an adult (ideally someone with legal knowledge) before taking real orders, especially once payments are added.

## Hosting

Any static host works. Two notes:

- **Security headers** are in `_headers`, which Netlify and Cloudflare Pages read. GitHub Pages ignores that file; there, only the Content-Security-Policy written into each page applies.
- **Adding a script or service** (analytics, payments, embeds) means adding its address to the Content-Security-Policy in each page and in `_headers`, or the browser will block it. Optional tracking scripts should also go through the cookie banner (see the note at the top of the cookie section in `site.js`).

## Files

| Path | What it is |
| --- | --- |
| `index.html`, `shop.html`, `cart.html` | the three main pages |
| `privacy.html`, `terms.html`, `cookies.html`, `dmca.html`, `disclaimer.html`, `accessibility.html` | policy pages |
| `tokens.css` | colours, fonts and spacing in one place |
| `base.css` | shared base styles |
| `styles.css` | the site's styles |
| `legal.css` | styles for the policy pages |
| `site.js` | cart, hero animation, smooth scrolling and the cookie banner |
| `cart.js`, `cart.test.mjs` | the product list, the cart maths and its test |
| `images/` | product photos and the about-me photo |
| `_headers` | security headers for Netlify or Cloudflare Pages |
