# linq-arrays

LINQ-style query operators for JavaScript and TypeScript. `Linq<T>` models LINQ to Objects over synchronous `Iterable<T>` sources, with deferred sequence operators, immediate terminal operators, and algorithms that stream where the operation permits it.

## What changed from the array-only implementation

The earlier fluent wrapper was limited to arrays and performed work while each method was called. It replaced the wrapper's internal array as methods were chained, projected with `Array.map`, materialized filtered values before counting, used repeated searches for distinct values, and rebuilt chunks with repeated array copies. It also returned plain objects from grouping and didn't provide the core LINQ composition surface for nested projections, joins, secondary ordering, sequence comparison, or the standard first/single/element access operators.

The query implementation now follows the LINQ-to-Objects execution model:

- Sequence-returning operators (`Where`, `Select`, `SelectMany`, `Take`, `Skip`, set operators, joins, and others) defer enumeration and return a new query without mutating the source query.
- Scalar operators (`Count`, `Any`, `First`, `Sum`, and others) execute immediately, use one pass where possible, and short-circuit when their result is known.
- Filtering, projection, concatenation, partitioning, distinct, and set composition stream items. `OrderBy`, `GroupBy`, and `Reverse` buffer because their results depend on later source elements; joins build a hash lookup for the inner sequence.
- `Distinct`, joins, and grouping use JavaScript `Set`/`Map` key semantics. Object keys compare by identity, as ordinary C# reference objects do by default.

The API implements the core synchronous LINQ-to-Objects operators listed below; it does not reproduce every .NET overload and does not support `IQueryable<T>` providers, SQL translation, expression trees, or C# query-expression syntax. JavaScript type erasure means runtime type operators such as `OfType` and `Cast` require a type guard.

## Install

```bash
yarn add linq-arrays
# or
npm install linq-arrays
```

## Query and execute

```typescript
import Linq from "linq-arrays";

const numbers = [0, 1, 2, 3, 4, 5, 6];
const evenSquares = new Linq(numbers)
  .Where((number) => number % 2 === 0)
  .Select((number) => number ** 2);

// No work is done until the query is enumerated.
const values = evenSquares.ToArray(); // [0, 4, 16, 36]

for (const value of evenSquares) {
  console.log(value);
}
```

Queries are re-enumerated on each iteration, so edits to a reusable source array are observed. A one-shot generator remains one-shot; use a factory-backed `Iterable` when a source must be replayed.

Indexed predicates and selectors receive a zero-based index:

```typescript
const thirdAndLater = new Linq(numbers).Where((_number, index) => index >= 2);
const indexed = thirdAndLater.Select((number, index) => ({ number, index }));
```

## Operators

### Sequence construction and composition

`Linq.From(source)`, `Linq.Empty<T>()`, `Linq.Range(start, count)`, and `Linq.Repeat(value, count)` create queries. Instance operators include `AsEnumerable`, `Append`, `Prepend`, `Concat`, `DefaultIfEmpty`, `Chunk`, and `Reverse`.

### Filtering and projection

`Where`, `OfType(typeGuard)`, `Cast(typeGuard)`, `Select`, `SelectMany`, `Take`, `Skip`, `TakeWhile`, `SkipWhile`, `TakeLast`, and `SkipLast` return deferred sequences.

```typescript
const names = new Linq([
  { name: "Ada", scores: [92, 98] },
  { name: "Grace", scores: [100] },
])
  .SelectMany((person) => person.scores, (person, score) => ({ name: person.name, score }))
  .Where((result) => result.score >= 95)
  .ToArray();
```

`OfType` and `Cast` take a TypeScript type guard because generic type parameters are erased at runtime. `OfType` skips values that fail the guard; `Cast` throws a `TypeError` on the first mismatch:

```typescript
const isString = (value: unknown): value is string => typeof value === "string";
const strings = new Linq<unknown>(["a", 1, "b"]).OfType(isString);
const checked = new Linq<unknown>(["a", 1, "b"]).Cast(isString); // Throws during enumeration.
```

### Ordering, grouping, and joins

`Order`, `OrderBy`, and `OrderByDescending` accept an optional comparator for non-primitive keys. Ordered queries support `ThenBy` and `ThenByDescending`; sorting is stable and evaluates each key selector once per element per enumeration.

`GroupBy` returns deferred `Grouping<TKey, TElement>` values. Each grouping exposes `Key`, `Count`, iteration, and `ToArray`. `Join` and `GroupJoin` preserve outer-sequence order and use a hash lookup for inner keys.

```typescript
const studentsByDepartment = new Linq(students)
  .GroupJoin(
    departments,
    (student) => student.departmentId,
    (department) => department.id,
    (student, matches) => ({ student, departments: Array.from(matches) }),
  );
```

### Set and sequence operators

`Distinct`, `DistinctBy`, `Except`, `ExceptBy`, `Intersect`, `IntersectBy`, `Union`, `UnionBy`, `SequenceEqual`, and `Zip` use streaming iterators plus `Set` lookups where appropriate. Set operators preserve first-sequence order and return unique values, matching LINQ set-operator behavior.

### Terminal operators

`Aggregate`, `All`, `Any`, `Average`, `Contains`, `Count`, `LongCount`, `ElementAt`, `ElementAtOrDefault`, `First`, `FirstOrDefault`, `Last`, `LastOrDefault`, `Single`, `SingleOrDefault`, `Min`, `Max`, `MinBy`, and `MaxBy` execute immediately. Numeric aggregates accept a number selector or numeric property key where relevant. `First`, `Last`, `Single`, `Average`, `Min`, and `Max` throw `RangeError` when the sequence has no required result; the `OrDefault` variants return `undefined` for an empty match.

### Materialization

`ToArray` and `ToList` return arrays; `ToHashSet` returns a `Set`; `ToDictionary` and `ToMap` return `Map` instances; `ToLookup` returns `Map<TKey, TElement[]>`. `ToDictionary` throws on duplicate keys, while `ToMap` overwrites earlier values for duplicate keys.

## Execution and memory

`Where`, `Select`, `SelectMany`, `Take`, `Skip`, `TakeWhile`, `SkipWhile`, `Append`, `Prepend`, `Concat`, `Distinct`, and `Zip` can produce values without reading the whole source. `Take` therefore works with an infinite iterable.

`Order`, `OrderBy`, `GroupBy`, `Reverse`, `Join`, `GroupJoin`, `Except`, `Intersect`, and `Union` need buffering or a lookup/set to preserve their semantics. Avoid materializing unbounded or infinite sources with `ToArray`, `Count`, sorting, grouping, reverse, or joins.

## Development

```bash
yarn test
yarn build
```

See Microsoft's [Introduction to LINQ Queries](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/introduction-to-linq-queries) and [Standard Query Operators Overview](https://learn.microsoft.com/en-us/dotnet/csharp/linq/standard-query-operators/) for the reference execution model and operator taxonomy.
