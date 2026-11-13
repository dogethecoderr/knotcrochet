// The catalogue and the cart maths, kept free of the page so `node --test` can check them.
// Prices are whole cents so totals never pick up floating-point error.
// Keep these in step with the names and prices written in shop.html.
export const PRODUCTS = {
  handbag: { name: 'Checkered handbag', cents: 1500, img: 'images/checkered-handbag.jpg' },
  turtle: { name: 'Turtle', cents: 800, img: 'images/turtle.jpg' },
  scrunchie: { name: 'Scrunchie', cents: 500, img: 'images/scrunchie.jpg' },
  cat: { name: 'Mini Loaf Cat', cents: 800, img: 'images/mini-loaf-cat.jpg' },
  strawberry: { name: 'Red Strawberry Keychain', cents: 500, img: 'images/red-strawberry-keychain.jpg' },
};

export const MAX_EACH = 10;

export const money = (cents) => '$' + (cents % 100 ? (cents / 100).toFixed(2) : cents / 100);

// Whatever comes out of browser storage is untrusted: keep only known items
// with a whole quantity from 1 to MAX_EACH.
export function clean(raw) {
  const cart = {};
  if (!raw || typeof raw !== 'object') return cart;
  for (const id of Object.keys(PRODUCTS)) {
    const n = Number(raw[id]);
    if (Number.isInteger(n) && n >= 1) cart[id] = Math.min(n, MAX_EACH);
  }
  return cart;
}

export const count = (cart) => Object.values(cart).reduce((sum, n) => sum + n, 0);

export const total = (cart) => Object.entries(cart).reduce((sum, [id, n]) => sum + n * PRODUCTS[id].cents, 0);
