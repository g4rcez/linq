import { reduce } from "./reduce";
import { Grouped } from "./typing";

export const groupBy = <GENERICS>(key: keyof GENERICS, array: GENERICS[]) =>
	reduce(
		(g, el) => {
			const name: keyof GENERICS = el[key] as never;
			const chunk = g[name] || [];
			g[name] = chunk;
			g[name].push(el as any);
			return g;
		},
		{} as Grouped<GENERICS>,
		array,
	);
