import { PRODUCTS, MAX_EACH, money, clean, count, total } from './cart.js';

// Cart. It lives in this browser only; nothing is sent anywhere and nothing is charged.
const CART_KEY = 'kc-cart';
const readCart = () => { try { return clean(JSON.parse(localStorage.getItem(CART_KEY))); } catch { return {}; } };
let cart = readCart();
const lines = document.getElementById('cart-lines');

function showCart() {
  const n = count(cart);
  document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = n; });
  if (!lines) return;
  const template = document.getElementById('cart-line');
  lines.replaceChildren(...Object.entries(cart).map(([id, qty]) => {
    const product = PRODUCTS[id];
    const li = template.content.firstElementChild.cloneNode(true);
    const img = new Image(48, 48);
    img.className = 'line__img';
    img.alt = '';
    img.src = product.img;
    li.prepend(img);
    li.querySelector('[data-name]').textContent = product.name;
    li.querySelector('[data-each]').textContent = money(product.cents) + ' each';
    li.querySelector('[data-qty]').textContent = qty;
    li.querySelector('[data-sum]').textContent = money(qty * product.cents);
    li.querySelectorAll('button').forEach((btn) => {
      btn.dataset.id = id;
      btn.setAttribute('aria-label', `${btn.dataset.label}: ${product.name}`);
    });
    li.querySelector('[data-act="inc"]').disabled = qty >= MAX_EACH;
    return li;
  }));
  document.getElementById('cart-empty').hidden = n > 0;
  document.getElementById('cart-full').hidden = n === 0;
  document.getElementById('cart-items').textContent = n;
  document.getElementById('cart-total').textContent = money(total(cart));
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* private mode: the cart lasts this page only */ }
  showCart();
}

document.querySelectorAll('[data-add]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.add;
    const status = document.getElementById(btn.getAttribute('aria-describedby'));
    if ((cart[id] || 0) >= MAX_EACH) { status.textContent = `You already have ${MAX_EACH} in your cart, the most per order.`; return; }
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    status.textContent = `Added. You have ${cart[id]} in your cart.`;
    // A small pulse on the View cart button so the change is noticed. Restart it on every add.
    const fab = document.querySelector('.cartfab');
    if (fab) { fab.classList.remove('is-bumped'); void fab.offsetWidth; fab.classList.add('is-bumped'); }
  });
});

if (lines) {
  lines.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-act]');
    if (!btn) return;
    const { id, act } = btn.dataset;
    const qty = cart[id] || 0;
    if (act === 'inc') cart[id] = Math.min(qty + 1, MAX_EACH);
    else if (act === 'dec' && qty > 1) cart[id] = qty - 1;
    else delete cart[id];
    saveCart();
    // The list was rebuilt, so put keyboard focus back where it was (or somewhere sensible).
    const next = lines.querySelector(`button[data-act="${act}"][data-id="${id}"]:not(:disabled)`)
      || lines.querySelector(`button[data-id="${id}"]:not(:disabled)`)
      || lines.querySelector('button')
      || document.getElementById('cart-empty-link');
    next.focus();
  });
  document.querySelector('[data-checkout]').addEventListener('click', () => {
    document.getElementById('checkout-status').textContent = 'Online checkout is not open yet. Nothing was ordered or charged.';
  });
}

// Another tab changed the cart: follow it.
addEventListener('storage', (event) => { if (event.key === CART_KEY) { cart = readCart(); showCart(); } });
showCart();

// Hero: a line of chain stitches runs out of a ball of yarn, with a loop at three corners and a gentle
// wave along each side, drawn once by a crochet hook that stops just short of the ball. The path is built in real pixels so the loops stay round at any size.
// Without scripts the plain frame written in the HTML shows instead.
const yarn = document.querySelector('.yarn');
const hook = document.querySelector('.hook');
if (yarn && hook) {
  const NS = 'http://www.w3.org/2000/svg';
  const stitches = yarn.querySelector('path');
  const mask = document.createElementNS(NS, 'mask');
  const reveal = document.createElementNS(NS, 'path');
  mask.id = 'yarn-mask';
  mask.setAttribute('maskUnits', 'userSpaceOnUse');
  reveal.setAttribute('class', 'yarn__reveal');
  mask.append(reveal);
  yarn.prepend(mask);
  yarn.removeAttribute('preserveAspectRatio');
  stitches.setAttribute('mask', 'url(#yarn-mask)');
  const ball = document.createElementNS(NS, 'g');
  ball.setAttribute('class', 'yarn__ball');
  yarn.append(ball);

  let length = 0, end = null, mid = null, shown = 0;

  // A wavy edge from a to b: bumps about 70px long that alternate sides.
  const wave = (ax, ay, bx, by, amp) => {
    const dist = Math.hypot(bx - ax, by - ay);
    const n = Math.max(2, Math.round(dist / 70));
    const ux = (bx - ax) / n, uy = (by - ay) / n, step = dist / n;
    let d = ` Q${ax + ux / 2 + (uy / step) * amp * 2} ${ay + uy / 2 - (ux / step) * amp * 2} ${ax + ux} ${ay + uy}`;
    for (let k = 2; k <= n; k++) d += ` T${ax + ux * k} ${ay + uy * k}`;
    return d;
  };

  const build = () => {
    const { width: w, height: h } = yarn.getBoundingClientRect();
    const r = w < 420 ? 8 : 12;           // loop radius
    const pad = 2 * r + 4;                // the loops reach 2r outside the frame
    const L = pad, T = pad, R = w - pad, B = h - pad, amp = r / 3;
    const loop = (x, y) => ` A${r} ${r} 0 1 0 ${x} ${y}`;   // three quarters of a circle, crossing its own line
    const br = r * 1.4;                   // the ball sits on the bottom-right corner
    const d = `M${R - br} ${B}` + wave(R - br, B, L - r, B, amp) + loop(L, B + r)
      + wave(L, B + r, L, T - r, amp) + loop(L - r, T)
      + wave(L - r, T, R + r, T, amp) + loop(R, T - r)
      + wave(R, T - r, R, B - br - 34, amp);
    // The ball: a disc with three strands wound across it.
    const strand = (x1, y1, cx, cy, x2, y2) => `<path d="M${R + x1 * br} ${B + y1 * br} Q${R + cx * br} ${B + cy * br} ${R + x2 * br} ${B + y2 * br}"/>`;
    ball.innerHTML = `<circle cx="${R}" cy="${B}" r="${br}"/>`
      + strand(-0.9, -0.35, 0, 0.25, 0.9, -0.35) + strand(-0.95, 0.2, 0, 0.8, 0.95, 0.2) + strand(-0.35, -0.9, 0.35, 0, -0.2, 0.95);
    yarn.setAttribute('viewBox', `0 0 ${w} ${h}`);
    for (const [k, v] of [['x', 0], ['y', 0], ['width', w], ['height', h]]) mask.setAttribute(k, v);
    stitches.setAttribute('d', d);
    reveal.setAttribute('d', d);
    length = stitches.getTotalLength();
    end = stitches.getPointAtLength(length);
    mid = { x: w / 2, y: h / 2 };
    reveal.style.strokeDasharray = length;
    hook.style.left = end.x + 'px';
    hook.style.top = end.y + 'px';
  };

  // Show the line up to a fraction of its length, with the hook at the tip, handle pointing away from the words.
  const draw = (fraction) => {
    const p = stitches.getPointAtLength(length * fraction);
    reveal.style.strokeDashoffset = length * (1 - fraction);
    hook.style.setProperty('--hx', p.x - end.x + 'px');
    hook.style.setProperty('--hy', p.y - end.y + 'px');
    hook.style.setProperty('--hr', Math.atan2(p.x - mid.x, mid.y - p.y) * 180 / Math.PI + 'deg');
  };

  const show = (fraction) => { shown = fraction; draw(fraction); };
  build();
  show(0);
  // The headline's size changes whenever its box does: when the web font arrives on a first visit,
  // or when the window is resized. Rebuild the frame to fit at once, mid-drawing or after.
  new ResizeObserver(() => { build(); draw(shown); }).observe(yarn);

  // When the frame is done, a stitched underline runs along the sentence beneath it.
  const underline = () => document.querySelector('.lead__stitch')?.classList.add('is-drawn');

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { show(1); underline(); }
  else {
    // Start drawing once the headline font is in (or after 2.5s if it never comes), so the frame isn't sized to the stand-in font.
    const fontIn = document.fonts.load('600 1em "Cormorant Garamond"').catch(() => {});
    Promise.race([fontIn, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      const begin = performance.now() + 300;
      const step = (now) => {
        const t = Math.min(Math.max((now - begin) / 3400, 0), 1);
        show(t * t * (3 - 2 * t));
        if (t < 1) requestAnimationFrame(step); else underline();
      };
      requestAnimationFrame(step);
    });
  }
}

// Links to a section of this page glide there and frame its content: centred when it fits the window,
// otherwise starting just under the top edge. The same framing applies when arriving from another page.
function frame(section, smooth) {
  const box = (section.querySelector('.container') || section).getBoundingClientRect();
  const spare = innerHeight - box.height;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollTo({ top: scrollY + box.top - (spare > 48 ? spare / 2 : 24), behavior: smooth && !calm ? 'smooth' : 'instant' });
}
document.querySelectorAll('.nav a[href^="#"], .hero__actions a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    frame(target, true);
  });
});
addEventListener('load', () => {
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target && target.matches('section, body')) frame(target, false);
});

// Cookie choice. Optional scripts stay inert until the visitor opts in. To add one later, write it as
//   <script type="text/plain" data-consent="analytics" data-src="https://..."></script>
// and add its host to the Content-Security-Policy (the <meta> in each page and the _headers file).
const KEY = 'kc-consent';
const banner = document.getElementById('consent');
const prefs = document.getElementById('prefs');
const box = document.getElementById('prefs-analytics');

const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };

function apply(choice) {
  if (!choice || !choice.analytics) return;
  document.querySelectorAll('script[type="text/plain"][data-consent="analytics"]').forEach((inert) => {
    const live = document.createElement('script');
    live.src = inert.dataset.src;
    live.dataset.consentLive = '';
    inert.replaceWith(live);
  });
}

function save(analytics) {
  const choice = { analytics, at: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch { /* private mode: the choice lasts this page only */ }
  banner.hidden = true;
  if (prefs.open) prefs.close();
  // Turning optional scripts off cannot unload ones already running, so start clean.
  if (!analytics && document.querySelector('script[data-consent-live]')) location.reload();
  apply(choice);
}

const saved = read();
if (saved) apply(saved); else banner.hidden = false;

document.querySelectorAll('[data-consent-accept]').forEach((b) => b.addEventListener('click', () => save(true)));
document.querySelectorAll('[data-consent-reject]').forEach((b) => b.addEventListener('click', () => save(false)));
document.querySelectorAll('[data-consent-open]').forEach((b) => b.addEventListener('click', () => {
  const now = read();
  box.checked = !!(now && now.analytics);
  prefs.showModal();
}));
document.getElementById('prefs-save').addEventListener('click', () => save(box.checked));
