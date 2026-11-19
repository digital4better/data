import { isDeepStrictEqual } from "node:util";

export type FieldState = "supported" | "estimated" | "tentative" | "missing";
export type FieldAssessments = Record<string, FieldState>;

// Public top-level fields, including optional fields absent from a particular record.
// Nested properties are assessed together (e.g. parameters, providers or flex).
export const assessedFields = {
  models: [
    "name",
    "vendor",
    "open",
    "pattern",
    "type",
    "architecture",
    "parameters",
    "context",
    "corpus",
    "dimension",
    "hidden_dimension",
    "input",
    "output",
    "reasoning",
    "tools",
    "providers",
    "sources",
  ],
  regions: [
    "id",
    "name",
    "provider",
    "location",
    "country",
    "subdivision",
    "lat",
    "lon",
    "pue",
    "wue",
    "ref",
    "aliases",
    "partition",
    "sources",
  ],
  vms: [
    "id",
    "name",
    "provider",
    "family",
    "category",
    "vcpus",
    "ocpus",
    "memory",
    "ssd",
    "hdd",
    "cpu",
    "accelerator",
    "accelerators",
    "embodied",
    "embodied_allocated",
    "host",
    "host_instances",
    "virtual",
    "shape",
    "flex",
  ],
  hosts: [
    "id",
    "name",
    "provider",
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
  ],
  cpus: [
    "id",
    "manufacturer",
    "serie",
    "model",
    "architecture",
    "platform",
    "cores",
    "threads",
    "tdp",
    "process",
    "die",
    "transistors",
    "smp",
    "sources",
  ],
  accelerators: [
    "id",
    "type",
    "manufacturer",
    "serie",
    "model",
    "platform",
    "cores",
    "memory",
    "tdp",
    "process",
    "die",
    "transistors",
    "sources",
  ],
} as const;
export type AssessedCollection = keyof typeof assessedFields;

export function validateFieldAssessments(
  record: Record<string, unknown>,
  collection: AssessedCollection,
  label = String(record.id ?? record.name ?? collection)
): void {
  if (Object.prototype.hasOwnProperty.call(record, "notes"))
    throw Error(`${label}: notes belongs in public collection documentation, not dataset records`);
  if (Object.prototype.hasOwnProperty.call(record, "estimated"))
    throw Error(`${label}: estimated belongs in fields as a flat state, not a separate property`);
  if (!Object.prototype.hasOwnProperty.call(record, "fields")) return;
  const fields = record.fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields) || !Object.keys(fields).length)
    throw Error(`${label}: fields must be a nonempty object; omit it when no fields were assessed`);
  for (const [field, state] of Object.entries(fields)) {
    if (!(assessedFields[collection] as readonly string[]).includes(field))
      throw Error(`${label}: unknown assessed field ${field}`);
    if (state !== "supported" && state !== "estimated" && state !== "tentative" && state !== "missing")
      throw Error(`${label}/${field}: invalid field state ${String(state)}`);
    const present =
      Object.prototype.hasOwnProperty.call(record, field) &&
      record[field] !== undefined &&
      record[field] !== null &&
      record[field] !== "";
    if ((state === "supported" || state === "estimated") && !present)
      throw Error(`${label}/${field}: ${state} requires a present value`);
    if (state === "missing" && present) throw Error(`${label}/${field}: missing requires an absent value`);
  }
}

// Calculators must not carry an assessment over to a different computed value.
// Unchanged annotations survive; a changed value becomes unassessed, never auto-supported.
export function retainUnchangedAssessments<T extends object>(before: object, after: T): T {
  const previous = before as Record<string, unknown>;
  if (!previous.fields) return after;
  const current = after as Record<string, unknown>;
  const fields = Object.fromEntries(
    Object.entries(previous.fields).filter(([field]) => isDeepStrictEqual(previous[field], current[field]))
  );
  const result = { ...after, fields };
  if (!Object.keys(fields).length) delete result.fields;
  return result;
}
