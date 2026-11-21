import test from 'node:test';
import assert from 'node:assert/strict';
import { addBase, removeBase } from './basePath.ts';

const REPO = '/SKYLARK-STAR-LOGISTICS/';

test('adds the base folder to site paths', () => {
  assert.equal(addBase('/', '/services'), '/services');
  assert.equal(addBase(REPO, '/services'), '/SKYLARK-STAR-LOGISTICS/services');
  assert.equal(addBase(REPO, '/'), '/SKYLARK-STAR-LOGISTICS/');
  assert.equal(addBase(REPO, '/images/a.jpg'), '/SKYLARK-STAR-LOGISTICS/images/a.jpg');
  assert.equal(addBase(REPO, 'https://example.com/x'), 'https://example.com/x');
  assert.equal(addBase(REPO, 'mailto:a@b.com'), 'mailto:a@b.com');
});

test('removes the base folder from the browser path', () => {
  assert.equal(removeBase('/', '/services'), '/services');
  assert.equal(removeBase(REPO, '/SKYLARK-STAR-LOGISTICS/services'), '/services');
  assert.equal(removeBase(REPO, '/SKYLARK-STAR-LOGISTICS/'), '/');
  assert.equal(removeBase(REPO, '/SKYLARK-STAR-LOGISTICS'), '/');
  assert.equal(removeBase(REPO, '/other'), '/other');
});
