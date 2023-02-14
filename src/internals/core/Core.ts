import { RemoveUnknownArrayConstraint } from "../helpers";

export interface Fn {
  args: unknown[];
  output: unknown;
}

export type Apply<fn extends Fn, args extends unknown[]> = (fn & {
  args: args;
})["output"];

export type Call<fn extends Fn, arg1> = (fn & {
  args: [arg1];
})["output"];

export type Eval<fn extends Fn> = (fn & {
  args: [];
})["output"];

export type Call2<fn extends Fn, arg1, arg2> = (fn & {
  args: [arg1, arg2];
})["output"];

export type Call3<fn extends Fn, arg1, arg2, arg3> = (fn & {
  args: [arg1, arg2, arg3];
})["output"];

export type Call4<fn extends Fn, arg1, arg2, arg3, arg4> = (fn & {
  args: [arg1, arg2, arg3, arg3];
})["output"];

export type Pipe<acc, xs extends Fn[]> = xs extends [
  infer first extends Fn,
  ...infer rest extends Fn[]
]
  ? Pipe<Call<first, acc>, rest>
  : acc;

export type PipeRight<xs extends Fn[], acc> = xs extends [
  ...infer rest extends Fn[],
  infer last extends Fn
]
  ? PipeRight<rest, Call<last, acc>>
  : acc;

/**
 * Misc
 */

export type placeholder = "@hotscript/placeholder";

type ExcludePlaceholders<xs, output extends any[] = []> = xs extends [
  infer first,
  ...infer rest
]
  ? first extends placeholder
    ? ExcludePlaceholders<rest, output>
    : ExcludePlaceholders<rest, [...output, first]>
  : output;

type MergeArgsRec<
  inputArgs extends any[],
  partialArgs extends any[],
  output extends any[] = []
> = partialArgs extends [infer partialFirst, ...infer partialRest]
  ? partialFirst extends placeholder
    ? inputArgs extends [infer inputFirst, ...infer inputRest]
      ? MergeArgsRec<inputRest, partialRest, [...output, inputFirst]>
      : [...output, ...ExcludePlaceholders<partialRest>]
    : MergeArgsRec<inputArgs, partialRest, [...output, partialFirst]>
  : [...output, ...inputArgs];

type NeverIntoPlaceholder<x> = [x] extends [never] ? placeholder : x;

type MapNeverIntoPlaceholder<xs, output extends any[] = []> = xs extends [
  infer first,
  ...infer rest
]
  ? MapNeverIntoPlaceholder<rest, [...output, NeverIntoPlaceholder<first>]>
  : output;

/**
 * Special case if the arity of the function is 2, we want the first
 * partial argument to be position as the second one so that expressions
 * like:
 *  - Call<Booleans.Extends<string>, 2>
 *  - Call<Number.GreaterThan<5>, 10>
 *  - etc
 * return `true` instead of false.
 */
type UpdatePartialArgs<partialArgs extends any[]> = partialArgs extends [
  infer a,
  never
]
  ? [placeholder, NeverIntoPlaceholder<a>]
  : MapNeverIntoPlaceholder<partialArgs>;

export type MergeArgs<
  inputArgs extends any[],
  partialArgs extends any[]
> = MergeArgsRec<
  RemoveUnknownArrayConstraint<inputArgs>,
  UpdatePartialArgs<partialArgs>
>;
