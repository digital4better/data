# Field Assessments

AI models and cloud regions, VMs, hosts, CPUs and accelerators may contain an optional JSON-only `fields` object. It maps public top-level property names to the states below. Other collections and the source registry are outside this contract.

## States

| State | Meaning | Relationship to the record |
| --- | --- | --- |
| `supported` | Version- and scope-specific evidence supports the published value. | A value must be present. This is not a guarantee of truth. |
| `estimated` | The value is explicitly an estimate with a documented method or retained provenance. | A value must be present. The marker does not establish independent verification or measured accuracy. |
| `tentative` | Evidence is insufficient or contradictory. | The property may be absent, or contain an explicitly retained historical value whose assessment is unresolved. New uncertain candidate values stay outside published data. |
| `missing` | The review found no established value. | The property must be absent, `null` or an empty string, where the collection permits that representation. |

Use exactly one string state per property; there is no nested status/origin object. When an estimate is also unresolved, `tentative` takes precedence and the estimation method remains in public provenance.

An omitted entry means **not assessed**, never implicitly supported. An absent `fields` object means no field assessments were published. Do not add an empty object or mechanically label all existing values supported. Metadata does not exempt a record from required fields, valid types, identity rules, numerical constraints or source requirements.

Zero and `false` are present values. Empty arrays and objects are also present containers; their meaning and validity remain collection-specific. For example, an empty list is not automatically missing. A legacy zero placeholder does not become evidence of a measured zero just because it exists.

Only known top-level properties of the collection can be annotated. Unknown names, dotted paths, `fields.fields`, invalid states, arrays/null in place of the map and an empty map are rejected. Assess a structured property such as `parameters`, `providers` or `flex` as a whole; do not invent a second nested schema. The [validator](https://github.com/digital4better/data/blob/main/scripts/field-assessments.ts) defines the collection-specific accepted names. It is a repository maintenance tool, not part of the npm runtime.

## Example

Illustrative region fragment, not a newly verified geographic record:

```json
{
  "id": "example-region",
  "pue": 1.25,
  "fields": {
    "pue": "estimated",
    "wue": "tentative",
    "ref": "missing"
  }
}
```

Here PUE is an illustrative estimate, WUE has unresolved evidence and no published candidate value, and REF was reviewed without finding a value. Unannotated properties have no assessment claim. This fragment does not replace the collection's complete record requirements.

## Evidence and estimates

Keep source, period, scope, unit, transformation and observation/estimation distinctions in the collection's existing provenance conventions. `fields` stores states, not confidence scores, citations, candidate values or approval records. Human acceptance alone does not establish a fact.

Dataset records do not contain free-text `notes`; `notes` and `fields.notes` are rejected for these AI/cloud collections. Keep evidence URLs in `sources` where supported, and interpretation, estimation methods, periods and unresolved disagreements in public provenance linked to the affected record IDs. Collection guides describe shared units and methods. Group shared explanations instead of duplicating them per record. Private reports may preserve additional evidence, but must not be the only place explaining a published estimate or limitation. Source-registry review notes are outside this record contract.

The former AI JSON `estimated` array is removed and rejected, including an empty array. Use `fields.<property> = "estimated"` instead. Migration preserves existing estimation flags and assessments without certifying historical values. A JSON consumer must migrate its reads; `fields.estimated` is not a valid assessed property. For hosts, `basis`, `method`, `sources` and `assumptions` retain their roles. A tentative historical value must remain visibly unresolved in the provenance; do not erase it or replace it with a private candidate solely to change its assessment.

## Editing and recalculation

Update or clear a field's assessment when changing its value; do not copy an old assessment onto a different value without review. Host assessments belong in the authoritative `sources/cloud/host-inputs.json` profiles and are propagated to generated host JSON. VM assessments live on the VM records. The host calculator preserves unchanged assessments and removes annotations for values it changes; it never labels its outputs supported automatically. If the last assessment is removed, the `fields` property is omitted.

## JSON and CSV compatibility

The JSON property is optional and does not change historical identities or values. Migrating existing estimation flags is not a fresh factual assessment; previously unannotated properties remain unassessed.

CSV headers and column order stay unchanged. The AI CSV retains its existing `estimated` column, derived from the keys whose `fields` state is `estimated`, in JSON key order and joined with `|`. Migration preserves the old list order and every CSV byte. Changing an estimation flag intentionally changes that cell; other assessment edits have no CSV effect. A `tentative` field is not included in that list, even when provenance describes an estimate. CSV readers cannot recover uncertainty or omitted estimation origin; use JSON and public provenance for quality-sensitive decisions. Cloud CSVs omit assessments entirely. Do not export a `fields` column, flattened state columns or private uncertain values.

The export functions validate field assessments before projecting records. Repository tests check all AI/cloud catalogs, malformed annotations, presence consistency, calculator preservation/invalidation and byte-identical CSV projections when estimation flags are unchanged, plus the AI estimation projection. These are structural checks; evidence still requires review.
