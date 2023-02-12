# HOTScript!

Type-level madness.

```ts
// prettier-ignore
type result = Pipe<
  //  ^? 78
  [1, 2, 3, 4, 3, 4],
  [
    TupleMap<Add<3>>,
    Join<'.'>,
    Split<'.'>,
    TupleMap<ToNumber>,
    TupleMap<Add<10>>,
    Sum
  ]
>;
```

## TODO

- [ ] Composition
  - [ ] Pipe
  - [ ] Compose
- [ ] Tuples
  - [ ] Head
  - [ ] Tail
  - [ ] Map
  - [ ] FlatMap
  - [ ] Filter
  - [ ] Reduce
  - [ ] Find
  - [ ] Zip
  - [ ] Partition
  - [ ] Drop n
  - [ ] Take n
  - [ ] TakeWhile
  - [ ] Join separator
- [ ] Object
  - [ ] Assign
  - [ ] FromEntries
  - [ ] Entries
  - [ ] Pick
  - [ ] PickBy
  - [ ] Omit
  - [ ] OmitBy
- [ ] Union
  - [ ] Assign
  - [ ] FromEntries
  - [ ] Entries
  - [ ] Extract
  - [ ] ExtractBy
  - [ ] Exclude
  - [ ] ExcludeBy
- [ ] String
  - [ ] Concat
  - [ ] Uppercase
  - [ ] Lowercase
  - [ ] Capitalize
  - [ ] Uncapitalize
  - [ ] Split separator
  - [ ] Words
  - [ ] Reduce
