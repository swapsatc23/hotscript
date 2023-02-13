import {
  Apply,
  Call,
  Call2,
  Eval,
  Fn,
  Pipe,
  PipeRight,
} from "./internals/core/Core";
import { Functions } from "./internals/functions/Functions";
import { Numbers } from "./internals/numbers/Numbers";
import { Objects } from "./internals/objects/Objects";
import { Strings } from "./internals/strings/Strings";
import { Tuples } from "./internals/tuples/Tuples";
import { Unions } from "./internals/unions/Unions";
import { Booleans } from "./internals/booleans/Booleans";

export {
  Fn,
  Pipe,
  PipeRight,
  Call,
  Call2,
  Apply,
  Eval,
  Booleans,
  Objects,
  Unions,
  Strings,
  Numbers,
  Tuples,
  Functions,
  Booleans as B,
  Objects as O,
  Unions as U,
  Strings as S,
  Numbers as N,
  Tuples as T,
  Functions as F,
};
