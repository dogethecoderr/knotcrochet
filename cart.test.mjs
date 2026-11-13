// Run with: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { clean, count, total, money, MAX_EACH } from './cart.js';

test('totals add up in whole cents', () => {
  const cart = clean({ handbag: 1, turtle: 2, scrunchie: 3 });
  assert.equal(count(cart), 6);
  assert.equal(total(cart), 1500 + 2 * 800 + 3 * 500);
  assert.equal(money(total(cart)), '$46');
  assert.equal(money(1250), '$12.50');
});

test('bad stored data is dropped, not trusted', () => {
  assert.deepEqual(clean(null), {});
  assert.deepEqual(clean('nope'), {});
  assert.deepEqual(clean({ turtle: -3, handbag: 1.5, scrunchie: 'x', unicorn: 2 }), {});
  assert.deepEqual(clean({ turtle: 999 }), { turtle: MAX_EACH });
  assert.equal(total(clean({})), 0);
});
