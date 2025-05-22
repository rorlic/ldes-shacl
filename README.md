# LDES specification SHACL
> This repository is still _work in progress_ and needs to be approved and accepted by the **TODO** group, so use at your own risk.
>
> Currently the shapes cover only the requirements in **bold** (that is, the part that can be validated with shapes).

In order to be compliant with the [LDES specification](https://w3id.org/ldes/specification) a producer MUST also be compliant with the [TREE hypermedia specification](https://treecg.github.io/specification/) on which LDES is based. 

This repository contains a number of _additional_ [SHACL](https://www.w3.org/TR/shacl/) shapes that can be used to validate compliance with the LDES specification. The shapes help to validate a set of requirements that have been extracted from the LDES specification as it currently stands (Living Standard, 8 May 2025).

The shapes can be found in the [src](./src/) directory:
* the [shapes](./src/ldes-shapes.ttl) file contains all _additional_ shapes to validate pages of a LDES and should be combined with the [TREE shapes](https://github.com/rorlic/tree-shacl/tree/main/src).

> **Note** that the idea is to include the shapes in the [TREE vocabulary](https://w3id.org/tree#) and the [LDES vocabulary](https://w3id.org/ldes#).

This repository also contains a set of unit tests that check the correctness of the above shape files. To run the tests you need to install the required packages:
```bash
npm i
```
and then you can run the tests with:
```bash
npm run gui-test
```
or without an user interface:
```bash
npm test
```

## Producer

### Event Stream Requirements (LPER)
1. **an event stream MUST be a `ldes:EventStream`**
2. **an event stream SHOULD NOT be double typed with `tree:Collection` (as this is implied)**
3. **an event stream MUST refer using its `tree:member` property to a member's focus node**
4. **an event stream SHOULD refer using its `tree:shape` property to a shape defining its members**
5. a `tree:shape` MAY evolve but MUST remain backwards compatible
6. **an event stream MAY include a `ldes:versionOfPath` property to specify the (non-version) object for which the member is a version of**
7. **an event stream MAY include a `ldes:timestampPath` property to specify a property path, which when applied to a member, yields a `xsd:dateTime` value** that can be used for comparing and ordering all the versions of the same non-version object

> **Note** that anything beyond this point is currently under discussion.

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
1. a retention policy of type `ldes:LatestVersionSubset` MAY include a `ldes:amount` property of type `xsd:positiveInteger` to specify the number of most recent members to keep, based on `ldes:timestampPath` for sorting all members with the same `ldes:versionOfPath`
2. if a retention policy of type `ldes:LatestVersionSubset` does not include a `ldes:amount` property, it MUST default to `1`
3. if the event stream has a `ldes:timestampPath`, a retention policy of type `ldes:LatestVersionSubset` MAY include a `ldes:timestampPath` property to override which member property to use for the timestamp to sort members
4. if the event stream does not have a `ldes:timestampPath`, a retention policy of type `ldes:LatestVersionSubset` MUST include a `ldes:timestampPath` property to determine which member property to use for the timestamp to sort members
5. if the event stream has a `ldes:timestampPath` and a retention policy of type `ldes:LatestVersionSubset` does not override it, the retention policy MUST use the event stream `ldes:timestampPath` property to determine the member's timestamp value
6. a retention policy of type `ldes:LatestVersionSubset` MAY include a `ldes:versionKey` property, which is a `rdf:List` of SHACL property paths that specifies the member properties that MUST be concatenated to find a key for grouping the members
7. if a retention policy of type `ldes:LatestVersionSubset` includes a `ldes:versionKey` property that is an empty `rdf:List`, then all the member in the collection MUST be seen as all having the same non-version object, i.e. the retention policy does not need to group members and simply removes all but the N most recent members where N is given by the `ldes:amount` property
8. if the event stream has a `ldes:versionOfPath` and a retention policy of type `ldes:LatestVersionSubset` does not define a `ldes:versionKey` property, it MAY include a `ldes:versionOfPath` property to override which member property to use for grouping the members by their non-version object
9. if the event stream does not have a `ldes:versionOfPath` and a retention policy of type `ldes:LatestVersionSubset` does not define a `ldes:versionKey` property, it MUST include a `ldes:versionOfPath` property to determine which member property to use for grouping the members by their non-version object
10. if the event stream has a `ldes:versionOfPath` and a retention policy of type `ldes:LatestVersionSubset` does not override it and the retention policy does not define a `ldes:versionKey` property, it MUST use the event stream `ldes:versionOfPath` property to determine which member property to use for grouping the members by their non-version object

#### Point-In-Time Retention Policies (LPRR-PIT)
1. a retention policy of type `ldes:PointInTimePolicy` MUST include a `ldes:pointInTime` property of type `xsd:dateTime` to specify the cutoff point in time on or after which to keep members, based on `ldes:timestampPath` for determining the member's timestamp for comparing against
2. if the event stream has a `ldes:timestampPath`, a retention policy of type `ldes:PointInTimePolicy` MAY include a `ldes:timestampPath` property to override which member property to use for the timestamp to compare against its `ldes:pointInTime`
3. if the event stream does not have a `ldes:timestampPath`, a retention policy of type `ldes:PointInTimePolicy` MUST include a `ldes:timestampPath` property to determine which member property to use for the timestamp to compare against its `ldes:pointInTime`
4. if the event stream has a `ldes:timestampPath` and a retention policy of type `ldes:PointInTimePolicy` does not override it, the retention policy MUST use the event stream `ldes:timestampPath` property to determine the member's timestamp value


