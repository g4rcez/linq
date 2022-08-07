# linq-arrays

`The name LINQ is already used ::sad::`

Based on `System.Linq` in C#, but in TS for browser and node (server side);

## Features

- The same methods (not all) of `Array.prototype`
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