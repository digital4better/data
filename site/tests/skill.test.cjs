const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const skillsDir = "skills";
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const skills = fs.readdirSync(skillsDir);
const frontmatter = (text) => Object.fromEntries(
  text.match(/^---\n(.*?)\n---\n/s)[1].split("\n").map((line) => {
    const [key, ...value] = line.split(":");
    return [key.trim(), value.join(":").trim()];
  })
);
test("agent skills are published with the package", () => {
  assert.ok(pkg.files.includes("skills"));
  assert.ok(skills.length > 0);
});
test("each agent skill follows the Agent Skills layout", () => {
  for (const name of skills) {
    const meta = frontmatter(fs.readFileSync(path.join(skillsDir, name, "SKILL.md"), "utf8"));
    assert.equal(meta.name, name);
    assert.match(name, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(meta.description && meta.description.length <= 1024, name);
  }
});
test("files named by a skill exist and are published", () => {
  for (const name of skills) {
    const body = fs.readFileSync(path.join(skillsDir, name, "SKILL.md"), "utf8");
    for (const [, file] of body.matchAll(/`(llms(?:-full)?\.txt)`/g)) {
      assert.ok(fs.existsSync(file) && pkg.files.includes(file), `${name}: ${file}`);
    }
  }
});
