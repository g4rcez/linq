import { skip } from "./skip";

export const first = <T>(array: T[]) => array[0];

export const last = <T>(array: T[]) => array[array.length - 1];

export const tail = <T>(array: T[]) => skip(array, 1);

export const at = <T>(array: T[], index: number) => array.at(index);
