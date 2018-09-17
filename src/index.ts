import { PhantomType } from "./phantom";
import { Type, Keys } from "./hkt";
import { Omit } from "type-zoo";

export const prototypeSymbol = Symbol();

export function TypeClass<S extends Keys>(s: S) {
  return function <D extends Partial<Type<S, unknown>>>(d: D) {
    return function <T>(impl: Omit<Type<S, T>, keyof D> & Pick<Partial<Type<S, T>>, keyof D>) {
      return {
        symbol: s,
        impl: {
          ...d as any,
          ...impl as any
        } as Type<S, T>
      };
    }
  };
}

