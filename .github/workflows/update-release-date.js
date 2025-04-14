const fs = require("fs");
const pkg = require("../../package.json");

pkg.releaseDate = new Date().toISOString();
// Weird, require and writeFileSync functions doesn't have the same current dir
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
