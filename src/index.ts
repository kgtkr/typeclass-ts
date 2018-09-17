import { Type, Keys } from "./hkt";
import { Omit } from "type-zoo";

export const prototypeSymbol = Symbol();
type Cast<T, P> = T extends P ? T : P;
type ParamsType<T> = T extends (...args: infer P) => any ? P : any[];
export type TypeClassNoDefaultDefine<S extends Keys> = <D extends Partial<Type<S, unknown>>>(d: D) => TypeClassModules<S, D>;
export type TypeClassDefine<S extends Keys, D extends Partial<Type<S, unknown>>> = <T>(impl: Omit<Type<S, T>, keyof D> & Pick<Partial<Type<S, T>>, keyof D>) => TypeClassImpl<S, T>;
export interface TypeClassImpl<S extends Keys, T> {
  symbol: S,
  impl: Type<S, T>
}
export type ImpledData<Props, S extends Keys> = {
  [prototypeSymbol]: {
    [P in S]: Type<P, ImpledData<Props, S>>
  }
} & Props;

export interface TypeClassModules<S extends Keys, D extends Partial<Type<S, unknown>>> {
  typeClass: TypeClassDefine<S, D>,
  funcs: {
    [P in keyof Type<S, unknown>]: <T extends ImpledData<{}, S>>(...x: ParamsType<Type<S, T>[P]>) => ReturnType<Cast<Type<S, T>[P], (...args: any[]) => any>>
  };
}

function geneFuncs<S extends Keys>(s: S): any {
  return new Proxy({}, {
    get: (_obj, name) => {
      return (...x: any[]) => self[prototypeSymbol][s][name](...x)
    }
  });
}

export function TypeClass<S extends Keys>(s: S): TypeClassNoDefaultDefine<S> {
  return <D extends Partial<Type<S, unknown>>>(d: D): TypeClassModules<S, D> => {
    return {
      typeClass: <T>(impl: Omit<Type<S, T>, keyof D> & Pick<Partial<Type<S, T>>, keyof D>): TypeClassImpl<S, T> => {
        return {
          symbol: s,
          impl: {
            ...d as any,
            ...impl as any
          } as Type<S, T>
        };
      },
      funcs: 1
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
  return <S extends Keys>(...impls: TypeClassImpl<S, ImpledData<Props, S>>[]) => {
    const implMap = toImplMap(impls);
    return (props: Props): ImpledData<Props, S> => {
      return {
        ...props as any,
        [prototypeSymbol]: implMap
      };
    };
  };
}