import { Args } from "../args/Args";
import { Booleans as B } from "../booleans/Booleans";
import { Call, Call2, Fn } from "../core/Core";
import { Functions as F } from "../functions/Functions";
import { Numbers as N } from "../numbers/Numbers";
import { Iterator, Stringifiable } from "../helpers";

export namespace Tuples {
  type HeadImpl<xs> = xs extends readonly [infer head, ...any] ? head : never;

  export interface Head extends Fn {
    output: HeadImpl<this["args"][0]>;
  }

  type TailImpl<xs> = xs extends readonly [any, ...infer tail] ? tail : never;

  export interface Tail extends Fn {
    output: TailImpl<this["args"][0]>;
  }

  type LastImpl<xs> = xs extends readonly [...any, infer last] ? last : never;

  export interface Last extends Fn {
    output: LastImpl<this["args"][0]>;
  }

  interface MapFn<fn extends Fn> extends Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? [...acc, Call<fn, item>]
      : never;
  }

  export interface Map<fn extends Fn> extends Fn {
    output: ReduceImpl<this["args"][0], [], MapFn<fn>>;
  }

  interface FlatMapFn<fn extends Fn> extends Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? [...acc, ...Extract<Call<fn, item>, readonly any[]>]
      : never;
  }

  export interface FlatMap<fn extends Fn> extends Fn {
    output: ReduceImpl<this["args"][0], [], FlatMapFn<fn>>;
  }

  type ReduceImpl<xs, acc, fn extends Fn> = xs extends [
    infer first,
    ...infer rest
  ]
    ? ReduceImpl<rest, Call2<fn, acc, first>, fn>
    : acc;

  export interface Reduce<fn extends Fn, init> extends Fn {
    output: ReduceImpl<this["args"][0], init, fn>;
  }

  type ReduceRightImpl<xs, acc, fn extends Fn> = xs extends [
    ...infer rest,
    infer last
  ]
    ? ReduceRightImpl<rest, Call2<fn, acc, last>, fn>
    : acc;

  export interface ReduceRight<fn extends Fn, init> extends Fn {
    output: ReduceRightImpl<this["args"][0], init, fn>;
  }

  interface FilterFn<fn extends Fn> extends Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? Call<fn, item> extends true
        ? [...acc, item]
        : acc
      : never;
  }

  export interface Filter<fn extends Fn> extends Fn {
    output: ReduceImpl<this["args"][0], [], FilterFn<fn>>;
  }

  type FindImpl<xs, fn extends Fn, index extends any[] = []> = xs extends [
    infer first,
    ...infer rest
  ]
    ? Call2<fn, first, index["length"]> extends true
      ? first
      : FindImpl<rest, fn, [...index, any]>
    : never;

  export interface Find<fn extends Fn> extends Fn {
    output: FindImpl<this["args"][0], fn>;
  }

  export interface Sum extends Fn {
    output: ReduceImpl<this["args"][0], 0, N.Add>;
  }

  export type Range<n, acc extends any[] = []> = acc["length"] extends n
    ? acc
    : Range<n, [...acc, acc["length"]]>;

  type DropImpl<
    xs extends readonly any[],
    n extends any[]
  > = Iterator.Get<n> extends 0
    ? xs
    : xs extends readonly [any, ...infer tail]
    ? DropImpl<tail, Iterator.Prev<n>>
    : [];

  export interface Drop<n extends number> extends Fn {
    output: DropImpl<
      Extract<this["args"][0], readonly any[]>,
      Iterator.Iterator<n>
    >;
  }

  type TakeImpl<
    xs extends readonly any[],
    it extends any[],
    output extends any[] = []
  > = Iterator.Get<it> extends 0
    ? output
    : xs extends readonly [infer head, ...infer tail]
    ? TakeImpl<tail, Iterator.Prev<it>, [...output, head]>
    : output;

  export interface Take<n extends number> extends Fn {
    output: TakeImpl<
      Extract<this["args"][0], readonly any[]>,
      Iterator.Iterator<n>
    >;
  }

  type TakeWhileImpl<
    xs extends readonly any[],
    fn extends Fn,
    index extends any[] = [],
    output extends any[] = []
  > = xs extends readonly [infer head, ...infer tail]
    ? Call2<fn, head, index["length"]> extends true
      ? TakeWhileImpl<tail, fn, [...index, any], [...output, head]>
      : output
    : output;

  export interface TakeWhile<fn extends Fn> extends Fn {
    output: TakeWhileImpl<Extract<this["args"][0], readonly any[]>, fn>;
  }

  export interface Some<fn extends Fn> extends Fn {
    output: true extends Call<Tuples.Map<fn>, this["args"][0]>[number]
      ? true
      : false;
  }

  export interface Every<fn extends Fn> extends Fn {
    output: false extends Call<Tuples.Map<fn>, this["args"][0]>[number]
      ? false
      : true;
  }

  type SortImpl<xs extends any[], LessThanOrEqual extends Fn> = xs extends [
    infer head,
    ...infer tail
  ]
    ? [
        ...SortImpl<
          Call<Tuples.Filter<F.Bind<LessThanOrEqual, [Args._, head]>>, tail>,
          LessThanOrEqual
        >,
        head,
        ...SortImpl<
          Call<
            Tuples.Filter<
              F.Compose<[B.Not, F.Bind<LessThanOrEqual, [Args._, head]>]>
            >,
            tail
          >,
          LessThanOrEqual
        >
      ]
    : [];

  export interface Sort<LessThanOrEqual extends Fn = N.LessThanOrEqual>
    extends Fn {
    output: this["args"] extends [infer xs extends any[]]
      ? SortImpl<xs, LessThanOrEqual>
      : never;
  }

  interface JoinReducer<sep extends string> extends Fn {
    output: this["args"] extends [
      infer acc extends Stringifiable,
      infer item extends Stringifiable
    ]
      ? `${acc extends "" ? "" : `${acc}${sep}`}${item}`
      : never;
  }

  /**
   * Join a tuple into a single string.
   * @param args[0] - The tuple to join.
   * @param sep - The separator to join the strings with.
   * @returns The joined string.
   * @example
   * ```ts
   * type T0 = Call<Tuples.Join<",">,["a","b","c"]>; // "a,b,c"
   * ```
   */
  export interface Join<sep extends string> extends Fn {
    output: ReduceImpl<this["args"][0], "", JoinReducer<sep>>;
  }
}
