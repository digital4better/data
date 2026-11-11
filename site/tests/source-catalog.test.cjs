const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {version, sources} = require('../../sources/catalog.json');
test('source registry has stable identities, declarative collection and no transient state', () => {
  assert.equal(version, 1);
  assert.equal(new Set(sources.map(s => s.id)).size, sources.length);
  assert.equal(new Set(sources.map(s => s.url)).size, sources.length);
  for (const scope of ['ai','aws','azure','gcp','oracle','ovhcloud','scaleway'])
    assert(sources.some(s => s.status === 'active' && s.scopes.includes(scope) && s.collection.discovery.length));
  for (const s of sources) {
    assert.match(s.id, /^[a-z0-9][a-z0-9.-]+$/);
    assert(['http:', 'https:'].includes(new URL(s.url).protocol));
    assert(s.publisher && s.attribution && Array.isArray(s.limitations));
    assert(['primary','secondary','observation','methodology'].includes(s.category));
    assert(['active','deprecated'].includes(s.status));
    assert(['http','browser'].includes(s.collection.method));
    assert(['none','link','json'].includes(s.collection.pagination));
    if (s.collection.pagination !== 'none') assert(s.collection.next);
    if (s.status === 'deprecated') assert(s.reason);
    if (s.replacement) assert(sources.some(r => r.id === s.replacement));
    for (const k of ['attempts','lastError','retryCount','lastAttempt','cache','browserState']) assert(!(k in s));
  }
});
test('source registry remains included in the package and documented in four LLM files', () => {
  const pkg = require('../../package.json');
  assert(pkg.files.includes('sources/catalog.json'));
  for (const f of ['llms.txt','llms-full.txt','site/llms.txt','site/llms-full.txt'])
    assert(readFileSync(f,'utf8').includes('sources/catalog.json'));
});
