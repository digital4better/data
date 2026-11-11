import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { definitions } from "./cloud-host-assumptions";

const root = path.resolve(__dirname, "..");
export const providers = ["aws", "azure", "gcp", "oracle", "ovhcloud", "scaleway"] as const;
type Provider = (typeof providers)[number];
type Capacity = number | string;

export type VirtualMachine = Record<string, unknown> & {
  id: string;
  vcpus: number;
  memory: Capacity;
  accelerators?: number;
  accelerator?: string;
  ssd?: Capacity;
  hdd?: Capacity;
  virtual?: boolean;
  embodied?: number;
  embodied_allocated?: number;
  host?: string;
  host_instances?: number;
  host_share?: number;
};

type HostCapacity = {
  id: string;
  vcpus: number;
  memory: number;
  accelerators: number;
  accelerator?: string;
  ssd_capacity?: number;
  hdd_capacity?: number;
  embodied: number;
  basis?: string;
};

export type HostProfile = HostCapacity & {
  provider: Provider;
  name: string;
  method: string;
  sockets: number;
  ssd_count: number;
  hdd_count: number;
  accelerator_memory: number;
  cpu?: string[];
  sources: string[];
  assumptions: string[];
};

export type HostInputs = {
  profiles: HostProfile[];
  assignments: {
    provider: Provider;
    id: string;
    host: string;
    published_limit?: number;
  }[];
  legacyEmbodied: Record<string, number | null>;
};

type Catalogs = Record<Provider, VirtualMachine[]>;
type Allocation = { host_instances: number; embodied_allocated: number };

const num = (value: Capacity | undefined): number => Number(String(value).replace(",", "."));
const round = (value: number): number => Number(value.toFixed(10));
const hasOwn = (object: object, key: string): boolean => Object.prototype.hasOwnProperty.call(object, key);

export const hostHeaders = [
  "id",
  "provider",
  "name",
  "basis",
  "method",
  "vcpus",
  "memory",
  "sockets",
  "cpu",
  "ssd_count",
  "hdd_count",
  "ssd_capacity",
  "hdd_capacity",
  "accelerator",
  "accelerators",
  "accelerator_memory",
  "embodied",
  "sources",
  "assumptions",
];
export const vmHeaders = [
  "id",
  "family",
  "name",
  "category",
  "vcpus",
  "memory",
  "ssd",
  "hdd",
  "cpu",
  "accelerators",
  "accelerator",
  "embodied",
  "embodied_allocated",
  "host",
  "host_instances",
];

export function calculateHost(host: HostProfile): number {
  for (const key of [
    "vcpus",
    "memory",
    "sockets",
    "ssd_count",
    "hdd_count",
    "accelerators",
    "accelerator_memory",
  ] as const) {
    if (!Number.isFinite(host[key]) || host[key] < 0) throw Error(`Invalid host ${host.id}/${key}`);
  }
  for (const key of ["sockets", "ssd_count", "hdd_count", "accelerators"] as const) {
    if (!Number.isInteger(host[key])) throw Error(`Non-integer physical count ${host.id}/${key}`);
  }
  if (host.vcpus <= 0 || host.memory < 16 || host.sockets < 1) throw Error(`Invalid host envelope ${host.id}`);
  // D4B extension: board/memory proxy also applies to ASIC/FPGA, explicitly labelled in each profile.
  const accelerator = host.accelerators * (150 + Math.max(0, host.accelerator_memory - 16) * 1.3869);
  return round(
    (1000 +
      (host.memory - 16) * 1.3869 +
      (host.sockets - 1) * 100 +
      host.ssd_count * 100 +
      host.hdd_count * 50 +
      accelerator) /
      1000
  );
}

export function allocate(vm: VirtualMachine, host: HostCapacity, publishedLimit?: number): Allocation {
  if (!Number.isFinite(vm.vcpus) || vm.vcpus <= 0 || !Number.isFinite(num(vm.memory)) || num(vm.memory) <= 0) {
    throw Error(`Invalid VM capacity ${vm.id}`);
  }
  const ratios = [host.vcpus / vm.vcpus, host.memory / num(vm.memory)];
  if (num(vm.accelerators) > 0) {
    if (vm.accelerator !== host.accelerator) throw Error(`Accelerator mismatch ${vm.id}`);
    ratios.push(host.accelerators / num(vm.accelerators));
  }
  for (const field of ["ssd", "hdd"] as const) {
    const capacity = host[`${field}_capacity`];
    if (num(vm[field]) > 0 && capacity != null) ratios.push(capacity / num(vm[field]));
  }
  if (ratios.some((r) => !Number.isFinite(r) || r < 1 - 1e-8)) throw Error(`Host smaller than VM ${vm.id}/${host.id}`);
  if (publishedLimit != null && (!Number.isInteger(publishedLimit) || publishedLimit < 1)) {
    throw Error(`Invalid placement limit ${vm.id}`);
  }
  const count =
    vm.virtual === false || host.basis === "dedicated-equivalent-fallback" || host.basis === "desktop-rack-equivalent"
      ? 1
      : Math.min(Math.floor(Math.min(...ratios) + 1e-8), publishedLimit ?? Infinity);
  const share = 1 / count;
  return { host_instances: count, embodied_allocated: round(host.embodied * share) };
}

export function generate(
  catalogs: Catalogs,
  inputs: HostInputs
): { hosts: Record<Provider, HostProfile[]>; vms: Catalogs } {
  for (const host of inputs.profiles) {
    if (host.assumptions?.some((code) => !hasOwn(definitions, code))) throw Error(`Unknown assumption code ${host.id}`);
  }
  const hosts = {} as Record<Provider, HostProfile[]>;
  const vms = {} as Catalogs;
  const assignments = new Map(inputs.assignments.map((a) => [`${a.provider}/${a.id}`, a]));
  if (assignments.size !== inputs.assignments.length) throw Error("Duplicate assignment");
  for (const provider of providers) {
    hosts[provider] = inputs.profiles
      .filter((h) => h.provider === provider)
      .map((h) => ({ ...h, embodied: calculateHost(h) }))
      .sort((a, b) => a.id.localeCompare(b.id));
    const map = new Map(hosts[provider].map((h) => [h.id, h]));
    if (map.size !== hosts[provider].length) throw Error("Duplicate host");
    vms[provider] = catalogs[provider].map((vm) => {
      const key = `${provider}/${vm.id}`,
        assignment = assignments.get(key);
      if (!assignment) throw Error(`Missing host assignment ${key}`);
      const host = map.get(assignment.host);
      if (!host) throw Error(`Missing host ${key}`);
      if (!hasOwn(inputs.legacyEmbodied, key)) throw Error(`Missing legacy decision ${key}`);
      const allocated = allocate(vm, host, assignment.published_limit);
      const legacy = inputs.legacyEmbodied[key];
      if (legacy != null && vm.embodied !== legacy) throw Error(`Refusing historical change ${key}`);
      const record = { ...vm };
      delete record.host_share;
      return {
        ...record,
        embodied: legacy ?? allocated.embodied_allocated,
        embodied_allocated: allocated.embodied_allocated,
        host: host.id,
        host_instances: allocated.host_instances,
      };
    });
    for (const h of hosts[provider]) {
      if (!vms[provider].some((vm) => vm.host === h.id)) throw Error(`Orphan host ${h.id}`);
    }
  }
  const keys = new Set(Object.entries(vms).flatMap(([p, rows]) => rows.map((r) => `${p}/${r.id}`)));
  for (const key of assignments.keys()) if (!keys.has(key)) throw Error(`Removed historical instance ${key}`);
  return { hosts, vms };
}

function main(): void {
  const mode = process.argv[2];
  if (mode !== "--write" && mode !== "--check") throw Error("Use --write or --check");
  const inputs: HostInputs = JSON.parse(readFileSync(path.join(root, "sources/cloud/host-inputs.json"), "utf8"));
  const catalogs = Object.fromEntries(
    providers.map((provider) => [
      provider,
      JSON.parse(readFileSync(path.join(root, `data/cloud/${provider}-vms.json`), "utf8")) as VirtualMachine[],
    ])
  ) as Catalogs;
  const result = generate(catalogs, inputs);
  let changes = 0;
  for (const provider of providers)
    for (const kind of ["hosts", "vms"] as const) {
      const file = path.join(root, `data/cloud/${provider}-${kind}.json`);
      const text = JSON.stringify(result[kind][provider], null, 2) + "\n";
      if (existsSync(file) && readFileSync(file, "utf8") === text) continue;
      changes++;
      if (mode === "--write") writeFileSync(file, text);
    }
  console.log(
    JSON.stringify(
      {
        changedFiles: changes,
        hosts: Object.fromEntries(providers.map((p) => [p, result.hosts[p].length])),
        instances: Object.fromEntries(providers.map((p) => [p, result.vms[p].length])),
      },
      null,
      2
    )
  );
  if (mode === "--check" && changes) process.exitCode = 1;
}

if (require.main === module) main();
