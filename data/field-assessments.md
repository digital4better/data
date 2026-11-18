# Field Assessments

AI models and cloud regions, VMs, hosts, CPUs and accelerators may contain an optional JSON-only `fields` object. It maps public top-level property names to the states below. Other collections and the source registry are outside this contract.

## States

| State | Meaning | Relationship to the record |
| --- | --- | --- |
| `supported` | The published value has been assessed against evidence or a documented estimation method. | A value must be present. This is not a guarantee of truth or a claim that an estimate was measured. |
| `tentative` | Evidence is insufficient or contradictory. | The property may be absent, or contain an explicitly retained historical value whose assessment is unresolved. New uncertain candidate values stay outside published data. |
| `missing` | The review found no established value. | The property must be absent, `null` or an empty string, where the collection permits that representation. |

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
    "pue": "supported",
    "wue": "tentative",
    "ref": "missing"
  }
}
```

Here PUE has been assessed, WUE has unresolved evidence and no published candidate value, and REF was reviewed without finding a value. Unannotated properties have no assessment claim. This fragment does not replace the collection's complete record requirements.

## Evidence and estimates

Keep source, period, scope, unit, transformation and observation/estimation distinctions in the collection's existing provenance conventions. `fields` stores states, not confidence scores, citations, candidate values or approval records. Human acceptance alone does not establish a fact.

For AI models, `estimated` remains independent: a supported parameter estimate must still appear in `estimated`. For hosts, `basis`, `method`, `sources` and `assumptions` retain their roles. A tentative historical value must remain visibly unresolved in the provenance; do not erase it or replace it with a private candidate solely to change its assessment.

## Editing and recalculation

Update or clear a field's assessment when changing its value; do not copy an old assessment onto a different value without review. Host assessments belong in the authoritative `sources/cloud/host-inputs.json` profiles and are propagated to generated host JSON. VM assessments live on the VM records. The host calculator preserves unchanged assessments and removes annotations for values it changes; it never labels its outputs supported automatically. If the last assessment is removed, the `fields` property is omitted.

## JSON and CSV compatibility

The JSON property is optional and does not change historical identities or values. No bulk assessment of legacy records is implied by this contract addition.

CSV headers, order, cell values and projections are unchanged. Adding, removing or changing only `fields` has no effect on CSV bytes. CSV readers cannot recover assessment states, including uncertainty attached to retained historical values; use JSON and provenance for quality-sensitive decisions. Do not export `fields`, flattened state columns or private uncertain values to CSV.

The export functions validate field assessments before projecting records. Repository tests check all AI/cloud catalogs, malformed annotations, presence consistency, calculator preservation/invalidation and byte-identical CSV projections with and without metadata. These are structural checks; evidence still requires review.
