import { Apply, Call, Fn } from "../../core/Core";
import { Strings } from "../../strings/Strings";
import { Equal, Prettify, Primitive, UnionToIntersection } from "../../helpers";
import { Std } from "../../std/Std";

export type Keys<src> = src extends unknown[]
  ? {
      [key in keyof src]: key;
    }[number] extends infer res
    ? res extends string
      ? Call<Strings.ToNumber, res> & keyof src
      : res & keyof src
    : never
  : keyof src;

export type Values<src> = Keys<src> extends infer keys extends keyof src
  ? src[keys]
  : never;

export type FromEntries<entries extends [PropertyKey, any]> = {
  [entry in entries as entry[0]]: entry[1];
};

export type Entries<T> = Keys<T> extends infer keys extends keyof T
  ? {
      [K in keys]: [K, T[K]];
    }[keys]
  : never;

type GroupByImplRec<xs, fn extends Fn, acc = {}> = xs extends [
  infer first,
  ...infer rest
]
  ? Call<fn, first> extends infer key extends PropertyKey
    ? GroupByImplRec<
        rest,
        fn,
        Std._Omit<acc, key> & {
          [K in key]: [
            ...(key extends keyof acc ? Extract<acc[key], readonly any[]> : []),
            first
          ];
        }
      >
    : never
  : acc;

export type GroupBy<xs, fn extends Fn> = Prettify<GroupByImplRec<xs, fn>>;

export type Assign<xs extends readonly any[]> = Prettify<
  UnionToIntersection<xs[number]>
>;

export type GetFromPath<Obj, path> = RecursiveGet<Obj, ParsePath<path>>;

type ParsePath<
  path,
  output extends string[] = [],
  currentChunk extends string = ""
> = path extends number
  ? [`${path}`]
  : path extends `${infer first}${infer rest}`
  ? first extends "." | "[" | "]"
    ? ParsePath<
        rest,
        [...output, ...(currentChunk extends "" ? [] : [currentChunk])],
        ""
      >
    : ParsePath<rest, output, `${currentChunk}${first}`>
  : [...output, ...(currentChunk extends "" ? [] : [currentChunk])];

type RecursiveGet<Obj, pathList> = Obj extends any
  ? pathList extends [infer first, ...infer rest]
    ? first extends keyof Obj
      ? RecursiveGet<Obj[first], rest>
      : [first, Obj] extends [`${number}` | "number", any[]]
      ? RecursiveGet<Extract<Obj, any[]>[number], rest>
      : undefined
    : Obj
  : never;

export type Update<obj, path, fnOrValue> = RecursiveUpdate<
  obj,
  ParsePath<path>,
  fnOrValue
>;

type RecursiveUpdate<obj, pathList, fnOrValue> = obj extends any
  ? pathList extends [infer first, ...infer rest]
    ? first extends keyof obj
      ? {
          [K in keyof obj]: Equal<first, K> extends true
            ? RecursiveUpdate<obj[K], rest, fnOrValue>
            : obj[K];
        }
      : [first, obj] extends ["number", any[]]
      ? RecursiveUpdate<Extract<obj, any[]>[number], rest, fnOrValue>[]
      : undefined
    : fnOrValue extends Fn
    ? Call<Extract<fnOrValue, Fn>, obj>
    : fnOrValue
  : never;

export type Create<
  pattern,
  args extends unknown[]
> = pattern extends infer p extends Fn
  ? Apply<p, args>
  : pattern extends Primitive
  ? pattern
  : pattern extends [any, ...any]
  ? { [key in keyof pattern]: Create<pattern[key], args> }
  : pattern extends (infer V)[]
  ? Create<V, args>[]
  : pattern extends object
  ? { [key in keyof pattern]: Create<pattern[key], args> }
  : pattern;

type JoinPath<A extends string, B extends string> = [A] extends [never]
  ? B
  : [B] extends [never]
  ? A
  : `${A}.${B}`;

export type AllPaths<T, ParentPath extends string = never> = T extends Primitive
  ? ParentPath
  : unknown extends T
  ? JoinPath<ParentPath, string>
  : T extends any[]
  ? Keys<T> extends infer key extends string | number
    ? `${ParentPath}[${key}]` | AllPaths<T[number], `${ParentPath}[${key}]`>
    : never
  : keyof T extends infer key extends keyof T & string
  ? key extends any
    ? JoinPath<ParentPath, key> | AllPaths<T[key], JoinPath<ParentPath, key>>
    : never
  : ParentPath;
