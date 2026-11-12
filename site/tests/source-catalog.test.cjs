const test = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  path = require('node:path');
const root = path.resolve(__dirname, '../..');
const catalog = require('../../sources/catalog.json'),
  schema = require('../../sources/catalog.schema.json');
const sourceSchema = schema.properties.sources.items,
  scopes = ['ai', 'aws', 'azure', 'gcp', 'oracle', 'ovhcloud', 'scaleway'];
const mandatory = (s) => s.status === 'active' && ['catalog', 'discovery'].includes(s.role);
const unique = (xs) => assert.equal(new Set(xs).size, xs.length);
test('curated registry has a strict schema, stable identities, typed roles and no execution state', () => {
  assert.equal(catalog.version, 2);
  assert.equal(schema.properties.version.const, 2);
  unique(catalog.sources.map((s) => s.id));
  unique(catalog.sources.map((s) => s.url));
  for (const s of catalog.sources) {
    for (const k of sourceSchema.required) assert(Object.hasOwn(s, k), `${s.id}: ${k}`);
    for (const k of Object.keys(s))
      assert(Object.hasOwn(sourceSchema.properties, k), `${s.id}: unknown ${k}`);
    assert.match(s.id, new RegExp(sourceSchema.properties.id.pattern));
    assert(['http:', 'https:'].includes(new URL(s.url).protocol));
    for (const k of ['role', 'category', 'format', 'status'])
      assert(sourceSchema.properties[k].enum.includes(s[k]));
    for (const k of ['scopes', 'topics']) {
      assert(s[k].length);
      unique(s[k]);
      for (const v of s[k]) assert(sourceSchema.properties[k].items.enum.includes(v));
    }
    assert(s.publisher);
    for (const k of ['name', 'attribution'])
      if (s[k] !== undefined) assert(typeof s[k] === 'string' && s[k].trim());
    if (s.limitations !== undefined) assert(Array.isArray(s.limitations));
    if (['catalog', 'discovery'].includes(s.role)) assert(s.name && s.collection);
    const c = s.collection;
    if (c) {
      for (const k of sourceSchema.properties.collection.required) assert(Object.hasOwn(c, k));
      for (const k of Object.keys(c))
        assert(Object.hasOwn(sourceSchema.properties.collection.properties, k));
      assert(['http', 'browser'].includes(c.method));
      assert(['none', 'link', 'json', 'unreviewed'].includes(c.pagination));
      for (const k of ['follow', 'expect', 'discovery']) {
        assert(Array.isArray(c[k]));
        unique(c[k]);
      }
      if (['link', 'json'].includes(c.pagination)) assert(c.next);
      else assert(!c.next);
      if (c.pagination === 'link') assert.equal(c.method, 'browser');
      if (c.pagination === 'json') {
        assert.equal(c.method, 'http');
        assert.equal(s.format, 'json');
      }
      for (const u of c.follow) assert(['http:', 'https:'].includes(new URL(u).protocol));
    }
    if (mandatory(s)) {
      assert(s.review?.date);
      if (s.review.notes !== undefined) assert(s.review.notes.trim());
      assert.match(s.review.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.notEqual(c.pagination, 'unreviewed');
      if (s.format !== 'pdf') assert(c.expect.length);
    } else if (['reference', 'methodology'].includes(s.role))
      assert.equal(c?.discovery.length ?? 0, 0);
    if (s.status === 'deprecated') assert(s.reason);
    const seen = new Set([s.id]);
    let next = s.replacement;
    while (next) {
      assert(!seen.has(next), 'replacement cycle');
      seen.add(next);
      const target = catalog.sources.find((x) => x.id === next);
      assert(target);
      next = target.replacement;
    }
  }
});
test('mandatory traversal covers every cloud topic and AI models/availability explicitly', () => {
  unique(catalog.coverage.map((r) => r.scope + '/' + r.topic));
  for (const scope of scopes) {
    const topics =
      scope === 'ai'
        ? ['models', 'availability']
        : ['instances', 'regions', 'sustainability', 'hardware'];
    for (const topic of topics) {
      const r = catalog.coverage.find((r) => r.scope === scope && r.topic === topic);
      assert(r?.sources.length, scope + '/' + topic);
    }
    assert(
      catalog.sources.some(
        (s) => mandatory(s) && s.scopes.includes(scope) && s.collection.discovery.length
      )
    );
  }
  for (const r of catalog.coverage) {
    unique(r.sources);
    for (const id of r.sources) {
      const s = catalog.sources.find((s) => s.id === id);
      assert(s && mandatory(s) && s.scopes.includes(r.scope) && s.topics.includes(r.topic));
    }
  }
  for (const s of catalog.sources.filter(mandatory))
    assert(catalog.coverage.some((r) => r.sources.includes(s.id)));
  // Provider-specific region sources must not inherit the six-provider scope of a shared README.
  const aws = catalog.sources.find((s) => s.url.includes('/regions/aws-regions.html'));
  assert.deepEqual(aws.scopes, ['aws']);
  assert.deepEqual(aws.topics, ['regions']);
  const old = catalog.sources.find((s) => s.url.endsWith('/models-supported.html'));
  assert.equal(old.status, 'deprecated');
  assert(catalog.sources.find((s) => s.id === old.replacement).url.endsWith('/model-cards.html'));
});
test('registry schema and guide are published but calculation evidence stays repository-only', () => {
  const pkg = require('../../package.json');
  for (const f of ['sources/catalog.json', 'sources/catalog.schema.json', 'sources/README.md'])
    assert(pkg.files.includes(f));
  assert(
    !pkg.files.some((f) => ['sources/*', 'sources/', 'sources/cloud/host-inputs.json'].includes(f))
  );
  for (const f of ['llms.txt', 'llms-full.txt', 'site/llms.txt', 'site/llms-full.txt'])
    assert(fs.readFileSync(path.join(root, f), 'utf8').includes('sources/catalog.json'));
});
