import { Omit, Overwrite } from "type-zoo";

const metadataSymbol = Symbol();

function defineTypeClass<P extends object, T extends D, D extends {}>(defaultObj: D, sym: symbol) {
  return function (obj: Omit<T, keyof D> & Partial<D>) {
    const data = { ...defaultObj as any, ...obj as any };
    return function (props: P): Overwrite<P, { [metadataSymbol]: T }> {
      return {
        ...props as any,
        [metadataSymbol]: { [sym]: data }
      }
    }
  }
}

type X<T extends symbol> = { [K in T]: any };

const x: void = undefined;