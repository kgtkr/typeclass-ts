import { Type, Keys } from "./hkt";
import { Omit } from "type-zoo";
export const prototypeSymbol = Symbol();
export interface TypeClassImpl<S extends Keys, T> {
  symbol: S,
  impl: Type<S, T>
}
export type ImpledData<Props, S extends Keys> = {
  [prototypeSymbol]: {
    [P in S]: Type<P, ImpledData<Props, S>>
  }
} & Props;

export function TypeClass<S extends Keys>(s: S) {
  return <D extends Partial<Type<S, ImpledData<{}, S>>>>(d: D) => {
    return <T extends ImpledData<{}, S>>(impl: Omit<Type<S, T>, keyof D> & Pick<Partial<Type<S, T>>, keyof D>): TypeClassImpl<S, T> => {
      return {
        symbol: s,
        impl: {
          ...d as any,
          ...impl as any
        } as Type<S, T>
      };
    };
  };
}

function toImplMap<T, S extends Keys>(impls: TypeClassImpl<S, T>[]): { [P in S]: Type<P, T> } {
  const map: any = {};
  for (let impl of impls) {
    map[impl.symbol] = impl.impl;
  }
  return map;
}

export function Data<Props>() {
  return <S extends Keys>(...impls: TypeClassImpl<S, Props>[]) => {
    const implMap = toImplMap(impls);
    return (props: Props): ImpledData<Props, S> => {
      return {
        ...props as any,
        [prototypeSymbol]: implMap
      };
    };
  };
}