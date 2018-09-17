import { PhantomType } from "./phantom";

const prototypeSymbol = Symbol();

function TypeClass<S extends symbol, Funcs extends object>(s: S) {
  return function <D extends Partial<Funcs>>(d: D) {
    /*
    return {
      symbol: s,
      default: d,
      type: PhantomType<T>()
    };
    */
  };
}

