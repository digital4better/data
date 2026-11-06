---
name: digital4better-data
description: Use whenever a task reads, cites or depends on data from @digital4better/data, or computes or checks electricity impact factors, electricity mixes, cloud regions or machines, AI model characteristics, or equipment, energy, building or transport impact factors in a project that installs this package. Use it also before stating that a territory, period, model or indicator is missing from the package.
---

# @digital4better/data

Before using any file of this package, read the documentation shipped with the installed version:

1. `llms.txt` at the package root, the short index. Read it first.
2. `llms-full.txt` next to it, when the task needs schemas, units, lookup rules or limitations.

The package root is the `node_modules/@digital4better/data/` directory of the project or workspace that depends on it, or the directory of `require.resolve('@digital4better/data/package.json')`.

These files describe the installed version and take precedence over the website, which may describe newer data. Run the checks they list before reporting that some data is missing.
