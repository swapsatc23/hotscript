import { Booleans } from "../src/internals/booleans/Booleans";
import {
  Apply,
  arg0,
  arg1,
  arg2,
  arg3,
  ComposeLeft,
  Constant,
  Call,
  Pipe,
  _,
} from "../src/internals/core/Core";
import { Strings } from "../src/internals/strings/Strings";
import { Objects } from "../src/internals/objects/Objects";
import { Tuples } from "../src/internals/tuples/Tuples";
import { Equal, Expect } from "../src/internals/helpers";
import { Match } from "../src/internals/match/Match";
import { Numbers } from "../src/internals/numbers/Numbers";

describe("Objects", () => {
  describe("Create", () => {
    it("should support regular objects and output them as is", () => {
      type res1 = Call<
        //   ^?
        Objects.Create,
        { a: string; b: number }
      >;
      type test1 = Expect<Equal<res1, { a: string; b: number }>>;
    });

    it("should interpolate arguments", () => {
      type res2 = Apply<
        //   ^?
        Objects.Create<{ a: arg0; b: arg1 }>,
        [1, 2]
      >;
      type test2 = Expect<Equal<res2, { a: 1; b: 2 }>>;

      type res3 = Apply<
        //   ^?
        Objects.Create<{ a: arg0; b: [arg1, arg2]; c: { d: arg3 } }>,
        [1, 2, 3, 4]
      >;
      type test3 = Expect<Equal<res3, { a: 1; b: [2, 3]; c: { d: 4 } }>>;
    });

    it("should support arbitrary functions", () => {
      type res1 = Call<
        //   ^?
        Objects.Create<{
          addition: Numbers.Add<10, _>;
          division: Numbers.Div<_, 2>;
          nested: [Numbers.GreaterThan<0>];
          recursion: ComposeLeft<
            [
              Objects.Create<{
                label: Strings.Prepend<"number: ">;
                content: Strings.Append<" is the number we got!">;
              }>,
              Objects.Create<{
                post: arg0;
              }>
            ]
          >;
        }>,
        10
      >;
      type test2 = Expect<
        Equal<
          res1,
          {
            addition: 20;
            division: 5;
            nested: [true];
            recursion: {
              post: {
                label: "number: 10";
                content: "10 is the number we got!";
              };
            };
          }
        >
      >;

      type res3 = Apply<
        //   ^?
        Objects.Create<{ a: arg0; b: [arg1, arg2]; c: { d: arg3 } }>,
        [1, 2, 3, 4]
      >;
      type test3 = Expect<Equal<res3, { a: 1; b: [2, 3]; c: { d: 4 } }>>;
    });
  });

  describe("Update", () => {
    it("basic", () => {
      type res0 = Call<Objects.Update<"a", Numbers.Add<1>>, { a: 1; b: 1 }>;
      //    ^?
      type test0 = Expect<Equal<res0, { a: 2; b: 1 }>>;

      type res1 = Call<Objects.Update<"a[0]", 4>, { a: [1, 2, 3] }>;
      //    ^?
      type test1 = Expect<Equal<res1, { a: [4, 2, 3] }>>;

      type res2 = Call<
        //   ^?
        Objects.Update<"a.b", Numbers.Add<1>>,
        { a: { b: 1 }; c: "" }
      >;
      type test2 = Expect<Equal<res2, { a: { b: 2 }; c: "" }>>;

      type res3 = Call<Objects.Update<"a.b", "Hello">, { a: { b: 1 } }>;
      //    ^?
      type test3 = Expect<Equal<res3, { a: { b: "Hello" } }>>;
    });

    it("should add new properties if they do not exist", () => {
      type res4 = Call<Objects.Update<"a.b", 2>, { a: { c: 1 } }>;
      //    ^?
      type test4 = Expect<Equal<res4, { a: { c: 1; b: 2 } }>>;

      type res5 = Call<Objects.Update<"a.b.c.d", 2>, { a: { e: 1 } }>;
      //    ^?
      type test5 = Expect<Equal<res5, { a: { b: { c: { d: 2 } }; e: 1 } }>>;
    });
  });

  it("FromEntries", () => {
    type res1 = Call<
      //   ^?
      Objects.FromEntries,
      ["a", string] | ["b", number]
    >;
    type test1 = Expect<Equal<res1, { a: string; b: number }>>;
  });

  it("Entries", () => {
    type res1 = Call<
      //   ^?
      Objects.Entries,
      { a: string; b: number }
    >;

    type test1 = Expect<Equal<res1, ["a", string] | ["b", number]>>;

    type res2 = Call<
      //   ^?
      Objects.Entries,
      ["a", "b"]
    >;
    type test2 = Expect<Equal<res2, [0, "a"] | [1, "b"]>>;
  });

  it("Entries >> FromEntries identity", () => {
    type res1 = Pipe<
      { a: string; b: number },
      [Objects.Entries, Objects.FromEntries]
    >;
    //   ^?

    type test1 = Expect<Equal<res1, { a: string; b: number }>>;
  });

  it("MapValues", () => {
    type res1 = Call<
      //   ^?
      Objects.MapValues<Strings.ToString>,
      { a: 1; b: true }
    >;
    type test1 = Expect<Equal<res1, { a: "1"; b: "true" }>>;
  });

  it("MapKeys", () => {
    type res1 = Call<
      //   ^?
      Objects.MapKeys<Strings.Prepend<"get_">>,
      { a: 1; b: true }
    >;
    type test1 = Expect<Equal<res1, { get_a: 1; get_b: true }>>;
  });

  it("Pick", () => {
    type res1 = Call<
      //   ^?
      Objects.Pick<"a">,
      { a: 1; b: true }
    >;
    type test1 = Expect<Equal<res1, { a: 1 }>>;
  });

  it("Readonly", () => {
    type res1 = Call<
      //   ^?
      Objects.Readonly,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { readonly a: 1; readonly b: true }>>;
    type res2 = Call<
      //   ^?
      Objects.Readonly<{ a: 1; b: true }>
    >;
    type tes2 = Expect<Equal<res2, { readonly a: 1; readonly b: true }>>;
  });

  it("Required", () => {
    type res1 = Call<
      //   ^?
      Objects.Required,
      { a?: 1; b?: true }
    >;
    type tes1 = Expect<Equal<res1, { a: 1; b: true }>>;
    type res2 = Call<
      //   ^?
      Objects.Required<{ a?: 1; b?: true }>
    >;
    type tes2 = Expect<Equal<res2, { a: 1; b: true }>>;
  });

  it("Partial", () => {
    type res1 = Call<
      //   ^?
      Objects.Partial,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { a?: 1; b?: true }>>;
    type res2 = Call<
      //   ^?
      Objects.Partial<{ a: 1; b: true }>
    >;
    type tes2 = Expect<Equal<res2, { a?: 1; b?: true }>>;
  });

  it("Omit", () => {
    type res1 = Call<
      //   ^?
      Objects.Omit<"a">,
      { a: 1; b: true }
    >;
    type test1 = Expect<Equal<res1, { b: true }>>;
  });

  it("PickBy", () => {
    type res1 = Call<
      //   ^?
      Objects.PickBy<Booleans.Extends<1>>,
      { a: 1; b: true; c: 1 }
    >;
    type test1 = Expect<Equal<res1, { a: 1; c: 1 }>>;
  });

  it("OmitBy", () => {
    type res1 = Call<
      //   ^?
      Objects.OmitBy<Booleans.Extends<1>>,
      { a: 1; b: true; c: 1 }
    >;
    type test1 = Expect<Equal<res1, { b: true }>>;
  });

  describe("PartialDeep", () => {
    it("primitives", () => {
      type res0 = Call<Objects.PartialDeep, number>;
      type test0 = Expect<Equal<res0, number>>;

      type res1 = Call<Objects.PartialDeep, string>;
      type test1 = Expect<Equal<res1, string>>;

      type res2 = Call<Objects.PartialDeep, boolean>;
      type test2 = Expect<Equal<res2, boolean>>;

      type res3 = Call<Objects.PartialDeep, bigint>;
      type test3 = Expect<Equal<res3, bigint>>;

      type res4 = Call<Objects.PartialDeep, symbol>;
      type test4 = Expect<Equal<res4, symbol>>;

      type res5 = Call<Objects.PartialDeep, undefined>;
      type test5 = Expect<Equal<res5, undefined>>;

      type res6 = Call<Objects.PartialDeep, null>;
      type test6 = Expect<Equal<res6, null>>;

      type res7 = Call<Objects.PartialDeep, Function>;
      type test7 = Expect<Equal<res7, Function>>;
    });

    it("Map & Set", () => {
      type res0 = Call<Objects.PartialDeep, Map<string, boolean>>;
      type test0 = Expect<Equal<res0, Map<string, boolean>>>;

      type res1 = Call<Objects.PartialDeep, Map<string, { a: number }>>;
      type test1 = Expect<Equal<res1, Map<string, { a?: number }>>>;

      type res2 = Call<Objects.PartialDeep, ReadonlyMap<string, boolean>>;
      type test2 = Expect<Equal<res2, ReadonlyMap<string, boolean>>>;

      type res3 = Call<
        Objects.PartialDeep,
        ReadonlyMap<string, { checked: boolean }>
      >;
      type test3 = Expect<
        Equal<res3, ReadonlyMap<string, { checked?: boolean }>>
      >;

      type res4 = Call<Objects.PartialDeep, WeakMap<{ key: string }, boolean>>;
      type test4 = Expect<Equal<res4, WeakMap<{ key?: string }, boolean>>>;

      type res5 = Call<
        Objects.PartialDeep,
        WeakMap<{ key: string }, { value: boolean }>
      >;
      type test5 = Expect<
        Equal<res5, WeakMap<{ key?: string }, { value?: boolean }>>
      >;

      type res6 = Call<Objects.PartialDeep, Set<string>>;
      type test6 = Expect<Equal<res6, Set<string>>>;

      type res7 = Call<Objects.PartialDeep, Set<number[]>>;
      type test7 = Expect<Equal<res7, Set<(number | undefined)[]>>>;

      type res8 = Call<Objects.PartialDeep, ReadonlySet<string>>;
      type test8 = Expect<Equal<res8, ReadonlySet<string>>>;
    });

    it("Objects and Arrays", () => {
      type res1 = Call<Objects.PartialDeep, []>;
      type test1 = Expect<Equal<res1, []>>;

      type res2 = Call<Objects.PartialDeep, never[]>;
      type test2 = Expect<Equal<res2, undefined[]>>;

      type res3 = Call<Objects.PartialDeep, [1, 2, 3]>;
      type test3 = Expect<
        Equal<res3, [(1 | undefined)?, (2 | undefined)?, (3 | undefined)?]>
      >;

      type res4 = Call<Objects.PartialDeep, readonly number[]>;
      type test4 = Expect<Equal<res4, readonly (number | undefined)[]>>;

      type res5 = Call<Objects.PartialDeep, number[]>;
      type test5 = Expect<Equal<res5, (number | undefined)[]>>;

      type res6 = Call<Objects.PartialDeep, Array<number>>;
      type test6 = Expect<Equal<res6, Array<number | undefined>>>;

      type res7 = Call<
        Objects.PartialDeep,
        { readonly obj: unknown; readonly arr: readonly unknown[] }
      >;
      type test7 = Expect<
        Equal<
          res7,
          {
            readonly obj?: unknown | undefined;
            readonly arr?: readonly unknown[] | undefined;
          }
        >
      >;

      type res8 = Call<Objects.PartialDeep, { a: 1; b: 2; c: 3 }>;
      type test8 = Expect<Equal<res8, { a?: 1; b?: 2; c?: 3 }>>;

      type res9 = Call<Objects.PartialDeep, { foo: () => void }>;
      type test9 = Expect<Equal<res9, { foo?: () => void }>>;
    });

    it("Promises", () => {
      type res0 = Call<Objects.PartialDeep, Promise<number>>;
      type test0 = Expect<Equal<res0, Promise<number>>>;

      type res1 = Call<
        Objects.PartialDeep,
        Promise<{ api: () => { play: () => void; pause: () => void } }>
      >;
      type test1 = Expect<
        Equal<
          res1,
          Promise<{ api?: () => { play: () => void; pause: () => void } }>
        >
      >;
    });

    it("Complex structures", () => {
      type ComplexNestedRequired = {
        simple: number;
        nested: {
          date: Date;
          func: () => string;
          array: { bar: number }[];
          tuple: [string, number, { good: boolean }];
          set: Set<{ name: string }>;
          map: Map<
            string,
            {
              name: string;
            }
          >;
          promise: Promise<{ foo: string; bar: number }>;
        };
      };

      type ComplexNestedPartial = {
        simple?: number;
        nested?: {
          date?: Date;
          func?: () => string;
          array?: ({ bar?: number } | undefined)[];
          set?: Set<{ name?: string }>;
          tuple?: [string?, number?, { good?: boolean }?];
          map?: Map<
            string,
            {
              name?: string;
            }
          >;
          promise?: Promise<{ foo?: string; bar?: number }>;
        };
      };

      type res1 = Call<Objects.PartialDeep, ComplexNestedRequired>;
      type test1 = Expect<Equal<res1, ComplexNestedPartial>>;
    });
  });

  describe("Assign", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<
        //   ^?
        Tuples.Reduce<Objects.Assign, {}>,
        [{ a: 1 }, { b: true }, { c: 1 }]
      >;
      type test1 = Expect<Equal<res1, { a: 1; b: true; c: 1 }>>;

      type res2 = Call<
        //   ^?
        Tuples.Reduce<Objects.Assign, {}>,
        [{ a: 2 }, { b: true }, { c: 2 }]
      >;
      type test2 = Expect<Equal<res2, { a: 2; b: true; c: 2 }>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<
        //   ^?
        Tuples.Map<Objects.Assign<{ new: "new" }>>,
        [{ a: 2 }, { b: true }, { c: 2 }]
      >;

      type test1 = Expect<
        Equal<
          res1,
          [{ new: "new"; a: 2 }, { new: "new"; b: true }, { new: "new"; c: 2 }]
        >
      >;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Call<Objects.Assign<{ a: string }, { b: number }>>;
      //    ^?
      type test1 = Expect<Equal<res1, { a: string; b: number }>>;
    });
  });

  it("KebabCase", () => {
    type res1 = Call<
      //   ^?
      Objects.KebabCase,
      { helloWorld: string; userName: string }
    >;

    type test1 = Expect<
      Equal<res1, { "hello-world": string; "user-name": string }>
    >;
  });

  it("SnakeCase", () => {
    type res1 = Call<
      //   ^?
      Objects.SnakeCase,
      { helloWorld: string; userName: string }
    >;

    type test1 = Expect<
      Equal<res1, { hello_world: string; user_name: string }>
    >;
  });

  it("CamelCase", () => {
    type res1 = Call<
      //   ^?
      Objects.CamelCase,
      { hello_world: string; user_name: string }
    >;

    type test1 = Expect<Equal<res1, { helloWorld: string; userName: string }>>;
  });

  it("KebabCaseDeep", () => {
    type res1 = Call<
      //   ^?
      Objects.KebabCaseDeep,
      {
        helloWorld: string;
        currentUser: { userName: string };
        friends: { userName: string }[];
      }
    >;

    type test1 = Expect<
      Equal<
        res1,
        {
          "hello-world": string;
          "current-user": {
            "user-name": string;
          };
          friends: {
            "user-name": string;
          }[];
        }
      >
    >;
  });

  it("SnakeCaseDeep", () => {
    type res1 = Call<
      //   ^?
      Objects.SnakeCaseDeep,
      {
        helloWorld: string;
        currentUser: { userName: string };
        friends: { userName: string }[];
      }
    >;

    type test1 = Expect<
      Equal<
        res1,
        {
          hello_world: string;
          current_user: {
            user_name: string;
          };
          friends: {
            user_name: string;
          }[];
        }
      >
    >;
  });

  it("CamelCaseDeep", () => {
    type res1 = Call<
      //   ^?
      Objects.CamelCaseDeep,
      {
        hello_world: string;
        current_user: {
          user_name: string;
        };
        friends: {
          user_name: string;
        }[];
      }
    >;

    type test1 = Expect<
      Equal<
        res1,
        {
          helloWorld: string;
          currentUser: {
            userName: string;
          };
          friends: {
            userName: string;
          }[];
        }
      >
    >;
  });

  describe("Get", () => {
    it("should retrieve a deep property", () => {
      type res1 = Call<
        //   ^?
        Objects.Get<"a.b.c.d", { a: { b: { c: { d: string } } } }>
      >;
      type test1 = Expect<Equal<res1, string>>;

      type res2 = Pipe<
        //  ^?
        { a: { b: { c: { d: string } } } },
        [Objects.Get<"a.b.c.d">]
      >;
      type test2 = Expect<Equal<res2, string>>;
    });

    it("should support union of objects", () => {
      type input =
        | { a: { b: string | { c: { d: string } } } }
        | { a: { b: { c: { d: number } } } };

      type res1 = Call<Objects.Get<"a.b.c.d", input>>;
      //    ^?
      type test1 = Expect<Equal<res1, string | number | undefined>>;

      type res2 = Pipe<input, [Objects.Get<"a.b.c.d">]>;
      //    ^?
      type test2 = Expect<Equal<res2, string | number | undefined>>;
    });

    it("should support arrays", () => {
      type res1 = Call<Objects.Get<"a.b[0].d", { a: { b: { d: string }[] } }>>;
      //   ^?
      type test1 = Expect<Equal<res1, string>>;
    });

    it("should support tuples", () => {
      type input = { a: { b: [{ d: string }, "hello"] } };
      type res1 = Call<Objects.Get<"a.b[0].d", input>>;
      //   ^?

      type test1 = Expect<Equal<res1, string>>;

      type res2 = Call<Objects.Get<"a.b[1]", input>>;
      //   ^?
      type test2 = Expect<Equal<res2, "hello">>;
    });
  });

  it("Record", () => {
    type res1 = Call<
      //   ^?
      Objects.Record<"a" | "b">,
      number
    >;
    type tes1 = Expect<Equal<res1, { a: number; b: number }>>;
    type res2 = Call<
      //   ^?
      Objects.Record<"a" | "b", number>
    >;
    type tes2 = Expect<Equal<res2, { a: number; b: number }>>;
    type res3 = Apply<
      //   ^?
      Objects.Record,
      ["a" | "b", number]
    >;
    type tes3 = Expect<Equal<res3, { a: number; b: number }>>;
  });

  describe("Composition", () => {
    type User = {
      id: symbol;
      firstName: string;
      lastName: string;
    };

    type APIUser = Pipe<
      //    ^?
      User,
      [
        Objects.OmitBy<Booleans.Equals<symbol>>,
        Objects.Assign<{ metadata: { newUser: true } }>,
        Objects.SnakeCaseDeep,
        Objects.Assign<{ id: string }>
      ]
    >;

    type test1 = Expect<
      Equal<
        APIUser,
        {
          id: string;
          metadata: {
            new_user: true;
          };
          first_name: string;
          last_name: string;
        }
      >
    >;

    // prettier-ignore
    type res5 = Pipe<
      //    ^?
      "/users/<id:string>/posts/<index:number>",
      [
        Strings.Split<"/">,
        Tuples.Filter<Strings.StartsWith<"<">>,
        Tuples.Map<
          ComposeLeft<[
            Strings.Replace<"<", "">,
            Strings.Replace<">", "">,
            Strings.Split<":">
          ]>
        >,
        Tuples.ToUnion,
        Objects.FromEntries,
        Objects.MapValues<
          Match<[
            Match.With<"string", Constant<string>>,
            Match.With<"number", Constant<number>>
          ]>
        >
      ]
    >;
    type test5 = Expect<
      Equal<
        res5,
        {
          id: string;
          index: number;
        }
      >
    >;
  });

  it("Keys", () => {
    type res0 = Call<Objects.Keys, [3, 4, 5]>;
    //   ^?
    type test0 = Expect<Equal<res0, 0 | 1 | 2>>;

    type res1 = Call<Objects.Keys, boolean[]>;
    //   ^?
    type test1 = Expect<Equal<res1, number>>;

    type res2 = Call<Objects.Keys, { type: string; src: { value: string } }>;
    //   ^?
    type test2 = Expect<Equal<res2, "type" | "src">>;

    type res3 = Call<Objects.Keys, unknown>;
    //   ^?
    type test3 = Expect<Equal<res3, never>>;

    type res4 = Call<Objects.Keys, Record<string, boolean>>;
    //   ^?
    type test4 = Expect<Equal<res4, string>>;
  });

  it("Values", () => {
    type res0 = Call<Objects.Values, [3, 4, 5]>;
    //   ^?
    type test0 = Expect<Equal<res0, 3 | 4 | 5>>;

    type res1 = Call<Objects.Values, boolean[]>;
    //   ^?
    type test1 = Expect<Equal<res1, boolean>>;

    type res2 = Call<Objects.Values, { type: string; src: { value: string } }>;
    //   ^?
    type test2 = Expect<Equal<res2, string | { value: string }>>;

    type res3 = Call<Objects.Values, unknown>;
    //   ^?
    type test3 = Expect<Equal<res3, never>>;

    type res4 = Call<Objects.Values, Record<string, boolean>>;
    //   ^?
    type test4 = Expect<Equal<res4, boolean>>;
  });

  describe("AllPaths", () => {
    type res1 = Call<
      // ^?
      Objects.AllPaths,
      {
        shallow: string;
        object: {
          nested: boolean;
        };
        constant: true;
        tuple: [0, 1];
        union:
          | { flag: true; ordinal: number }
          | { flag: false; cardinal: string };
        array: { inner: number }[];
        conditional?: number;
      }
    >;
    type test1 = Expect<
      Equal<
        res1,
        | "object.nested"
        | "object"
        | "shallow"
        | "constant"
        | "tuple"
        | "tuple[0]"
        | "tuple[1]"
        | "union"
        | "union.flag"
        | "union.ordinal"
        | "union.cardinal"
        | "array"
        | `array[${number}]`
        | `array[${number}].inner`
        | "conditional"
      >
    >;

    type res2 = Call<Objects.AllPaths, unknown>;
    //   ^?
    type test2 = Expect<Equal<res2, string>>;

    type res3 = Call<Objects.AllPaths, any>;
    //   ^?
    type test3 = Expect<Equal<res3, string>>;

    type res4 = Call<Objects.AllPaths, { f: any }>;
    //   ^?
    type test4 = Expect<Equal<res4, "f" | `f.${string}`>>;

    type res5 = Call<Objects.AllPaths, [0, 1]>;
    //   ^?
    type test5 = Expect<Equal<res5, "[0]" | "[1]">>;

    type res6 = Call<Objects.AllPaths, boolean[]>;
    //   ^?
    type test6 = Expect<Equal<res6, `[${number}]`>>;

    const readonlyObj = { a: 1, b: 2, c: [{ d: 3 }, { e: 4 }] } as const;
    type res7 = Call<Objects.AllPaths, typeof readonlyObj>;
    //   ^?
    type test7 = Expect<
      Equal<
        res7,
        | "a"
        | "b"
        | "c"
        | "c[0]"
        | "c[1]"
        | "c[0].d"
        | "c[1].d"
        | "c[0].e"
        | "c[1].e"
      >
    >;
  });
});
