import { Type, Keys } from "./hkt";
import { Omit } from "type-zoo";

export const prototypeSymbol = Symbol();

// 実装のある型クラス
export type TypeClassImpl<S extends Keys, T> = {
  [P in S]: TypeImpl<P, T>
};

// 型クラスを実装したデータ型
export type ImpledData<Props, S extends Keys> = {
  [prototypeSymbol]: TypeClassImpl<S, Props>
} & Props;

// TにSを実装するヘルパー
type TypeImpl<S extends Keys, T> = Type<S, ImpledData<T, S>>;

// 定義
export function TypeClass<S extends Keys>(s: S) {
  // デフォルト実装
  return <D extends Partial<TypeImpl<S, {}>>>(d: D) => {
    // 実装
    return <T extends {}>(impl: Omit<TypeImpl<S, T>, keyof D> & Pick<Partial<TypeImpl<S, T>>, keyof D>): TypeClassImpl<S, T> => {
      return {
        [s]: {
          ...d as any,
          ...impl as any
        },
      } as any;
    };
  };
}

export function Data<Props>() {
  return <S extends Keys>(impl: TypeClassImpl<S, Props>) => {
    return (props: Props): ImpledData<Props, S> => {
      return {
        ...props as any,
        [prototypeSymbol]: impl
      };
    };
  };
}