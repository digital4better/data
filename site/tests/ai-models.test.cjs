const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const raw = read("data/ai/models.json");
const models = JSON.parse(raw);
const byName = new Map(models.map((model) => [model.name, model]));
const provenance = read("data/ai/provenance.md");
const coverage = read("data/ai/cloud-coverage.md");

test("AI registry is formatted, sorted and structurally consistent", () => {
  assert.equal(raw, JSON.stringify(models, null, 2) + "\n");
  assert.equal(byName.size, models.length);
  assert.deepEqual(models.map((m) => m.name), [...byName.keys()].sort());
  for (const m of models) {
    assert.deepEqual(Object.keys(m.parameters), ["active", "total"], m.name);
    const { active, total } = m.parameters;
    assert.ok(Number.isFinite(active) && active > 0 && Number.isFinite(total) && total >= active, m.name);
    assert.ok(["dense", "moe"].includes(m.architecture), m.name);
    if (m.architecture === "dense") assert.equal(active, total, m.name);
    for (const key of ["open", "reasoning", "tools"]) assert.equal(typeof m[key], "boolean", `${m.name}: ${key}`);
    for (const key of ["input", "output", "sources", "estimated"]) {
      assert.ok(Array.isArray(m[key]), `${m.name}: ${key}`);
      assert.equal(new Set(m[key]).size, m[key].length, `${m.name}: duplicate ${key}`);
    }
    assert.ok(m.input.length && m.output.length && m.sources.length, m.name);
    for (const source of m.sources) assert.equal(new URL(source).protocol, "https:", m.name);
    for (const field of m.estimated) {
      assert.ok(Object.hasOwn(m, field), `${m.name}: estimated absent field ${field}`);
      assert.ok(!["input", "output", "reasoning", "tools", "providers"].includes(field), m.name);
    }
    for (const field of ["context", "dimension", "hidden_dimension"]) {
      if (field in m) assert.ok(Number.isInteger(m[field]) && m[field] > 0, `${m.name}: ${field}`);
    }
    if (m.type === "text") assert.ok(m.context, `${m.name}: text context`);
    if (m.type === "embedding") assert.ok(m.output.includes("embedding"), m.name);
    if (m.type === "image") assert.ok(m.output.includes("image"), m.name);
    if (m.type === "video") assert.ok(m.output.includes("video"), m.name);
    if (["audio", "speech"].includes(m.type)) assert.ok(m.output.includes("audio"), m.name);
    assert.doesNotThrow(() => new RegExp(m.pattern, "i"), m.name);
    assert.ok(new RegExp(m.pattern, "i").test(m.name), `${m.name}: canonical pattern`);
    for (const removed of ["aliases", "dimension_min", "context_window", "inputs", "outputs"]) {
      assert.ok(!(removed in m), `${m.name}: obsolete ${removed}`);
    }
  }
});

test("provenance rows agree with model values and retain explicit EcoLogits attribution", () => {
  let section = "";
  let checked = 0;
  for (const line of provenance.split("\n")) {
    if (line.startsWith("## ")) section = line.slice(3);
    const row = line.match(/^\| `([^`]+)` \| (.*) \|$/);
    if (!row) continue;
    const model = byName.get(row[1]);
    assert.ok(model, row[1]);
    assert.ok(model.estimated.includes("parameters"), model.name);
    const columns = row[2].split(" | ");
    const counts = section === "EcoLogits And Adaptations" ? columns[3].split(" / ")
      : section.endsWith("Local Hypotheses") ? columns[0].split(" / ")
      : columns.slice(-2);
    assert.deepEqual(counts.map(Number), [model.parameters.active, model.parameters.total], model.name);
    if (section === "EcoLogits And Adaptations") assert.ok(model.sources.some((s) => s.includes("mlco2/ecologits")), model.name);
    if (section.endsWith("LifeArchitect")) assert.ok(model.sources.includes("https://lifearchitect.ai/models-table/"), model.name);
    if (section.endsWith("Local Hypotheses")) {
      const anchor = section === "Local Hypotheses" ? "local-hypotheses" : "november-2026-local-hypotheses";
      assert.ok(model.sources.some((s) => s.endsWith(`provenance.md#${anchor}`)), model.name);
      assert.ok(columns[1].length > 80, `${model.name}: missing calculation explanation`);
    }
    checked++;
  }
  assert.ok(checked > 200, "The dated audit must cover the proprietary estimates, not just a few examples");
});

test("dated cloud inventory resolves every mapped identifier and explains exclusions", () => {
  let provider;
  const totals = new Map();
  const observed = new Set();
  for (const line of coverage.split("\n")) {
    const heading = line.match(/^## (AWS|AZURE|GCP|OVHCLOUD|SCALEWAY)$/);
    if (heading) provider = heading[1].toLowerCase();
    const row = line.match(/^\| `([^`]+)` \| (.+) \| \[Official source\]\((https:[^)]+)\) \|$/);
    if (!row) continue;
    assert.ok(provider);
    const key = `${provider}/${row[1]}`;
    assert.ok(!observed.has(key), key);
    observed.add(key);
    const total = totals.get(provider) || { observed: 0, mapped: 0 };
    total.observed++;
    if (row[2].startsWith("`")) {
      const m = byName.get(row[2].slice(1, -1));
      assert.ok(m?.providers[provider]?.includes(row[1]), key);
      assert.ok(m.sources.includes(row[3]), `${key}: missing cloud evidence`);
      assert.ok(new RegExp(m.pattern, "i").test(row[1]), `${key}: unrecognized cloud ID`);
      total.mapped++;
    } else assert.ok(row[2].length > 20, `${key}: missing exclusion reason`);
    totals.set(provider, total);
  }
  assert.ok(observed.size >= 452, "Preserve the historical inventory when adding new observations");
  for (const id of ["aws/anthropic.claude-haiku-5-5", "azure/claude-haiku-5-5", "gcp/claude-haiku-5-5", "gcp/deepseek-v4.1-flash-maas"]) {
    assert.ok(observed.has(id), id);
  }
  for (const [p, t] of totals) assert.ok(coverage.includes(`| ${p} | ${t.observed} | ${t.mapped} | ${t.observed - t.mapped} |`), p);
});

test("sizing and public-capability corrections do not regress", () => {
  assert.deepEqual(byName.get("claude-sonnet-4.6").parameters, { active: 20, total: 1000 });
  assert.deepEqual(byName.get("gpt-5").parameters, { active: 150, total: 3000 });
  assert.equal(byName.get("gemini-2.5-pro").architecture, "moe");
  assert.ok(!byName.get("gemini-2.5-pro").estimated.includes("architecture"));
  assert.deepEqual(byName.get("codex-mini").parameters, byName.get("o4-mini").parameters);
  assert.equal(byName.get("gpt-5.4").context, 1050000);
  assert.equal(byName.get("gpt-5.2-chat").context, 128000);
  assert.equal(byName.get("gemini-embedding-2").context, 8192);
  assert.equal(byName.get("gemini-3.8-flash-cyber").tools, false);
  assert.equal(byName.get("gemini-3.8-live").reasoning, false);
  assert.ok(byName.get("gemini-3.8-live").output.includes("video"));
  assert.equal(byName.get("deepseek-v3.1").reasoning, true);
  assert.equal(byName.get("qwen3-235b-a22b-instruct-2507").reasoning, false);
  assert.ok(!byName.get("o1").providers.azure.includes("o1-preview"));
  assert.ok(byName.get("o1-preview").providers.azure.includes("o1-preview"));
  assert.equal(byName.get("ministral-3b").open, false);
  assert.deepEqual(byName.get("ministral-3b").input, ["text"]);
  assert.equal(byName.get("ministral-3-3b").open, true);
  assert.ok(byName.get("ministral-3-3b").input.includes("image"));
});

test("new version patterns recognize cloud IDs without swallowing adjacent versions", () => {
  for (const name of ["minimax-m2", "minimax-m2.1", "grok-4.20-reasoning", "grok-4.20-non-reasoning", "codex-mini", "marengo-embed-3.0"]) {
    const m = byName.get(name);
    const pattern = new RegExp(m.pattern, "i");
    for (const id of [name, ...Object.values(m.providers).flat()]) assert.ok(pattern.test(id), `${name}: ${id}`);
  }
  assert.ok(!new RegExp(byName.get("minimax-m2").pattern, "i").test("minimax-m2.1"));
  assert.ok(!new RegExp(byName.get("grok-4.20-reasoning").pattern, "i").test("grok-4.20-non-reasoning"));
  assert.ok(new RegExp(byName.get("grok-4.20-reasoning").pattern, "i").test("grok-4.20-0309-reasoning"));
  assert.ok(!new RegExp(byName.get("ministral-3b").pattern, "i").test("ministral-3b-2512"));
});

test("November model additions retain their source-specific sizes and contexts", () => {
  for (const [name, active, total, context] of [
    ["claude-haiku-5.5", 15, 400, 1000000],
    ["claude-fable-5.2", 150, 10000, 1000000],
    ["claude-mythos-5.2", 150, 10000, 1000000],
    ["gpt-6.1-terra", 75, 1200, 1050000],
    ["gemini-4-argon", 150, 6000, 1048576],
    ["muse-ember-1.0", 8, 120, 1048576],
    ["mistral-large-4", 52, 1050, 1048576],
    ["kimi-k3.1-pro", 104, 2800, 1048576],
    ["minimax-m3.1-flash", 23, 428, 1048576],
    ["qwen3.8-2.4t-a95b", 95, 2400, 262144],
    ["qwen3.8-flash-next", 6, 176, 262144],
    ["gemma-4-e4b-it", 8, 8, 131072],
    ["embeddinggemma-2", 0.74, 0.74, 8192],
  ]) {
    const m = byName.get(name);
    assert.ok(m, name);
    assert.deepEqual(m.parameters, { active, total }, name);
    assert.equal(m.context, context, name);
    assert.ok(m.sources.length >= 2, `${name}: cross-check sources`);
    for (const ids of Object.values(m.providers)) {
      for (const id of ids) assert.ok(new RegExp(m.pattern, "i").test(id), `${name}: ${id}`);
    }
  }
  assert.equal(byName.get("lfm3-1.7b").corpus, 22000);
  assert.equal(byName.get("embeddinggemma-2").dimension, 768);
  assert.ok(byName.get("qwen3.8-flash-next").estimated.includes("parameters"));
  assert.ok(byName.get("cohere-rerank-v5.0-pro").estimated.includes("parameters"));
  assert.ok(byName.get("claude-haiku-5.5").estimated.includes("architecture"));
  assert.ok(!byName.get("mistral-large-4").estimated.includes("parameters"));
  for (const provider of ["anthropic", "aws", "azure", "gcp"]) {
    assert.ok(byName.get("claude-haiku-5.5").providers[provider].length, provider);
  }
});

test("new releases do not inherit old weights, modalities or pattern aliases", () => {
  for (const [oldName, newName, serviceId] of [
    ["mistral-ocr-4", "mistral-ocr-4.1", "mistral-ocr-4-1"],
    ["voxtral-mini-transcribe", "voxtral-mini-transcribe-3", "voxtral-mini-transcribe-3-0"],
    ["voxtral-mini-transcribe-realtime", "voxtral-mini-transcribe-realtime-3", "voxtral-mini-transcribe-realtime-3-0"],
    ["voxtral-tts", "voxtral-mini-tts-3", "voxtral-mini-tts-3-0"],
    ["minimax-m3", "minimax-m3.1-flash", "MiniMax-M3.1-Flash"],
    ["glm-5.3", "glm-5.3-flash", "zai-glm-5-3-flash"],
    ["gemini-4-argon", "gemini-4-argon-cyber-permissive", "gemini-4-argon-cyber-permissive"],
  ]) {
    assert.ok(!new RegExp(byName.get(oldName).pattern, "i").test(serviceId), `${oldName} consumes ${serviceId}`);
    assert.ok(new RegExp(byName.get(newName).pattern, "i").test(serviceId), `${newName}: ${serviceId}`);
  }
  assert.equal(byName.get("voxtral-mini-transcribe-realtime").open, true);
  assert.equal(byName.get("voxtral-mini-transcribe-realtime-3").open, false);
  assert.equal(byName.get("voxtral-mini-tts-3").open, false);
  assert.equal(byName.get("muse-spark-open").open, true);
  assert.equal(byName.get("voxtral-small-transcribe-3").tools, true);
  assert.ok(!("context" in byName.get("voxtral-mini-transcribe-realtime-3")));
  assert.deepEqual(byName.get("qwen3.8-2.4t-a95b").input, ["text"]);
  assert.deepEqual(byName.get("gemini-nano-banana-2.1").output, ["text", "image"]);
  assert.deepEqual(byName.get("gemini-omni-1.2-flash").output, ["text", "video"]);
  assert.ok(!byName.has("kimi-k3.1-highspeed"));
  assert.ok(!byName.has("deepseek-v4.1-flash-1017"));
});
