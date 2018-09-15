export const prototypeSymbol = Symbol();
interface TypeClass<T> {
  [prototypeSymbol]: T
}
const showSymbol = Symbol();
interface showTypeProps<T> {
  show: (self: T) => string
}
interface showTypePrototype<T> {
  [showSymbol]: showTypeProps<T>
}
interface showType<T> extends TypeClass<showTypePrototype<T>> { };
function show<T extends showType<T>>(self: T): string {
  return self[prototypeSymbol][showSymbol].show(self);
}
const showTypeDefault: Pick<showTypeProps<any>, "show"> = {
  show: x => JSON.stringify(x)
};

const eqSymbol = Symbol();
interface eqTypeProps<T> {
  eq: (self: T, other: T) => boolean
}
interface eqTypeProtoType<T> {
  [eqSymbol]: eqTypeProps<T>
}
interface eqType<T> extends TypeClass<eqTypeProtoType<T>> { };
function eq<T extends eqType<T>>(self: T, other: T): boolean {
  return self[prototypeSymbol][eqSymbol].eq(self, other);
}
const eqTypeDefault: Pick<eqTypeProps<any>, never> = {
};

interface MyDataProps {
  x: number,
  y: number
}
interface MyDataPrototype extends showTypePrototype<MyData>, eqTypeProtoType<MyData> {
}
interface MyData extends MyDataProps, TypeClass<MyDataPrototype> {
};
const MyDataShowInstance: showTypeProps<MyData> = {
  ...showTypeDefault,
  show: self => `(${self.x},${self.y})`
};
const MyDataEqInstance: eqTypeProps<MyData> = {
  ...eqTypeDefault,
  eq: (self, other) => self.x === other.x && self.y === other.y
};
const MyDataPrototype: MyDataPrototype = {
  [showSymbol]: MyDataShowInstance,
  [eqSymbol]: MyDataEqInstance
};
function MyData(props: MyDataProps): MyData {
  return {
    ...props,
    [prototypeSymbol]: MyDataPrototype
  };
}

show(MyData({ x: 1, y: 2 }))