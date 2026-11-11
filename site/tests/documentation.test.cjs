const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const collections = ['ai', 'cloud', 'facility', 'transport'];

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
