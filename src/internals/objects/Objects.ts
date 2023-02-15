import { Args } from "../args/Args";
import {
  GetFromPath,
  IsArrayStrict,
  Prettify,
  UnionToIntersection,
} from "../helpers";
import { Call, Call2, Fn, unset } from "../core/Core";
import { Std } from "../std/Std";
import { Strings } from "../strings/Strings";
import { Functions } from "../functions/Functions";

export namespace Objects {
  type FromEntriesImpl<entries extends [PropertyKey, any]> = {
    [entry in entries as entry[0]]: entry[1];
  };

  export interface FromEntries extends Fn {
    return: FromEntriesImpl<Extract<Fn.arg0<this>, [PropertyKey, any]>>;
  }

  type EntriesImpl<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T];

  export interface Entries extends Fn {
    return: EntriesImpl<Fn.arg0<this>>;
  }

  type MapValuesImpl<T, fn extends Fn> = {
    [K in keyof T]: Call2<fn, T[K], K>;
  };

  export interface MapValues<fn extends Fn> extends Fn {
    return: MapValuesImpl<Fn.arg0<this>, fn>;
  }

  type MapKeysImpl<T, fn extends Fn> = {
    [K in keyof T as Extract<Call<fn, K>, PropertyKey>]: T[K];
  };

  export interface MapKeys<fn extends Fn> extends Fn {
    return: MapKeysImpl<Fn.arg0<this>, fn>;
  }

  export interface KebabCase extends Fn {
    return: Call<MapKeys<Strings.KebabCase>, Fn.arg0<this>>;
  }

  export interface SnakeCase extends Fn {
    return: Call<MapKeys<Strings.SnakeCase>, Fn.arg0<this>>;
  }

  export interface CamelCase extends Fn {
    return: Call<MapKeys<Strings.CamelCase>, Fn.arg0<this>>;
  }

  type MapKeysDeepImpl<T, fn extends Fn> = IsArrayStrict<T> extends true
    ? MapKeysDeepImpl<Extract<T, readonly any[]>[number], fn>[]
    : T extends object
    ? {
        [K in keyof T as Extract<Call<fn, K>, PropertyKey>]: Prettify<
          MapKeysDeepImpl<T[K], fn>
        >;
      }
    : T;

  export interface MapKeysDeep<fn extends Fn> extends Fn {
    return: MapKeysDeepImpl<Fn.arg0<this>, fn>;
  }

  export interface KebabCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.KebabCase>, Fn.arg0<this>>;
  }

  export interface SnakeCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.SnakeCase>, Fn.arg0<this>>;
  }

  export interface CamelCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.CamelCase>, Fn.arg0<this>>;
  }

  type PickImpl<obj, keys> = {
    [key in Extract<keyof obj, keys>]: obj[key];
  };

  export type Pick<key = unset, obj = unset> = Functions.PartialApply<
    PickFn,
    [key, obj]
  >;

  interface PickFn extends Fn {
    return: PickImpl<Fn.arg1<this>, Fn.arg0<this>>;
  }

  type OmitImpl<obj, keys> = {
    [key in Exclude<keyof obj, keys>]: obj[key];
  };

  export type Omit<key = unset, obj = unset> = Functions.PartialApply<
    OmitFn,
    [key, obj]
  >;

  interface OmitFn extends Fn {
    return: OmitImpl<Fn.arg1<this>, Fn.arg0<this>>;
  }

  type PickEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? entries
      : never
    : never;

  type PickByImpl<T, fn extends Fn> = FromEntriesImpl<
    PickEntriesImpl<EntriesImpl<T>, fn>
  >;

  export interface PickBy<fn extends Fn> extends Fn {
    return: PickByImpl<Fn.arg0<this>, fn>;
  }

  type OmitEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? never
      : entries
    : never;

  type OmitByImpl<T, fn extends Fn> = FromEntriesImpl<
    OmitEntriesImpl<EntriesImpl<T>, fn>
  >;

  export interface OmitBy<fn extends Fn> extends Fn {
    return: OmitByImpl<Fn.arg0<this>, fn>;
  }

  type AssignImpl<xs extends readonly any[]> = Prettify<
    UnionToIntersection<xs[number]>
  >;

  export type Assign<
    arg1 = unset,
    arg2 = unset,
    arg3 = unset,
    arg4 = unset,
    arg5 = unset
  > = Functions.PartialApply<AssignFn, [arg1, arg2, arg3, arg4, arg5]>;

  interface AssignFn extends Fn {
    return: AssignImpl<Fn.args<this>>;
  }

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
              ...(key extends keyof acc
                ? Extract<acc[key], readonly any[]>
                : []),
              first
            ];
          }
        >
      : never
    : acc;

  type GroupByImpl<xs, fn extends Fn> = Prettify<GroupByImplRec<xs, fn>>;

  export interface GroupBy<fn extends Fn> extends Fn {
    return: GroupByImpl<Fn.arg0<this>, fn>;
  }

  export type Get<
    path extends string | number | Args._ | unset = unset,
    obj = unset
  > = Functions.PartialApply<GetFn, [path, obj]>;

  export interface GetFn extends Fn {
    return: Fn.args<this> extends [
      infer path extends string | number,
      infer obj,
      ...any
    ]
      ? GetFromPath<obj, path>
      : never;
  }
}
