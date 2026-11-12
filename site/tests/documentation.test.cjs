const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const collections = ['ai', 'cloud', 'country', 'energy', 'equipment', 'facility', 'factor', 'mix', 'transport'];

test('website reference files are exact source copies and their public links resolve', () => {
  const base = 'https://digital4better.github.io/data/';
  const dist = path.join(root, 'site/dist');
  const files = ['llms.txt', 'llms-full.txt', ...collections.map(c => c + '/README.md')];
  for (const file of files) {
    const source = path.join(root, file.startsWith('llms') ? 'site' : 'data', file);
    const built = fs.readFileSync(path.join(dist, file), 'utf8');
    assert.equal(built, fs.readFileSync(source, 'utf8'), file);
    for (const [, link] of built.matchAll(/\]\(([^)]+)\)/g)) {
      const url = new URL(link, base + file);
      if (!url.href.startsWith(base)) continue;
      const target = path.join(dist, decodeURIComponent(url.pathname.slice('/data/'.length)));
      assert.ok(fs.existsSync(target), file + ': ' + link);
      if (url.hash && /\.(md|txt)$/.test(target)) {
        const headings = [...fs.readFileSync(target, 'utf8').matchAll(/^#{1,6} (.+)$/gm)]
          .map(match => match[1].toLowerCase().replace(/[^\w\s-]/g, '').replace(/ /g, '-'));
        assert.ok(headings.includes(url.hash.slice(1)), file + ': ' + link);
      }
    }
  }
});

test('electricity provenance stays beside its script and retains its public metadata URL', () => {
  const metadata = fs.readFileSync(path.join(root, 'scripts/electricity-provenance.json'), 'utf8');
  assert.equal(fs.existsSync(path.join(root, 'data/electricity-provenance.json')), false);
  assert.equal(fs.readFileSync(path.join(root, 'site/dist/electricity-provenance.json'), 'utf8'), metadata);
  const packageInfo = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.ok(packageInfo.files.includes('scripts/electricity-provenance.json'));
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'site/dist/catalog.json'), 'utf8'));
  assert.ok(!catalog.datasets.some(dataset => dataset.file === 'electricity-provenance.json'));
});

test('dataset guides share a reader-oriented structure without release journals', () => {
  for (const collection of collections) {
    const text = fs.readFileSync(path.join(root, 'data', collection, 'README.md'), 'utf8');
    assert.deepEqual([...text.matchAll(/^## (.+)$/gm)].map(match => match[1]), [
      'Files', 'File Structure and Units', 'Using the Data', 'Methodology', 'Sources and Attribution', 'Limitations'
    ], collection);
    assert.doesNotMatch(text, /Latest refresh:|## November|For This Refresh|in this pass/i);
  }
});

test('dataset guide relative links and section anchors resolve', () => {
  for (const collection of collections) {
    const file = path.join(root, 'data', collection, 'README.md');
    const text = fs.readFileSync(file, 'utf8');
    for (const [, link] of text.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(link)) continue;
      const [relative, anchor] = link.split('#');
      const target = relative ? path.resolve(path.dirname(file), relative) : file;
      assert.ok(fs.existsSync(target), `${collection}: ${link}`);
      if (anchor) {
        const headings = [...fs.readFileSync(target, 'utf8').matchAll(/^#{1,6} (.+)$/gm)]
          .map(match => match[1].toLowerCase().replace(/[^\w\s-]/g, '').replace(/ /g, '-'));
        assert.ok(headings.includes(anchor), `${collection}: ${link}`);
      }
    }
  }
});

test('every documented collection CSV column appears in its guide', () => {
  for (const collection of collections) {
    const directory = path.join(root, 'data', collection);
    const guide = fs.readFileSync(path.join(directory, 'README.md'), 'utf8');
    for (const file of fs.readdirSync(directory).filter(file => file.endsWith('.csv'))) {
      const header = fs.readFileSync(path.join(directory, file), 'utf8').split(/\r?\n/)[0];
      for (const column of header.split(',')) {
        assert.ok(guide.includes('`' + column + '`'), `${collection}/${file}: ${column}`);
      }
    }
  }
});
