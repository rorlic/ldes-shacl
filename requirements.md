# LDES Requirements
> [!CAUTION]
> This is still work in progress.

This document contains a number of requirements related to the content of TREE nodes that can be verified using static analysis of such a content. As this content must be linked-data expressed in a commonly-used [RDF](https://www.w3.org/TR/rdf12-concepts/) serialization, the static analysis can be done by applying [SHACL](https://w3c.github.io/data-shapes/shacl/) validation on the content.

This document is based on [Linked Data Event Streams,
Living Standard, 3 July 2025](./Linked%20Data%20Event%20Streams,%20Living%20Standard,%203%20July%202025.pdf) and has the same structure to allow for easier maintenance.

## Definitions
See the [TREE Requirements definitions](https://github.com/rorlic/tree-shacl/blob/main/requirements.md#definitions). In addition:
* An _entity_ is an identifiable thing containing a set of properties represented by a state object
* A _member_ is a version (at some point in time) of an entity
* An _LDES_ (Linked Data Event Stream) (`ldes:EventStream`) is a collection (`rdfs:subClassOf tree:Collection`) of members that cannot be updated or removed once they are published and becomes an append-only log aka. _event stream_.

> [!NOTE]
> All predicates that end in `Path` refer to a [SHACL property path](https://www.w3.org/TR/shacl/#property-paths) that MUST be applied to a member.

## 1. Introduction
> [!NOTE]
> not applicable

## 2. Overview
1. an event stream MUST be a `ldes:EventStream` and SHOULD NOT be double typed with `tree:Collection`[^1]
0. an event stream SHOULD include a `ldes:timestampPath` property to indicate the timestamp (`xsd:dateTime`) when the member was added (i.e. ingested) to the collection[^2]
0. an event stream MAY contain a `ldes:sequencePath` property to indicate the relative or absolute ingest order[^3]
0. an event stream SHOULD include a `ldes:versionOfPath` property to specify the entity for which the member is a version of
0. an event stream MAY contain a `ldes:versionTimestampPath` to specify an alternate property that defines the order of the versions of the same entity
0. an event stream MAY contain a `ldes:versionSequencePath` to indicate the relative order of entities with the same `ldes:versionTimestampPath`[^4]
0. an event stream SHOULD refer using its `tree:shape` property to a shape defining its members[^5]
0. a root node SHOULD contain a `ldes:retentionPolicy`, preferably on the root node, alternatively on the root node's `tree:viewDescription`[^6]
0. an event stream MUST refer using its `tree:member` property to a member's focus node, which MUST be an IRI


## 3. Context information

### 3.1 Versions and transactions

### 3.2 Retention policies

## 4. Vocabulary
> [!NOTE]
> not applicable


[^1]: Because an LDES is a subclass of a TREE collection (`ldes:EventStream rdfs:subClassOf tree:Collection`), this is implied.

[^2]: The ingest order (`ldes:timestampPath`) can be used for ordering the versions of the same entity unless these versions are not published (nor received) chronologically.

[^3]: If an event stream contains a `ldes:timestampPath` then the `ldes:sequencePath` yields the relative ingest sequence for members with the same timestamp. If the `ldes:timestampPath` is omitted, the `ldes:sequencePath` indicates the absolute ingest sequence of all members. In both cases the comparison must use the XPath comparison function [fn:compare](https://www.w3.org/TR/xpath-functions-31/#func-compare) to order the values obtained by applying the `ldes:sequencePath` on the member versions.

[^4]: If member versions can be ingested (and therefore published) out-of-order, the `ldes:timestampPath` and `ldes:sequencePath` can yield an incorrect version order. As an alternative, the `ldes:versionTimestampPath` and `ldes:versionSequencePath` can be used together to define the order of all versions of a non-version (state) object. The `ldes:versionSequencePath` is only needed if versions of a member can have the same value for the `ldes:versionTimestampPath`.

[^5]: A `tree:shape` can be used for both selecting a search tree in the discovery phase as well as validating the members in the event stream. The predicate's object is a SHACL shape (`sh:NodeShape`) that targets the objects of `tree:member`. I.e. the `tree:shape` implies `[a sh:NodeShape; sh:targetObjectsOf tree:member]` and therefore these triples can be omitted.

[^6]: A retention policy can also be defined in a root node's `tree:viewDescription`, which can contain other context data such as `dcat:Distribution` and `ldes:EventSource`.

---

## TO BE REVIEWED

> [!WARNING]
> Note that anything beyond this point may have changed or may change in the near future.
> Requirements below will gradually be revised and migrated to the new structure above and renumbered.

### Fragmentation Requirements (LPFR)
1. if an event stream is too big to fit in one HTTP Response, it MUST be partitioned using [TREE pages](../tree/README.md#page-requirements-tppr)
2. a LDES page to which no more members will be added MUST contain a HTTP `Cache-Control` header that includes the `immutable` keyword
3. a LDES page that may contain additional members in the future MUST contain a HTTP `Cache-Control` header that includes the `max-age` keyword to indicate the (recommended minimum) time between re-requests of this page

### Retention Requirements (LPRR)
1. if no retention policy is added to an event stream, the event stream MUST keep all the members added to the collection
2. a root node of an event stream (see [client initialization](../tree/README.md#initialization-tcir)) MAY contain a retention policy to indicate that members will be removed over time
3. a root node MUST refer using its `ldes:retentionPolicy` property to a retention policy of type `ldes:DurationAgoPolicy`, `ldes:LatestVersionSubset` or `ldes:PointInTimePolicy`
4. a root node MUST NOT refer to more than one retention policy of the same type
5. if a root node refers to more than one retention policy, the members MUST be available while at least one retention policy applies

#### Time-based Retention Policies (LPRR-TB)
1. a retention policy of type `ldes:DurationAgoPolicy` MUST include a `tree:value` property to specify a value of type `xsd:duration`, which defines a relative time value for how long to keep a member
2. if the event stream has a `ldes:timestampPath`, a retention policy of type `ldes:DurationAgoPolicy` MAY include a `ldes:timestampPath` property to override which member property to use for the timestamp to compare against its `tree:value`
3. if the event stream does not have a `ldes:timestampPath`, a retention policy of type `ldes:DurationAgoPolicy` MUST include a `ldes:timestampPath` property to determine which member property to use for the timestamp to compare against its `tree:value`
4. if the event stream has a `ldes:timestampPath` and a retention policy of type `ldes:DurationAgoPolicy` does not override it, the retention policy MUST use the event stream `ldes:timestampPath` property to determine the member's timestamp value

#### Version-based Retention Policies (LPRR-VB)
1. a retention policy of type `ldes:LatestVersionSubset` MAY include a `ldes:amount` property of type `xsd:integer` (greater than or equal to 1) to specify the number of most recent members to keep, based on `ldes:timestampPath` for sorting all members with the same `ldes:versionOfPath`
2. if a retention policy of type `ldes:LatestVersionSubset` does not include a `ldes:amount` property, it MUST default to `1`
3. if the event stream has a `ldes:timestampPath`, a retention policy of type `ldes:LatestVersionSubset` MAY include a `ldes:timestampPath` property to override which member property to use for the timestamp to sort members
4. if the event stream does not have a `ldes:timestampPath`, a retention policy of type `ldes:LatestVersionSubset` MUST include a `ldes:timestampPath` property to determine which member property to use for the timestamp to sort members
5. if the event stream has a `ldes:timestampPath` and a retention policy of type `ldes:LatestVersionSubset` does not override it, the retention policy MUST use the event stream `ldes:timestampPath` property to determine the member's timestamp value
6. a retention policy of type `ldes:LatestVersionSubset` MAY include a `ldes:versionKey` property, which is a `rdf:List` of SHACL property paths that specifies the member properties that MUST be concatenated to find a key for grouping the members
7. if a retention policy of type `ldes:LatestVersionSubset` includes a `ldes:versionKey` property that is an empty `rdf:List`, then all the member in the collection MUST be seen as all having the same entity, i.e. the retention policy does not need to group members and simply removes all but the N most recent members where N is given by the `ldes:amount` property
8. if the event stream has a `ldes:versionOfPath` and a retention policy of type `ldes:LatestVersionSubset` does not define a `ldes:versionKey` property, it MAY include a `ldes:versionOfPath` property to override which member property to use for grouping the members by their entity
9. if the event stream does not have a `ldes:versionOfPath` and a retention policy of type `ldes:LatestVersionSubset` does not define a `ldes:versionKey` property, it MUST include a `ldes:versionOfPath` property to determine which member property to use for grouping the members by their entity
10. if the event stream has a `ldes:versionOfPath` and a retention policy of type `ldes:LatestVersionSubset` does not override it and the retention policy does not define a `ldes:versionKey` property, it MUST use the event stream `ldes:versionOfPath` property to determine which member property to use for grouping the members by their entity

#### Point-In-Time Retention Policies (LPRR-PIT)
1. a retention policy of type `ldes:PointInTimePolicy` MUST include a `ldes:pointInTime` property of type `xsd:dateTime` to specify the cutoff point in time on or after which to keep members, based on `ldes:timestampPath` for determining the member's timestamp for comparing against
2. if the event stream has a `ldes:timestampPath`, a retention policy of type `ldes:PointInTimePolicy` MAY include a `ldes:timestampPath` property to override which member property to use for the timestamp to compare against its `ldes:pointInTime`
3. if the event stream does not have a `ldes:timestampPath`, a retention policy of type `ldes:PointInTimePolicy` MUST include a `ldes:timestampPath` property to determine which member property to use for the timestamp to compare against its `ldes:pointInTime`
4. if the event stream has a `ldes:timestampPath` and a retention policy of type `ldes:PointInTimePolicy` does not override it, the retention policy MUST use the event stream `ldes:timestampPath` property to determine the member's timestamp value


