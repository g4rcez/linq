import { GetOperationFromSymbol } from "../symbols";
import { filter } from "./filter";
import { ArrayCallbackAssertion, Maybe, Symbols } from "./typing";

export const whereSymbol = <Input, Output>(
  func: <V>(array: Input[], callback: ArrayCallbackAssertion<Input>) => Output,
  array: Input[],
  args?: ArrayCallbackAssertion<Input> | Maybe<keyof Input>,
  symbol?: Symbols,
  value?: unknown
) => {
  if (typeof args === "function") return func(array, args);
  const op = GetOperationFromSymbol(symbol!);
  if (!!args && !!symbol && value !== undefined) return func(array, (x) => op(x[args], value));
  return func(array, (x) => op(x, value));
};


export const where = <T extends unknown>(
  array: T[],
  args?: ArrayCallbackAssertion<T> | Maybe<keyof T>,
  symbol?: Symbols,
  value?: unknown
) => whereSymbol<T, T[]>(filter, array, args, symbol, value);
