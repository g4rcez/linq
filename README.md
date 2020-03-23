# linq-arrays

`The name LINQ is already used ::sad::`

Based on `System.Linq` in C#, but in TS for browser and node (server side);

## Features

- The same methods (not all) of `Array.prototype`, but with composition (curry parameters)
- Typescript out of box
- Make the massive and repetitive operations for you, like `sort by key`, `order by key`, `sorter for strings/numbers/date`
- A set of tools in Fluent Interface to work with arrays

## Install

Simple, just choose your package manage and drop the command

```bash
yarn add linq-arrays
npm i linq-arrays
pnpm add linq-arrays
```

## Using

```typescript
const array = new Linq([1,2,3,4,5,6,7,8,9,10]);
// you can create a instance with Linq.From(array) 
array.Sum() // 55
/* 
    with .Where, you can use some symbols to make your filter more simple
    - != : compare use !=
	- !== : compare use !== 
	- < : compare use <
	- <= : compare use <=
	- == : compare use ==
	- === : compare use ===
	- > : compare use >
	- >= : compare use >=
	eq: compare use Equals in `src/utils.ts`
	is: compare use Object.is (JS method)
*/
array.Where({ symbol: "!==", value: 2 }).Sum() // 53
// or you can pass you function
array.Where((number, index, allItems) => number !== 2) // the same of Array.prototype.filter
array.ToArray() // return the array after all operations 
/* 
    args accept a method, the same of Array.prototype.map. 
    If empty, just return the array like .ToArray
*/
array.Select((x) => x ** 2) // the same of Array.prototype.map
```

## API

Static methods

- `constructor(array: Type[])`: Constructor receive an array for base operations
- `static From<T>(array: T[])`: The same of use `new Linq()`
- `static Map(callback: (item: T, i: number, array: T[]) => T)`: The same of `Array.prototype.map`, but curried parameters (callback and array)
- static Filter: The same of `Array.prototype.filter`, but curried paramets (callback and array)
- `static GroupBy<GENERICS>(key: keyof GENERICS, array: GENERICS[])`: Group items by key in array, any key it's a object with value of key 
- static Find: The same of `Array.prototype.find`, but curried paramets (callback and array)
- static Some: The same of `Array.prototype.some`, but curried paramets (callback and array)
- static Every: The same of `Array.prototype.every`, but curried paramets (callback and array)
- static All: The same of `Every`
- `static Unique(<T>(array: T[], key?: keyof T)) & (<T>(array: T[]))`: Get unique items of array, from key or from values (works correctly only for primitive types)
- static Reduce: The same of `Array.prototype.reduce`, but curried paramets (callback, initialValue and array)
- `static Chunk(size: number, array: GENERICS[])`: Create a chunk with N items of array. Like pagination, but don't provide page control
- `static Range(firstOrLength: number | string, secondOrSteps?: number | string, jumps)`: Create a range from two integers, two strings or works with one string in pattern `INITIAL..FINAL` or `INITIAL..JUMPS..FINAL`
- `static Sort(array: GENERICS[], key?: SortParameters<GENERICS>)`: Sort array by key or function sorter (the same parameter of `Array.prototype.sort`). If Sort called with null parameters, use the `array.sort()` and order by ASCII characters order
- `static Repeat(element: GENERICS, repeat: number)`: repeat N times in array with the element (first parameter)
- `static Contains(element: GENERICS | keyof GENERICS, array: GENERICS[])`: Check if array contains the element
- `static Max(element: keyof GENERICS, array: GENERICS[]) => number)`: Get the maximum value of property/value in array
- `static Min(element: keyof GENERICS, array: GENERICS[]) => number)`: Get the minimum value of property/value in array
- `static MapToArray<Key, Value>(map: Map<Key, Value>)`: Convert any Map to array
- `static ArrayToMap(key: keyof T, array: T[]))`: Create a Map from array and use the value of key in each object as key for Map
- `static ArrayToObject(<T>(key: keyof T, array: T[])`: Create a object from array and use the value of key in each object as key for object

Instance methods

- `Reverse()`: use the `Array.prototype.reverse` to reverse array
- `Add(el: Type | Type[])`: Add an item/items to last position of array with push/concat
- `Prepend(el: Type | Type[])`: Add an item/items to first position of array with push/concat
- `Concat(list: Type[])`: Concat an array to your array
- `Select(transform?: ArrayCallback<Type>)`: Get array from Linq instance. The argument is a optional function, and works equals `Array.prototype.map`
- `Take(init: number, end?: number)`: Take `n` items of array. If end is null, use `n:array.length`
- `Head()`: Get first item of array
- `Tail()`: Return all items, except first
- `Skip(jumps: number | ArrayCallbackAssertion<Type>)`: Skip the `n` items or skip while the callback is false
- `Distinct()`: like Linq.Unique
- `ToArray()`: Get array from instance
- `First(predicate?: ArrayCallbackAssertion<Type>)`: Return the first item of array or apply `Array.prototype.find`
- `Last(predicate?: ArrayCallbackAssertion<Type>)`: Return the last item of array or apply `Array.prototype.find` in reverse array (using `Array.prototype.reverse`)
- `Sum(key?: keyof Type)`: Sum all items of array. You can specify the property or sum all primitive values in array
- `Average(key?: keyof Type)`: Get Average of `Linq.Sum`
- `GroupBy(key: keyof Type)`: The same of static method `Linq.GroupBy`
- `Except(exceptions: Type[])`: Get all items not in argument array 
- `Intersect(commons: Type[])`: Get all items in argument array
- `OrderBy(key?: keyof Type, sort?: OrderKeys)`: Order array from key
- `Includes(object: Type)`: Check if array includes the object
- `In(array: Type[])`: Check if instance array has items in argument array
- `Empty()`: nothing to comment
- `ToMap<KEY>(key: keyof Type): Map<KEY, Type>`: convert the array to Map, using the value of object[key] to Map keys
- `Zip<T>(array: T[], fn: (first: Type, second?: T) => any)`
- `Count(predicate?: ArrayCallbackAssertion<Type>)`: Count items based on predicate or just array.length
- `Get(n: number)`: Get item in `n` position
- `Clone()`: deepClone instance array
- `ToObject(key: keyof Type): ArrayAsObj<Type>`
- `All(predicate: ArrayCallbackAssertion<Type>)`: The same of `Array.prototype.every`

## ToDo

- Write best Readme
- Create a page to interactive doc
- Write unit tests