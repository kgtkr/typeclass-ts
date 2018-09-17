export interface HKT<T> {

}

export type Keys = keyof HKT<any>;
export type Type<K extends Keys, T> = HKT<T>[K];