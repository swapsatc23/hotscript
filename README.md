# Higher-Order TypeScript (HOTScript)

A lodash-like library for types, with support for type-level lambda functions.

🚧 work in progress 🚧

```ts
// prettier-ignore
type res1 = Pipe<
  //  ^? 95
  [1, 2, 3, 4, 3, 4],
  [
    Tuples.Map<Numbers.Add<3>>,
    Tuples.Join<".">,
    Strings.Split<".">,
    Tuples.Map<Strings.ToNumber>,
    Tuples.Map<Numbers.Add<10>>,
    Tuples.Sum
  ]
>;

// This is a type-level "lambda"!
interface Duplicate extends Fn {
  return: [this["arg0"], this["arg0"]];
}

type result1 = Call<Tuples.Map<Duplicate>, [1, 2, 3, 4]>;
//     ^? [[1, 1], [2, 2], [3, 3], [4, 4]]

type result2 = Call<Tuples.FlatMap<Duplicate>, [1, 2, 3, 4]>;
//     ^? [1, 1, 2, 2, 3, 3, 4, 4]

// Let's compose some functions to transform an object type:
type ToAPIPayload<T> = Pipe<
  T,
  [
    Objects.OmitBy<Booleans.Equals<symbol>>,
    Objects.Assign<{ metadata: { newUser: true } }>,
    Objects.SnakeCaseDeep,
    Objects.Assign<{ id: string }>
  ]
>;
type T = ToAPIPayload<{
  id: symbol;
  firstName: string;
  lastName: string;
}>;
// Returns:
type T = {
  id: string;
  metadata: { new_user: true };
  first_name: string;
  last_name: string;
};
```

## TODO

- [ ] Function
  - [x] Pipe
  - [x] PipeRight
  - [x] Call
  - [x] Apply
  - [x] PartialApply
  - [x] Compose
  - [x] ComposeLeft
- [ ] Tuples
  - [x] Create
  - [x] Partition
  - [x] IsEmpty
  - [x] Zip
  - [x] ZipWith
  - [x] Sort
  - [x] Head
  - [x] At
  - [x] Tail
  - [x] Last
  - [x] FlatMap
  - [x] Find
  - [x] Sum
  - [x] Drop n
  - [x] Take n
  - [x] TakeWhile
  - [x] Join separator
  - [x] Map
  - [x] Filter
  - [x] Reduce
  - [x] ReduceRight
  - [x] Every
  - [x] Some
  - [x] ToUnion
- [ ] Object
  - [x] Readonly
  - [ ] Mutable
  - [ ] Required
  - [ ] Partial
  - [ ] ReadonlyDeep
  - [ ] MutableDeep
  - [ ] RequiredDeep
  - [ ] PartialDeep
  - [x] Record
  - [x] Create
  - [x] Get
  - [x] FromEntries
  - [x] Entries
  - [x] MapValues
  - [x] MapKeys
  - [x] GroupBy
  - [x] Assign
  - [x] Pick
  - [x] PickBy
  - [x] Omit
  - [x] OmitBy
  - [x] CamelCase
  - [x] CamelCaseDeep
  - [x] SnakeCase
  - [x] SnakeCaseDeep
  - [x] KebabCase
  - [x] KebabCaseDeep
- [ ] Union
  - [x] Map
  - [x] Extract
  - [x] ExtractBy
  - [x] Exclude
  - [x] ExcludeBy
- [ ] String
  - [x] Length
  - [x] TrimLeft
  - [x] TrimRight
  - [x] Trim
  - [x] Join
  - [x] Replace
  - [x] Slice
  - [x] Split
  - [x] Repeat
  - [x] StartsWith
  - [x] EndsWith
  - [x] ToTuple
  - [x] ToNumber
  - [x] ToString
  - [x] Prepend
  - [x] Append
  - [x] Uppercase
  - [x] Lowercase
  - [x] Capitalize
  - [x] Uncapitalize
  - [x] SnakeCase
  - [x] CamelCase
  - [x] KebabCase
  - [x] Compare
  - [x] Equal
  - [x] NotEqual
  - [x] LessThan
  - [x] LessThanOrEqual
  - [x] GreaterThan
  - [x] GreaterThanOrEqual
- [ ] Number
  - [x] Add
  - [x] Multiply
  - [x] Subtract
  - [x] Negate
  - [x] Power
  - [x] Div
  - [x] Mod
  - [x] Abs
  - [x] Compare
  - [x] GreaterThan
  - [x] GreaterThanOrEqual
  - [x] LessThan
  - [x] LessThanOrEqual
- [ ] Boolean
  - [x] And
  - [x] Or
  - [x] XOr
  - [x] Not
  - [x] Extends
  - [x] Equals
  - [x] DoesNotExtend
